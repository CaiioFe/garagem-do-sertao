-- Marca se a equipe ja foi confirmada pela propria equipe (usou o codigo de edicao
-- real ao menos uma vez). Times pre-cadastrados pela imprensa comecam nao verificados,
-- pra deixar claro no app que os dados ainda nao foram confirmados por quem de direito.
alter table public.teams add column if not exists verified boolean not null default false;

create or replace function public.update_team(p_team_id uuid, p_token text, p jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_valid_team_token(p_team_id, p_token) then
    raise exception 'invalid token';
  end if;
  update public.teams set
    name = coalesce(p->>'name', name),
    city = coalesce(p->>'city', city),
    state = coalesce(p->>'state', state),
    logo_url = coalesce(p->>'logo_url', logo_url),
    cover_url = coalesce(p->>'cover_url', cover_url),
    description = coalesce(p->>'description', description),
    instagram = coalesce(p->>'instagram', instagram),
    whatsapp = coalesce(p->>'whatsapp', whatsapp),
    website = coalesce(p->>'website', website),
    sponsors = coalesce((select array_agg(x) from jsonb_array_elements_text(p->'sponsors') x), sponsors),
    founded_year = coalesce(nullif(p->>'founded_year','')::int, founded_year),
    verified = true
  where id = p_team_id;
end;
$$;
