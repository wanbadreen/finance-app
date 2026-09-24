import { z } from 'zod';

const id = z.string().uuid();
const date = z.iso.date();
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
const empty = z.object({}).strict();
const transactionType = z.enum(['income','expense']);
const moneyInput = z.number().finite().positive().max(999999999.99).refine(
  value => Math.abs(value * 100 - Math.round(value * 100)) < 1e-8,
  { message: 'Amount must have at most two decimal places' }
);
const percentInput = z.number().finite().min(0).max(100).optional();

export const schemas = {
  get_accounts: empty,
  list_transactions: z.object({
    from: date.optional(),
    to: date.optional(),
    account_id: id.optional(),
    category_id: id.optional(),
    type: transactionType.optional(),
    limit: z.number().int().min(1).max(100).default(50),
    offset: z.number().int().min(0).max(100000).default(0)
  }).strict(),
  get_monthly_summary: z.object({ month }).strict(),
  get_category_spending: z.object({ month, category_id: id.optional() }).strict(),
  get_credit_cards: empty,
  get_debts: empty,
  get_transaction_options: z.object({ type: transactionType.optional() }).strict(),
  create_transaction: z.object({
    type: transactionType,
    amount: moneyInput,
    transaction_date: date,
    description: z.string().trim().min(1).max(200),
    account_id: id,
    category_id: id,
    income_source_id: id.optional(),
    payment_method_id: id.optional(),
    notes: z.string().trim().max(1000).optional(),
    confirmed: z.literal(true)
  }).strict(),
  edit_transaction: z.object({
    transaction_id: id,
    type: transactionType.optional(),
    amount: moneyInput.optional(),
    transaction_date: date.optional(),
    description: z.string().trim().min(1).max(200).optional(),
    account_id: id.optional(),
    category_id: id.optional(),
    income_source_id: id.nullable().optional(),
    payment_method_id: id.nullable().optional(),
    notes: z.string().trim().max(1000).nullable().optional(),
    confirmed: z.literal(true)
  }).strict().refine(
    value => ['type','amount','transaction_date','description','account_id','category_id','income_source_id','payment_method_id','notes']
      .some(key => Object.prototype.hasOwnProperty.call(value,key)),
    { message: 'At least one transaction field must be changed' }
  ),
  delete_transaction: z.object({
    transaction_id: id,
    confirmed: z.literal(true)
  }).strict(),
  create_account_transfer: z.object({
    from_account_id: id,
    to_account_id: id,
    amount: moneyInput,
    transfer_date: date,
    description: z.string().trim().min(1).max(200),
    notes: z.string().trim().max(1000).optional(),
    fee_percent: percentInput,
    confirmed: z.literal(true)
  }).strict(),
};

export const descriptions = {
  get_accounts: 'Read own accounts and computed balances, including active transfers.',
  list_transactions: 'Read own active transactions. Dates inclusive; deterministic pagination. Receipt files are excluded.',
  get_monthly_summary: 'Read income, expense and net for YYYY-MM using recorded transaction dates; transfers excluded.',
  get_category_spending: 'Read expense totals by category for YYYY-MM. Transfers excluded.',
  get_credit_cards: 'Read card profiles, computed outstanding balances and recorded statements. Statement amounts are historical, not remaining due.',
  get_debts: 'Read tracked credit-card debt only. Kira has no persisted general-loan/debt ledger; this is not a complete debt inventory.',
  get_transaction_options: 'Read active Kira accounts, categories, income sources and payment methods needed to prepare a transaction or transfer. Use this to resolve names to IDs before any write.',
  create_transaction: 'Create one Kira income or expense transaction. Never use for transfers, edits or deletes. Call get_transaction_options first to resolve IDs. Only call after the user explicitly confirms the exact transaction details; set confirmed=true only after that confirmation.',
  edit_transaction: 'Edit one existing ordinary Kira income or expense transaction. Never edit automatic transfer-fee or recurring-generated transactions. First identify the exact transaction with list_transactions, resolve any changed references with get_transaction_options, show the proposed before/after values, and only call after explicit user confirmation.',
  delete_transaction: 'Delete one existing ordinary Kira income or expense transaction by soft-deleting it. Never delete automatic transfer-fee or recurring-generated transactions. First identify the exact transaction with list_transactions, show what will be deleted, and only call after explicit user confirmation.',
  create_account_transfer: 'Record one transfer between two of the user’s own active Kira accounts. This records a Kira balance transfer; it does not move real bank money. Resolve account IDs first and only call after the user explicitly confirms source, destination, amount, date and any fee.',
};

