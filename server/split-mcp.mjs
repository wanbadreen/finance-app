import { z } from 'zod';
import { progress, totals } from '../split-core.mjs';

const uuid = z.string().uuid();
const date = z.iso.date();
const participantId = z.string().trim().min(1).max(80).regex(/^[A-Za-z0-9_-]+$/, 'Use letters, numbers, underscore or hyphen for participant IDs');
const shortId = z.string().trim().min(1).max(120);
const money = z.number().finite().min(0).max(1000000).refine(
  value => Math.abs(value * 100 - Math.round(value * 100)) < 1e-8,
  { message: 'Amount must have at most two decimal places' }
);
const positiveMoney = money.refine(value => value > 0, { message: 'Amount must be greater than zero' });
const participantToken = z.string().regex(/^[a-f0-9]{64}$/i);
const openAIFile = z.object({
  download_url: z.url(),
  file_id: z.string().min(1),
  mime_type: z.string().optional(),
  file_name: z.string().optional()
}).strict();

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const RECEIPT_MIME_EXTENSIONS = new Map([
  ['image/jpeg','jpg'],
  ['image/png','png'],
  ['image/webp','webp'],
  ['application/pdf','pdf']
]);

const participantSchema = z.object({
  id: participantId,
  name: z.string().trim().min(1).max(60),
  is_self: z.boolean().default(false),
  payment_instructions: z.string().max(1000).optional()
}).strict();

const itemSchema = z.object({
  id: shortId.optional(),
  name: z.string().trim().min(1).max(120),
  amount: positiveMoney,
  participant_ids: z.array(participantId).min(1).max(50)
}).strict();

const shopPaymentSchema = z.object({
  id: shortId.optional(),
  participant_id: participantId,
  amount: positiveMoney,
  account_id: uuid.optional()
}).strict();

const planLineSchema = z.object({
  from_participant_id: participantId,
  to_participant_id: participantId,
  amount: positiveMoney
}).strict();

export const splitSchemas = {
  get_split_bill_options: z.object({}).strict(),
  list_split_bills: z.object({
    limit: z.number().int().min(1).max(100).default(20),
    offset: z.number().int().min(0).max(500).default(0)
  }).strict(),
  get_split_bill: z.object({
    bill_id: uuid,
    participant_token: participantToken.optional()
  }).strict(),
  create_split_bill: z.object({
    name: z.string().trim().min(1).max(120),
    date,
    mode: z.enum(['equal','items','mixed']),
    participants: z.array(participantSchema).min(2).max(50),
    items: z.array(itemSchema).min(1).max(200),
    discount_amount: money.default(0),
    extra_charge_amount: money.default(0),
    charge_split: z.enum(['proportional','equal']).default('proportional'),
    shop_payments: z.array(shopPaymentSchema).min(1).max(100),
    category_id: uuid,
    account_id: uuid,
    linked_transaction_id: uuid.optional(),
    repayment_plan: z.array(planLineSchema).max(2500).optional(),
    confirmed: z.literal(true)
  }).strict(),
  update_split_bill_participant: z.object({
    bill_id: uuid,
    revision: z.number().int().min(1),
    participant_id: participantId,
    name: z.string().trim().min(1).max(60),
    payment_instructions: z.string().max(1000).default(''),
    confirmed: z.literal(true)
  }).strict(),
  set_split_bill_repayment_plan: z.object({
    bill_id: uuid,
    revision: z.number().int().min(1),
    plan: z.array(planLineSchema).max(2500),
    confirmed: z.literal(true)
  }).strict(),
  create_split_bill_participant_link: z.object({
    bill_id: uuid,
    revision: z.number().int().min(1),
    participant_id: participantId,
    confirmed: z.literal(true)
  }).strict(),
  report_split_bill_payment: z.object({
    bill_id: uuid,
    revision: z.number().int().min(1),
    from_participant_id: participantId,
    to_participant_id: participantId,
    amount: positiveMoney,
    payment_date: date,
    reference: z.string().max(500).optional(),
    proof: openAIFile.optional(),
    participant_token: participantToken.optional(),
    confirmed: z.literal(true)
  }).strict(),
  decide_split_bill_payment: z.object({
    bill_id: uuid,
    revision: z.number().int().min(1),
    payment_id: shortId,
    decision: z.enum(['confirmed','rejected']),
    account_id: uuid.optional(),
    participant_token: participantToken.optional(),
    confirmed: z.literal(true)
  }).strict(),
  cancel_split_bill: z.object({
    bill_id: uuid,
    revision: z.number().int().min(1),
    confirmed: z.literal(true)
  }).strict()
};

