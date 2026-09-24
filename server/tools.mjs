import { z } from 'zod';
const id = z.string().uuid();
const date = z.iso.date();
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
const empty = z.object({}).strict();
export const schemas = {
  get_accounts: empty,
  list_transactions: z.object({ from: date.optional(), to: date.optional(), account_id: id.optional(), category_id: id.optional(), type: z.enum(['income','expense']).optional(), limit: z.number().int().min(1).max(100).default(50), offset: z.number().int().min(0).max(100000).default(0) }).strict(),
  get_monthly_summary: z.object({ month }).strict(),
  get_category_spending: z.object({ month, category_id: id.optional() }).strict(),
  get_credit_cards: empty,
  get_debts: empty,
};
export const descriptions = {
  get_accounts: 'Read own accounts and computed balances, including active transfers.',
  list_transactions: 'Read own active transactions. Dates inclusive; deterministic pagination. Receipt files are excluded.',
  get_monthly_summary: 'Read income, expense and net for YYYY-MM using recorded transaction dates; transfers excluded.',
  get_category_spending: 'Read expense totals by category for YYYY-MM. Transfers excluded.',
  get_credit_cards: 'Read card profiles, computed outstanding balances and recorded statements. Statement amounts are historical, not remaining due.',
  get_debts: 'Read tracked credit-card debt only. Kira has no persisted general-loan/debt ledger; this is not a complete debt inventory.',
};
const columns = {
  accounts: 'id,name,account_type,opening_balance',
  transactions: 'id,account_id,category_id,type,amount,transaction_date,description',
  account_transfers: 'id,from_account_id,to_account_id,amount,transfer_date',
  categories: 'id,name',
  credit_cards: 'id,account_id,card_name,issuer,last_four,credit_limit,is_active',
  credit_card_statements: 'id,credit_card_id,statement_date,due_date,statement_balance,amount_due,minimum_payment',
};
const money = x => Math.round((x + Number.EPSILON) * 100) / 100;
export function balances(accounts, transactions, transfers) {
  return accounts.map(a => ({ ...a, balance: money(transactions.filter(t => t.account_id === a.id).reduce((n,t) => n + (t.type === 'income' ? 1 : -1) * Number(t.amount), Number(a.opening_balance)) + transfers.reduce((n,t) => n + (t.from_account_id === a.id ? -Number(t.amount) : t.to_account_id === a.id ? Number(t.amount) : 0), 0)) }));
}
export function reader(db, userId) {
  function query(table) {
    let q = db.from(table).select(columns[table], { count: 'exact' }).eq('user_id', userId);
    if (['transactions','account_transfers'].includes(table)) q = q.is('deleted_at', null);
    return q.order('id');
  }
  async function all(table, filter = q => q) {
    const rows = [];
    // Small pages work with standard PostgREST row caps. Never return a knowingly partial total.
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
    return c.map(card => ({...card, outstanding: money(Math.max(0,-(a.find(x => x.id === card.account_id)?.balance || 0))), statements: s.filter(x=>x.credit_card_id===card.id).sort((x,y)=>y.statement_date.localeCompare(x.statement_date))}));
  }
  return async (name, input) => {
    const args = schemas[name].parse(input);
    if (name === 'get_accounts') return { accounts: await accounts() };
    if (name === 'get_credit_cards') return { cards: await cards(), statement_note: 'Recorded statement amounts; not remaining statement due.' };
    if (name === 'get_debts') {
      const c = await cards();
      return { coverage: 'credit_cards_only', general_debts_supported: false, debts: c.filter(x=>x.outstanding>0).map(({id,card_name,outstanding})=>({id,name:card_name,outstanding})), total: money(c.reduce((n,x)=>n+x.outstanding,0)) };
    }
    if (name === 'list_transactions') {
      if (args.from && args.to && args.from > args.to) throw new Error('Invalid date range');
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
      return {month:args.month,income:sum('income'),expense:sum('expense'),net:money(sum('income')-sum('expense')), transfers_excluded:true};
    }
    const categories = await all('categories');
    const totals = new Map();
    t.filter(x=>x.type==='expense' && (!args.category_id || x.category_id===args.category_id)).forEach(x=>totals.set(x.category_id,(totals.get(x.category_id)||0)+Number(x.amount)));
    return {month:args.month,categories:[...totals].map(([category_id,total])=>({category_id,name:categories.find(x=>x.id===category_id)?.name||'Uncategorised',total:money(total)}))};
  };
}
