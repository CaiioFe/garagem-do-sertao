-- Corrige localização do pgcrypto (Supabase instala em "extensions", não "public")
create extension if not exists pgcrypto schema extensions;

create or replace function public.gen_edit_token() returns text
language sql as $$
  select upper(substr(encode(extensions.gen_random_bytes(6), 'hex'), 1, 4)) || '-' || upper(substr(encode(extensions.gen_random_bytes(6), 'hex'), 5, 4));
$$;

create or replace function public.is_admin_pin(p_pin text) returns boolean
language plpgsql security definer set search_path = public, extensions as $$
declare
  h text;
begin
  select value into h from public.app_config where key = 'admin_pin_hash';
  if h is null or p_pin is null then return false; end if;
  return h = extensions.crypt(p_pin, h);
end;
$$;

-- reaplica o hash do PIN admin (a inserção original pode ter falhado por falta de crypt())
insert into public.app_config (key, value)
values ('admin_pin_hash', extensions.crypt('029132', extensions.gen_salt('bf')))
on conflict (key) do update set value = excluded.value;
