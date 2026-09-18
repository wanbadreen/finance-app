
-- Phase 16 operational hardening:
-- Keep existing CRUD behavior, remove elevated table privileges from browser users,
-- prevent anonymous table access, hide trigger-only helper RPC,
-- and make future postgres-owned public objects opt-in for client access.

revoke all privileges
on all tables in schema public
from anon;

revoke truncate, references, trigger, maintain
on all tables in schema public
from authenticated;

revoke execute
on function public.set_updated_at()
from public, anon, authenticated;

alter default privileges in schema public
  revoke all privileges on tables from anon, authenticated;

alter default privileges in schema public
  revoke all privileges on sequences from anon, authenticated;

alter default privileges in schema public
  revoke execute on functions from public, anon, authenticated;