export const splitDescriptions = {
  get_split_bill_options: 'Read the active Kira accounts, expense categories, and recent ordinary expenses that can be used when preparing a Split Bill. Read this before creating or linking a split bill.',
  list_split_bills: 'List the authenticated user’s active Split Bills as compact summaries. Use get_split_bill for full details, current revision, participant IDs, repayment lines, and payment history.',
  get_split_bill: 'Read one Split Bill. Without participant_token this returns the creator view. With a participant capability token it returns only that participant’s scoped view.',
  create_split_bill: 'Create a Kira Split Bill and its accounting projections. Amount inputs are in MYR, not sen. Participant IDs are short stable labels such as me, aina, zairul and are used by items, shop payments and repayment plans. Financial allocations become immutable after save. Read get_split_bill_options first, show the exact bill breakdown, shop payers, account/category and any linked expense, then only call after explicit user confirmation.',
  update_split_bill_participant: 'Edit a Split Bill participant name and payment instructions. Read the latest bill first and use its current revision. This does not change financial allocations. Only call after explicit user confirmation.',
  set_split_bill_repayment_plan: 'Replace the repayment routing for a Split Bill before any non-rejected repayment has been reported. The plan must exactly settle every participant balance. Read the latest bill first, show the proposed routes, and only call after explicit user confirmation.',
  create_split_bill_participant_link: 'Create or rotate a private participant capability link. Creating a new link for a participant invalidates that participant’s previous link. Read the latest bill first, warn if a link already exists, and only call after explicit user confirmation.',
  report_split_bill_payment: 'Record a partial or full Split Bill repayment report. This does not move real bank money and remains pending until confirmed. Optionally attach one JPG, PNG, WebP or PDF proof up to 5 MB. Read the latest bill first, show payer, recipient, amount, date and proof, then only call after explicit user confirmation.',
  decide_split_bill_payment: 'Confirm or reject a pending Split Bill repayment. Creator confirmation records that the creator acted on the recipient’s behalf. If the repayment affects the creator’s own cash, account_id can select the Kira account; otherwise the bill default account is used. Read the latest bill first and only call after explicit user confirmation.',
  cancel_split_bill: 'Cancel a Split Bill before any pending or confirmed repayment exists. This restores a linked original expense or removes generated split projections, but never reverses real money already paid. Participant links stop working. Read the latest bill, show the impact, and only call after explicit user confirmation.'
};

export const splitWriteTools = new Set([
  'create_split_bill',
  'update_split_bill_participant',
  'set_split_bill_repayment_plan',
  'create_split_bill_participant_link',
  'report_split_bill_payment',
  'decide_split_bill_payment',
  'cancel_split_bill'
]);

export const splitDestructiveTools = new Set(['cancel_split_bill']);
export const splitFileParams = new Map([['report_split_bill_payment',['proof']]]);

const toCents = value => Math.round(Number(value || 0) * 100);
const fromCents = value => Math.round(Number(value || 0)) / 100;

function randomId(prefix) {
  return prefix + '-' + crypto.randomUUID();
}

function planInput(lines) {
  if (!lines) return undefined;
  return lines.map((line,index) => ({
    id:'mcp-plan-' + index + '-' + line.from_participant_id + '-' + line.to_participant_id,
    from:line.from_participant_id,
    to:line.to_participant_id,
    cents:toCents(line.amount)
  }));
}