const columns = {
  accounts: 'id,name,account_type,opening_balance,is_active',
  transactions: 'id,account_id,category_id,income_source_id,payment_method_id,type,amount,transaction_date,description,notes,receipt_path,recurring_id,recurring_due_date,recurring_next_due_date,linked_transfer_id',
  account_transfers: 'id,from_account_id,to_account_id,amount,transfer_date,description,notes,fee_percent',
  categories: 'id,name,type,is_active',
  income_sources: 'id,name,is_active',
  payment_methods: 'id,name,method_type,system_key,is_active,sort_order',
  credit_cards: 'id,account_id,card_name,issuer,last_four,credit_limit,is_active',
  credit_card_statements: 'id,credit_card_id,statement_date,due_date,statement_balance,amount_due,minimum_payment',
};

const money = x => Math.round((x + Number.EPSILON) * 100) / 100;
const inputError = message => new Error(`KIRA_INPUT:${message}`);

export function balances(accounts, transactions, transfers) {
  return accounts.map(a => ({
    ...a,
    balance: money(
      transactions
        .filter(t => t.account_id === a.id)
        .reduce((n,t) => n + (t.type === 'income' ? 1 : -1) * Number(t.amount), Number(a.opening_balance))
      + transfers.reduce(
        (n,t) => n + (t.from_account_id === a.id ? -Number(t.amount) : t.to_account_id === a.id ? Number(t.amount) : 0),
        0
      )
    )
  }));
}

