import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { configuration, authenticator } from '../server/auth.mjs';
const config=configuration();
const a=process.env.MCP_TEST_TOKEN_A;
const b=process.env.MCP_TEST_TOKEN_B;
if(!a||!b)throw Error('Supply two separate test-user OAuth tokens in ignored .env.mcp-test. Never paste tokens into logs.');
const auth=authenticator(config);
const users=await Promise.all([auth(a),auth(b)]);
assert.notEqual(users[0].userId,users[1].userId);
for(const [i,context] of users.entries()) {
  for(const table of ['accounts','transactions','account_transfers','categories','credit_cards','credit_card_statements']) {
    const own=await context.db.from(table).select('id,user_id').eq('user_id',context.userId).limit(1);
    assert.equal(own.error,null,`${table}: own query failed`);
    if(table==='accounts')assert.ok(own.data.length,'Create an account for each test user before testing.');
    const foreign=await context.db.from(table).select('id').eq('user_id',users[1-i].userId).limit(1);
    assert.equal(foreign.error,null,`${table}: foreign query failed`);
    assert.equal(foreign.data.length,0,`${table}: cross-user RLS leak`);
  }
}
console.log('Two-user RLS read checks passed. No records were written.');
