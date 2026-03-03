create table if not exists public.stewards (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null unique,
  phone text,
  gender text check (gender in ('male', 'female')),
  age_band text check (age_band in ('16-20', '21-35', '36-50', '50+')),
  selected_path_id text check (selected_path_id in ('asset', 'coop', 'learn')),
  has_paid boolean not null default false,
  approval_status text not null default 'pending' check (approval_status in ('pending', 'applied', 'approved', 'enrolled')),
  commitment_note text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.stewards add column if not exists name text;
alter table public.stewards add column if not exists email text;
alter table public.stewards add column if not exists phone text;
alter table public.stewards add column if not exists gender text;
alter table public.stewards add column if not exists age_band text;
alter table public.stewards add column if not exists selected_path_id text;
alter table public.stewards add column if not exists has_paid boolean;
alter table public.stewards add column if not exists approval_status text;
alter table public.stewards add column if not exists commitment_note text;
alter table public.stewards add column if not exists is_admin boolean;
alter table public.stewards add column if not exists created_at timestamptz;
alter table public.stewards add column if not exists updated_at timestamptz;

update public.stewards
set
  name = coalesce(name, ''),
  has_paid = coalesce(has_paid, false),
  approval_status = coalesce(approval_status, 'pending'),
  is_admin = coalesce(is_admin, false),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now());

alter table public.stewards alter column name set default '';
alter table public.stewards alter column has_paid set default false;
alter table public.stewards alter column approval_status set default 'pending';
alter table public.stewards alter column is_admin set default false;
alter table public.stewards alter column created_at set default now();
alter table public.stewards alter column updated_at set default now();

create index if not exists stewards_approval_status_idx on public.stewards (approval_status);
create index if not exists stewards_created_at_idx on public.stewards (created_at desc);

create or replace function public.set_stewards_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_stewards_updated_at on public.stewards;
create trigger trg_stewards_updated_at
before update on public.stewards
for each row
execute function public.set_stewards_updated_at();

create or replace function public.handle_new_user_steward()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.stewards (id, email, name, phone, gender, age_band)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    nullif(new.raw_user_meta_data ->> 'gender', ''),
    coalesce(
      nullif(new.raw_user_meta_data ->> 'age_band', ''),
      nullif(new.raw_user_meta_data ->> 'ageBand', '')
    )
  )
  on conflict (id) do update
    set email = excluded.email,
        name = coalesce(nullif(public.stewards.name, ''), excluded.name),
        phone = coalesce(public.stewards.phone, excluded.phone),
        gender = coalesce(public.stewards.gender, excluded.gender),
        age_band = coalesce(public.stewards.age_band, excluded.age_band);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_steward on auth.users;
create trigger on_auth_user_created_steward
after insert on auth.users
for each row
execute function public.handle_new_user_steward();

alter table public.stewards enable row level security;

drop policy if exists "stewards_select_own" on public.stewards;
create policy "stewards_select_own"
on public.stewards
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "stewards_update_own" on public.stewards;
create policy "stewards_update_own"
on public.stewards
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "stewards_insert_own" on public.stewards;
create policy "stewards_insert_own"
on public.stewards
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "stewards_admin_read_all" on public.stewards;
create policy "stewards_admin_read_all"
on public.stewards
for select
to authenticated
using (coalesce((auth.jwt() ->> 'email'), '') = 'admin@farmchain.coop');

drop policy if exists "stewards_admin_update_all" on public.stewards;
create policy "stewards_admin_update_all"
on public.stewards
for update
to authenticated
using (coalesce((auth.jwt() ->> 'email'), '') = 'admin@farmchain.coop')
with check (coalesce((auth.jwt() ->> 'email'), '') = 'admin@farmchain.coop');
