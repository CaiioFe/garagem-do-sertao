-- Trunfo do Sertão — PIN admin + seed inicial de equipes reais (fonte: imprensa, 21/08/2026)
-- Aviso nas equipes: cadastro inicial pela imprensa, equipe pode reivindicar com o Caio na Vila.

insert into public.app_config (key, value)
values ('admin_pin_hash', crypt('029132', gen_salt('bf')))
on conflict (key) do update set value = excluded.value;

-- ===== Fifi Rally Team (Goiânia) =====
with t as (
  insert into public.teams (slug, name, city, state, description, featured, sertoes_participations)
  values ('fifi-rally-team', 'Fifi Rally Team', 'Goiânia', 'GO',
    'Equipe de Goiânia disputando o Sertões 2026 em casa. Cadastro inicial pela imprensa — se essa é sua equipe, procure o Caio na Vila Sertões pra reivindicar e completar o perfil.',
    true, 1)
  on conflict (slug) do nothing
  returning id
)
insert into public.vehicles (team_id, slug, name, brand, model, year, category_id, type, pilot_name, navigator_name, specs, history, description, featured)
select id, 'fifi-century-cr7', 'Century CR7', 'Century', 'CR7', 2026, 'ultimate_t1_plus', 'carro',
  'Lélio Vieira Carneiro Jr.', 'Weberth Moreira',
  '{}'::jsonb, '{"sertoes_count": 1}'::jsonb,
  'Estratégia declarada: equilibrar ataque, preservação do carro e precisão na navegação ao longo das 8 etapas.', true
from t;

-- ===== Divino Fogão Rally Team (família Varela) =====
with t as (
  insert into public.teams (slug, name, description, featured, titles_category, sertoes_participations)
  values ('divino-fogao-rally-team', 'Divino Fogão Rally Team',
    'Equipe familiar de Reinaldo Varela (Nani, Rodrigo, Gabriel e Bruno Varela), competindo em carros, UTV e quadriciclos. 40 anos de carreira do fundador, campeão do Dakar 2018 nos UTVs. Cadastro inicial pela imprensa — reivindique na Vila.',
    true, 2, 5)
  on conflict (slug) do nothing
  returning id
)
insert into public.vehicles (team_id, slug, name, brand, model, category_id, type, pilot_name, navigator_name, specs, history, description, featured)
select id, 'divino-fogao-maverick-x3', 'Maverick X3', 'Can-Am', 'Maverick X3', 'utv_ssv_t4', 'utv',
  'Rodrigo Varela', 'Matheus Mazzei',
  '{}'::jsonb, '{"titles_category": 1, "podiums": 2}'::jsonb,
  'Campeões UTV em 2022, vice em 2025. Uma das duplas mais tradicionais do Sertões nos UTVs.', true
from t;

-- ===== X Rally Team =====
with t as (
  insert into public.teams (slug, name, description, titles_general, sertoes_participations)
  values ('x-rally-team', 'X Rally Team',
    'Uma das equipes mais vitoriosas do Sertões: 5 títulos gerais em mais de 25 edições disputadas. Cadastro inicial pela imprensa — reivindique na Vila.',
    5, 25)
  on conflict (slug) do nothing
  returning id
)
insert into public.vehicles (team_id, slug, name, brand, model, category_id, type, pilot_name, navigator_name, specs, history, description)
select id, 'x-rally-ford-ranger', 'Ford Ranger NWM Evo Plus', 'Ford', 'Ranger NWM Evo Plus', 'ultimate_t1_plus', 'carro',
  'Marcos Baumgart', 'Kleber Cincea',
  '{}'::jsonb, '{"titles_general": 2, "sertoes_count": 22}'::jsonb,
  'Marcos Baumgart soma 22 participações no Sertões e 17 anos com o mesmo navegador, Kleber Cincea. Campeões em 2020 e 2025.'
from t;

-- ===== Mitsubishi Spinelli Racing =====
with t as (
  insert into public.teams (slug, name, city, state, description, titles_category, sertoes_participations)
  values ('mitsubishi-spinelli-racing', 'Mitsubishi Spinelli Racing', 'Mogi Guaçu', 'SP',
    'Leva três gerações de carros ao Sertões 2026: protótipo Ultimate, Triton Katana R e uma L200 Evolution 2002 na categoria Classic. Cadastro inicial pela imprensa — reivindique na Vila.',
    5, 20)
  on conflict (slug) do nothing
  returning id
)
insert into public.vehicles (team_id, slug, name, brand, model, category_id, type, pilot_name, navigator_name, specs, history, description, featured)
select id, 'spinelli-triton-ultimate', 'Triton Ultimate Racing', 'Mitsubishi', 'Triton Ultimate Racing', 'ultimate_t1_plus', 'carro',
  'Guilherme "Guiga" Spinelli', 'Paulo Fiúza',
  '{}'::jsonb, '{"titles_category": 5}'::jsonb,
  'Guiga Spinelli é pentacampeão e recordista de vitórias no Sertões. Paulo Fiúza é campeão do Dakar 2026 nos caminhões.', true
from t;

-- ===== Honda HRC (motos) =====
with t as (
  insert into public.teams (slug, name, description, titles_category)
  values ('honda-hrc', 'Honda Racing / HRC',
    'Time internacional de motos da Honda no Sertões. Cadastro inicial pela imprensa — reivindique na Vila.', 1)
  on conflict (slug) do nothing
  returning id
)
insert into public.vehicles (team_id, slug, name, brand, model, category_id, type, pilot_name, specs, history, description)
select id, 'honda-hrc-tosha-schareina', 'Honda HRC de Rally', 'Honda', 'CRF Rally', 'moto', 'moto',
  'Tosha Schareina',
  '{}'::jsonb, '{"titles_category": 1}'::jsonb,
  'Piloto espanhol, campeão da categoria Moto no Sertões 2025.'
from t;

-- ===== Yamaha IMS Rally Team (motos) =====
with t as (
  insert into public.teams (slug, name, description, titles_category)
  values ('yamaha-ims-rally-team', 'Yamaha IMS Rally Team',
    'Time da Yamaha em busca de títulos no Sertões 2026. Cadastro inicial pela imprensa — reivindique na Vila.', 1)
  on conflict (slug) do nothing
  returning id
)
insert into public.vehicles (team_id, slug, name, brand, model, category_id, type, pilot_name, specs, history, description)
select id, 'yamaha-adrien-metge', 'Yamaha de Rally', 'Yamaha', 'Rally', 'moto', 'moto',
  'Adrien Metge',
  '{}'::jsonb, '{"titles_category": 1}'::jsonb,
  'Piloto francês, campeão da categoria Moto no Sertões 2024.'
from t;