function summarizeBill(bill) {
  const t = totals(bill);
  const p = progress(bill);
  return {
    id:bill.id,
    name:bill.name,
    date:bill.date,
    revision:bill.revision,
    mode:bill.mode,
    total_amount:fromCents(t.total),
    participant_count:bill.participants.length,
    participants:bill.participants.map(person => ({
      id:person.id,
      name:person.name,
      is_self:Boolean(person.isSelf),
      has_link:Boolean(person.hasLink)
    })),
    repayment_remaining:fromCents(p.remaining),
    pending_payment_count:p.pending,
    complete:p.complete,
    linked_transaction_id:bill.linkedTransactionId || null
  };
}

function safeFunctionError(error) {
  const direct = typeof error?.message === 'string' ? error.message : '';
  return direct || 'Split Bill request failed';
}

async function invokeSplit(db, input) {
  const {data,error} = await db.functions.invoke('split-bill',{body:input});
  if (error) {
    let message = safeFunctionError(error);
    try {
      const body = await error.context?.json();
      if (body?.error) message = body.error;
    } catch {}
    throw new Error('KIRA_INPUT:' + message);
  }
  if (data?.error) throw new Error('KIRA_INPUT:' + data.error);
  return data;
}

function sniffMime(bytes) {
  if (bytes.length >= 5
    && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44
    && bytes[3] === 0x46 && bytes[4] === 0x2d) return 'application/pdf';
  if (bytes.length >= 8
    && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47
    && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) return 'image/png';
  if (bytes.length >= 3
    && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes.length >= 12
    && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46
    && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return 'image/webp';
  return null;
}

async function proofPayload(file) {
  const url = new URL(file.download_url);
  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error('KIRA_INPUT:Proof download URL must be a secure ChatGPT-provided HTTPS URL.');
  }
  let response;
  try {
    response = await fetch(url,{redirect:'follow'});
  } catch {
    throw new Error('KIRA_INPUT:Unable to download the attached proof from ChatGPT. Reattach the file and try again.');
  }
  if (!response.ok) {
    throw new Error('KIRA_INPUT:Unable to download the attached proof from ChatGPT. Reattach the file and try again.');
  }
  const declaredLength = Number(response.headers.get('content-length') || 0);
  if (declaredLength > MAX_FILE_SIZE) throw new Error('KIRA_INPUT:Proof must be 5 MB or smaller.');
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (!bytes.length) throw new Error('KIRA_INPUT:Proof file is empty.');
  if (bytes.length > MAX_FILE_SIZE) throw new Error('KIRA_INPUT:Proof must be 5 MB or smaller.');
  const mimeType = sniffMime(bytes);
  if (!mimeType || !RECEIPT_MIME_EXTENSIONS.has(mimeType)) {
    throw new Error('KIRA_INPUT:Proof must be a valid JPG, PNG, WebP or PDF file.');
  }
  return {type:mimeType,base64:Buffer.from(bytes).toString('base64')};
}

async function splitOptions(db) {
  const [accountsRes,categoriesRes,transactionsRes] = await Promise.all([
    db.from('accounts').select('id,name,account_type,is_active').eq('is_active',true).order('name'),
    db.from('categories').select('id,name,type,is_active').eq('is_active',true).order('name'),
    db.from('transactions')
      .select('id,account_id,category_id,description,amount,cash_amount,type,transaction_date,recurring_id,linked_transfer_id,split_bill_id,deleted_at')
      .eq('type','expense')
      .is('deleted_at',null)
      .is('split_bill_id',null)
      .is('recurring_id',null)
      .is('linked_transfer_id',null)
      .order('transaction_date',{ascending:false})
      .limit(100)
  ]);
  if (accountsRes.error || categoriesRes.error || transactionsRes.error) {
    throw new Error('Database read failed');
  }
  return {
    accounts:(accountsRes.data || []).map(({id,name,account_type})=>({id,name,account_type})),
    categories:(categoriesRes.data || [])
      .filter(item=>['expense','both'].includes(item.type))
      .map(({id,name,type})=>({id,name,type})),
    eligible_expenses:(transactionsRes.data || []).map(item=>({
      id:item.id,
      date:item.transaction_date,
      description:item.description,
      amount:Number(item.cash_amount ?? item.amount),
      account_id:item.account_id,
      category_id:item.category_id
    }))
  };
}

