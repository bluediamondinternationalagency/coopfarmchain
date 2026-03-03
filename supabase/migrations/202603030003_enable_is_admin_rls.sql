create or replace function public.is_admin_user()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.stewards s
    where s.id = auth.uid()
      and s.is_admin = true
  );
$$;

drop policy if exists "stewards_admin_read_all" on public.stewards;
create policy "stewards_admin_read_all"
on public.stewards
for select
to authenticated
using (
  coalesce((auth.jwt() ->> 'email'), '') = 'admin@farmchain.coop'
  or public.is_admin_user()
);

drop policy if exists "stewards_admin_update_all" on public.stewards;
create policy "stewards_admin_update_all"
on public.stewards
for update
to authenticated
using (
  coalesce((auth.jwt() ->> 'email'), '') = 'admin@farmchain.coop'
  or public.is_admin_user()
)
with check (
  coalesce((auth.jwt() ->> 'email'), '') = 'admin@farmchain.coop'
  or public.is_admin_user()
);
