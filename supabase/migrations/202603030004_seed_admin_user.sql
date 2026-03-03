update public.stewards
set is_admin = true,
    updated_at = now()
where lower(email) = 'bluediamondinternationalagency@gmail.com';
