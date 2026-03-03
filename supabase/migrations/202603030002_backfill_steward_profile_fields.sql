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

update public.stewards as s
set
  phone = coalesce(s.phone, nullif(u.raw_user_meta_data ->> 'phone', '')),
  gender = coalesce(s.gender, nullif(u.raw_user_meta_data ->> 'gender', '')),
  age_band = coalesce(
    s.age_band,
    nullif(u.raw_user_meta_data ->> 'age_band', ''),
    nullif(u.raw_user_meta_data ->> 'ageBand', '')
  ),
  updated_at = now()
from auth.users as u
where s.id = u.id
  and (
    s.phone is null
    or s.gender is null
    or s.age_band is null
  );