export function createSplitRunner(db, options = {}) {
  let appOrigin = options.appOrigin || null;
  if (!appOrigin) {
    try { appOrigin = new URL(process.env.MCP_RESOURCE_URL || '').origin; } catch {}
  }

  return async function runSplit(name,args) {
    if (name === 'get_split_bill_options') return splitOptions(db);

    if (name === 'list_split_bills') {
      const result = await invokeSplit(db,{action:'list'});
      const rows = (result.bills || []).slice(args.offset,args.offset + args.limit);
      return {
        split_bills:rows.map(summarizeBill),
        total_count:(result.bills || []).length,
        next_offset:args.offset + args.limit < (result.bills || []).length ? args.offset + args.limit : null
      };
    }

    if (name === 'get_split_bill') {
      return invokeSplit(db,{
        action:'get',
        id:args.bill_id,
        ...(args.participant_token ? {token:args.participant_token} : {})
      });
    }

    if (name === 'create_split_bill') {
      const bill = {
        name:args.name,
        date:args.date,
        mode:args.mode,
        participants:args.participants.map(person=>({
          id:person.id,
          name:person.name,
          isSelf:person.is_self === true,
          instructions:person.payment_instructions || ''
        })),
        items:args.items.map(item=>({
          id:item.id || randomId('item'),
          name:item.name,
          cents:toCents(item.amount),
          participants:item.participant_ids
        })),
        discountCents:toCents(args.discount_amount),
        chargeCents:toCents(args.extra_charge_amount),
        chargeMode:args.charge_split,
        paid:args.shop_payments.map(payment=>({
          id:payment.id || randomId('shop'),
          participantId:payment.participant_id,
          cents:toCents(payment.amount),
          accountId:payment.account_id || null
        })),
        categoryId:args.category_id,
        accountId:args.account_id,
        ...(args.linked_transaction_id ? {linkedTransactionId:args.linked_transaction_id} : {}),
        ...(args.repayment_plan ? {plan:planInput(args.repayment_plan)} : {})
      };
      return invokeSplit(db,{action:'create',bill});
    }

    if (name === 'update_split_bill_participant') {
      return invokeSplit(db,{
        action:'person',
        id:args.bill_id,
        revision:args.revision,
        participantId:args.participant_id,
        name:args.name,
        instructions:args.payment_instructions
      });
    }

    if (name === 'set_split_bill_repayment_plan') {
      return invokeSplit(db,{
        action:'plan',
        id:args.bill_id,
        revision:args.revision,
        plan:planInput(args.plan)
      });
    }

    if (name === 'create_split_bill_participant_link') {
      const result = await invokeSplit(db,{
        action:'link',
        id:args.bill_id,
        revision:args.revision,
        participantId:args.participant_id
      });
      return {
        ...result,
        participant_link:appOrigin && result.token
          ? appOrigin + '/split.html#' + args.bill_id + '.' + result.token
          : null
      };
    }

    if (name === 'report_split_bill_payment') {
      const proof = args.proof ? await proofPayload(args.proof) : undefined;
      return invokeSplit(db,{
        action:'report',
        id:args.bill_id,
        revision:args.revision,
        ...(args.participant_token ? {token:args.participant_token} : {}),
        payment:{
          id:randomId('payment'),
          from:args.from_participant_id,
          to:args.to_participant_id,
          cents:toCents(args.amount),
          date:args.payment_date,
          reference:args.reference || ''
        },
        ...(proof ? {proof} : {})
      });
    }

    if (name === 'decide_split_bill_payment') {
      return invokeSplit(db,{
        action:'decision',
        id:args.bill_id,
        revision:args.revision,
        ...(args.participant_token ? {token:args.participant_token} : {}),
        paymentId:args.payment_id,
        decision:args.decision,
        ...(args.account_id ? {accountId:args.account_id} : {})
      });
    }

    if (name === 'cancel_split_bill') {
      return invokeSplit(db,{
        action:'cancel',
        id:args.bill_id,
        revision:args.revision
      });
    }

    throw new Error('Unsupported Split Bill MCP tool');
  };
}