export function reader(db, userId) {
  function query(table) {
    let q = db.from(table).select(columns[table], { count: 'exact' }).eq('user_id', userId);
    if (['transactions','account_transfers'].includes(table)) q = q.is('deleted_at', null);
    return q.order('id');
  }

  async function all(table, filter = q => q) {
    const rows = [];
    for (let offset = 0; offset < 100000; offset += 100) {
      const { data, error, count } = await filter(query(table)).range(offset, offset + 99);
      if (error) throw new Error('Database read failed');
      rows.push(...data);
      if (data.length < 100) {
        if (count != null && rows.length < count) throw new Error('Database row cap prevents complete aggregation');
        return rows;
      }
    }
    throw new Error('Dataset exceeds safe aggregation limit');
  }

  async function accounts() {
    const [a,t,x] = await Promise.all([all('accounts'),all('transactions'),all('account_transfers')]);
    return balances(a,t,x);
  }

  async function cards() {
    const [a,c,s] = await Promise.all([accounts(),all('credit_cards'),all('credit_card_statements')]);
    return c.map(card => ({
      ...card,
      outstanding: money(Math.max(0,-(a.find(x => x.id === card.account_id)?.balance || 0))),
      statements: s.filter(x=>x.credit_card_id===card.id).sort((x,y)=>y.statement_date.localeCompare(x.statement_date))
    }));
  }

  async function transactionOptions(type) {
    const [a,c,i,p] = await Promise.all([
      all('accounts'),
      all('categories'),
      all('income_sources'),
      all('payment_methods')
    ]);
    return {
      accounts: a.filter(x=>x.is_active).map(({id,name,account_type})=>({id,name,account_type})),
      categories: c
        .filter(x=>x.is_active && (!type || x.type===type))
        .map(({id,name,type})=>({id,name,type})),
      income_sources: (!type || type==='income')
        ? i.filter(x=>x.is_active).map(({id,name})=>({id,name}))
        : [],
      payment_methods: p
        .filter(x=>x.is_active)
        .sort((x,y)=>Number(x.sort_order)-Number(y.sort_order) || x.name.localeCompare(y.name))
        .map(({id,name,method_type,system_key})=>({id,name,method_type,system_key}))
    };
  }

  async function createTransaction(args) {
    const [a,c,i,p] = await Promise.all([
      all('accounts'),
      all('categories'),
      all('income_sources'),
      all('payment_methods')
    ]);

    const account = a.find(x=>x.id===args.account_id && x.is_active);
    if (!account) throw inputError('Choose an active account that belongs to this Kira user.');

    const category = c.find(x=>x.id===args.category_id && x.is_active);
    if (!category) throw inputError('Choose an active category that belongs to this Kira user.');
    if (![args.type,'both'].includes(category.type)) throw inputError(`Category "${category.name}" does not match transaction type "${args.type}".`);

    let incomeSource = null;
    if (args.type === 'income') {
      if (!args.income_source_id) throw inputError('Income transactions require an active income source.');
      incomeSource = i.find(x=>x.id===args.income_source_id && x.is_active);
      if (!incomeSource) throw inputError('Choose an active income source that belongs to this Kira user.');
    } else if (args.income_source_id) {
      throw inputError('Expense transactions must not include an income source.');
    }

    let paymentMethod = null;
    if (args.payment_method_id) {
      paymentMethod = p.find(x=>x.id===args.payment_method_id && x.is_active);
      if (!paymentMethod) throw inputError('Choose an active payment method that belongs to this Kira user.');
    }

    const payload = {
      user_id: userId,
      account_id: account.id,
      payment_method_id: paymentMethod?.id || null,
      category_id: category.id,
      income_source_id: incomeSource?.id || null,
      description: args.description.trim(),
      notes: args.notes?.trim() || null,
      amount: money(args.amount),
      type: args.type,
      transaction_date: args.transaction_date,
      receipt_path: null,
      recurring_id: null,
      recurring_due_date: null,
      recurring_next_due_date: null,
      linked_transfer_id: null,
    };

    const { data, error } = await db
      .from('transactions')
      .insert(payload)
      .select('id,account_id,category_id,income_source_id,payment_method_id,description,notes,amount,type,transaction_date')
      .single();

    if (error || !data) throw new Error('Database write failed');

    return {
      created: true,
      transaction: {
        ...data,
        amount: money(Number(data.amount)),
        account_name: account.name,
        category_name: category.name,
        income_source_name: incomeSource?.name || null,
        payment_method_name: paymentMethod?.name || null,
      }
    };
  }

  async function editTransaction(args) {
    const [transactions, a, c, i, p] = await Promise.all([
      all('transactions'),
      all('accounts'),
      all('categories'),
      all('income_sources'),
      all('payment_methods')
    ]);

    const existing = transactions.find(x => x.id === args.transaction_id);
    if (!existing) throw inputError('Transaction not found for this Kira user.');
    if (existing.linked_transfer_id) throw inputError('Automatic transfer-fee transactions cannot be edited directly.');
    if (existing.recurring_id) throw inputError('Recurring-generated transactions cannot be edited through ChatGPT yet.');

    const nextType = args.type ?? existing.type;
    const accountId = args.account_id ?? existing.account_id;
    const categoryId = args.category_id ?? existing.category_id;
    const incomeSourceId = Object.prototype.hasOwnProperty.call(args,'income_source_id')
      ? args.income_source_id
      : existing.income_source_id;
    const paymentMethodId = Object.prototype.hasOwnProperty.call(args,'payment_method_id')
      ? args.payment_method_id
      : existing.payment_method_id;

    const account = a.find(x => x.id === accountId && (x.is_active || x.id === existing.account_id));
    if (!account) throw inputError('Choose an active account that belongs to this Kira user.');

    const category = c.find(x => x.id === categoryId && (x.is_active || x.id === existing.category_id));
    if (!category) throw inputError('Choose an active category that belongs to this Kira user.');
    if (![nextType,'both'].includes(category.type)) {
      throw inputError(`Category "${category.name}" does not match transaction type "${nextType}".`);
    }

    let incomeSource = null;
    if (nextType === 'income') {
      if (!incomeSourceId) throw inputError('Income transactions require an active income source.');
      incomeSource = i.find(x => x.id === incomeSourceId && (x.is_active || x.id === existing.income_source_id));
      if (!incomeSource) throw inputError('Choose an active income source that belongs to this Kira user.');
    } else if (incomeSourceId) {
      throw inputError('Expense transactions must not include an income source.');
    }

    let paymentMethod = null;
    if (paymentMethodId) {
      paymentMethod = p.find(x => x.id === paymentMethodId && (x.is_active || x.id === existing.payment_method_id));
      if (!paymentMethod) throw inputError('Choose an active payment method that belongs to this Kira user.');
    }

    const payload = {
      account_id: account.id,
      payment_method_id: paymentMethod?.id || null,
      category_id: category.id,
      income_source_id: incomeSource?.id || null,
      description: args.description ?? existing.description,
      notes: Object.prototype.hasOwnProperty.call(args,'notes')
        ? (args.notes?.trim() || null)
        : (existing.notes || null),
      amount: money(Number(args.amount ?? existing.amount)),
      type: nextType,
      transaction_date: args.transaction_date ?? existing.transaction_date,
    };

    const { data, error } = await db
      .from('transactions')
      .update(payload)
      .eq('id', existing.id)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .select('id,account_id,category_id,income_source_id,payment_method_id,description,notes,amount,type,transaction_date')
      .single();

    if (error || !data) throw new Error('Database write failed');

    return {
      updated: true,
      before: {
        id: existing.id,
        type: existing.type,
        amount: money(Number(existing.amount)),
        transaction_date: existing.transaction_date,
        description: existing.description,
        account_id: existing.account_id,
        category_id: existing.category_id,
        income_source_id: existing.income_source_id,
        payment_method_id: existing.payment_method_id,
        notes: existing.notes || null,
      },
      transaction: {
        ...data,
        amount: money(Number(data.amount)),
        account_name: account.name,
        category_name: category.name,
        income_source_name: incomeSource?.name || null,
        payment_method_name: paymentMethod?.name || null,
      }
    };
  }

  async function deleteTransaction(args) {
    const transactions = await all('transactions');
    const existing = transactions.find(x => x.id === args.transaction_id);
    if (!existing) throw inputError('Transaction not found for this Kira user.');
    if (existing.linked_transfer_id) throw inputError('Automatic transfer-fee transactions cannot be deleted directly.');
    if (existing.recurring_id) throw inputError('Recurring-generated transactions cannot be deleted through ChatGPT yet.');

    const deletedAt = new Date().toISOString();
    const { data, error } = await db
      .from('transactions')
      .update({ deleted_at: deletedAt })
      .eq('id', existing.id)
      .eq('user_id', userId)
      .is('deleted_at', null)
      .select('id,description,amount,type,transaction_date,deleted_at')
      .single();

    if (error || !data) throw new Error('Database write failed');

    return {
      deleted: true,
      deletion_mode: 'soft_delete',
      transaction: {
        ...data,
        amount: money(Number(data.amount))
      }
    };
  }

  async function createAccountTransfer(args) {
    const a = await all('accounts');
    const from = a.find(x => x.id === args.from_account_id && x.is_active);
    const to = a.find(x => x.id === args.to_account_id && x.is_active);

    if (!from) throw inputError('Choose an active source account that belongs to this Kira user.');
    if (!to) throw inputError('Choose an active destination account that belongs to this Kira user.');
    if (from.id === to.id) throw inputError('Source and destination accounts must be different.');

    const normalisedDestination = String(to.name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g,'');

    const defaultFeePercent =
      from.account_type === 'credit_card'
      && to.account_type === 'e_wallet'
      && (normalisedDestination.includes('tng') || normalisedDestination.includes('touchngo'))
        ? 1
        : 0;

    const feePercent = args.fee_percent ?? defaultFeePercent;
    if (!Number.isFinite(feePercent) || feePercent < 0 || feePercent > 100) {
      throw inputError('Transfer fee percentage must be between 0 and 100.');
    }

    const payload = {
      user_id: userId,
      from_account_id: from.id,
      to_account_id: to.id,
      amount: money(args.amount),
      transfer_date: args.transfer_date,
      description: args.description.trim(),
      notes: args.notes?.trim() || null,
      fee_percent: feePercent
    };

    const { data, error } = await db
      .from('account_transfers')
      .insert(payload)
      .select('id,from_account_id,to_account_id,amount,transfer_date,description,notes,fee_percent')
      .single();

    if (error || !data) throw new Error('Database write failed');

    return {
      created: true,
      transfer: {
        ...data,
        amount: money(Number(data.amount)),
        fee_percent: Number(data.fee_percent || 0),
        fee_amount: money(Number(data.amount) * Number(data.fee_percent || 0) / 100),
        from_account_name: from.name,
        to_account_name: to.name
      },
      note: 'This records an internal Kira account transfer only; it does not move money at a bank or wallet provider.'
    };
  }

  return async (name, input) => {
    const args = schemas[name].parse(input);

    if (name === 'get_accounts') return { accounts: await accounts() };
    if (name === 'get_transaction_options') return transactionOptions(args.type);
    if (name === 'create_transaction') return createTransaction(args);
    if (name === 'edit_transaction') return editTransaction(args);
    if (name === 'delete_transaction') return deleteTransaction(args);
    if (name === 'create_account_transfer') return createAccountTransfer(args);

    if (name === 'get_credit_cards') {
      return { cards: await cards(), statement_note: 'Recorded statement amounts; not remaining statement due.' };
    }

    if (name === 'get_debts') {
      const c = await cards();
      return {
        coverage: 'credit_cards_only',
        general_debts_supported: false,
        debts: c.filter(x=>x.outstanding>0).map(({id,card_name,outstanding})=>({id,name:card_name,outstanding})),
        total: money(c.reduce((n,x)=>n+x.outstanding,0))
      };
    }

    if (name === 'list_transactions') {
      if (args.from && args.to && args.from > args.to) throw inputError('The start date must not be after the end date.');
      let q = query('transactions');
      for (const key of ['account_id','category_id','type']) if (args[key]) q = q.eq(key,args[key]);
      if (args.from) q = q.gte('transaction_date',args.from);
      if (args.to) q = q.lte('transaction_date',args.to);
      const {data,error} = await q.range(args.offset,args.offset+args.limit);
      if (error) throw new Error('Database read failed');
      return { transactions:data.slice(0,args.limit), next_offset:data.length>args.limit?args.offset+args.limit:null };
    }

    const [year,m] = args.month.split('-').map(Number);
    const end = `${m===12?year+1:year}-${String(m===12?1:m+1).padStart(2,'0')}-01`;
    const t = await all('transactions',q=>q.gte('transaction_date',`${args.month}-01`).lt('transaction_date',end));

    if (name === 'get_monthly_summary') {
      const sum = type => money(t.filter(x=>x.type===type).reduce((n,x)=>n+Number(x.amount),0));
      return {
        month:args.month,
        income:sum('income'),
        expense:sum('expense'),
        net:money(sum('income')-sum('expense')),
        transfers_excluded:true
      };
    }

    const categories = await all('categories');
    const totals = new Map();
    t.filter(x=>x.type==='expense' && (!args.category_id || x.category_id===args.category_id))
      .forEach(x=>totals.set(x.category_id,(totals.get(x.category_id)||0)+Number(x.amount)));
    return {
      month:args.month,
      categories:[...totals].map(([category_id,total])=>({
        category_id,
        name:categories.find(x=>x.id===category_id)?.name||'Uncategorised',
        total:money(total)
      }))
    };
  };
}
