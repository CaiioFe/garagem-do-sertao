-- Analytics leve, sem login: visualizacoes anonimas por fingerprint (mesmo fingerprint ja usado nas curtidas)
create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('team', 'vehicle', 'partner', 'page')),
  ref_id text not null,
  fingerprint text not null,
  created_at timestamptz not null default now()
);

create index if not exists page_views_kind_ref_idx on public.page_views(kind, ref_id);
create index if not exists page_views_created_idx on public.page_views(created_at);

alter table public.page_views enable row level security;

-- Insercao aberta (fire and forget, sem PII alem do fingerprint anonimo ja usado em likes).
-- Sem policy de select: ninguem le a tabela direto, so via RPC admin abaixo.
drop policy if exists "anon logs views" on public.page_views;
create policy "anon logs views" on public.page_views for insert to anon, authenticated with check (true);

create or replace function public.admin_get_stats(p_pin text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  result jsonb;
begin
  if not public.is_admin_pin(p_pin) then
    raise exception 'invalid pin';
  end if;

  select jsonb_build_object(
    'total_views', (select count(*) from public.page_views),
    'unique_visitors', (select count(distinct fingerprint) from public.page_views),
    'total_likes', (select coalesce(sum(likes_count), 0) from public.vehicles),
    'views_by_team', (
      select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb) from (
        select tm.name, tm.slug, count(pv.id) as views
        from public.page_views pv
        join public.teams tm on tm.id::text = pv.ref_id
        where pv.kind = 'team'
        group by tm.id, tm.name, tm.slug
        order by views desc
        limit 10
      ) t
    ),
    'views_by_vehicle', (
      select coalesce(jsonb_agg(row_to_json(v)), '[]'::jsonb) from (
        select ve.name, ve.slug, count(pv.id) as views
        from public.page_views pv
        join public.vehicles ve on ve.id::text = pv.ref_id
        where pv.kind = 'vehicle'
        group by ve.id, ve.name, ve.slug
        order by views desc
        limit 10
      ) v
    ),
    'clicks_by_partner', (
      select coalesce(jsonb_agg(row_to_json(p)), '[]'::jsonb) from (
        select pv.ref_id as partner_id, count(pv.id) as clicks
        from public.page_views pv
        where pv.kind = 'partner'
        group by pv.ref_id
        order by clicks desc
      ) p
    )
  ) into result;

  return result;
end;
$$;

revoke all on function public.admin_get_stats(text) from public;
grant execute on function public.admin_get_stats(text) to anon, authenticated;
