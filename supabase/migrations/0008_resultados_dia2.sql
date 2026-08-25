-- Resultado oficial geral (cumulativo apos Dia 2), fonte resultados.sertoes.com.br.
-- Etapa 3 (25/08) ainda em andamento no momento da coleta, sem podio publicado.
update public.vehicles set result = '{"stage_label":"Geral · após Dia 2","category_code":"UTV","position_general":14,"position_category":7,"time":"11:13:49","gap_leader":"+30:36","penalty_min":10,"team_official_name":"Varela Rally","source":"resultados.sertoes.com.br"}'::jsonb
where slug = 'divino-fogao-maverick-x3';

update public.vehicles set result = '{"stage_label":"Geral · após Dia 2","category_code":"T1M","position_general":1,"position_category":1,"time":"10:34:14","gap_leader":"LIDER","penalty_min":0,"team_official_name":"Mem Motorsport","source":"resultados.sertoes.com.br"}'::jsonb
where slug = 'toyota-hilux-lucas-moraes';

update public.vehicles set result = '{"stage_label":"Geral · após Dia 2","category_code":"T1M","position_general":10,"position_category":5,"time":"11:50:50","gap_leader":"+1:16:35","penalty_min":13,"team_official_name":"Fifi Rally","source":"resultados.sertoes.com.br"}'::jsonb
where slug = 'fifi-century-cr7';

update public.vehicles set result = '{"stage_label":"Geral · após Dia 2","category_code":"T1M","position_general":13,"position_category":6,"time":"12:57:09","gap_leader":"+2:22:54","penalty_min":0,"team_official_name":"Mitsubishi Spinelli Racing","source":"resultados.sertoes.com.br"}'::jsonb
where slug = 'spinelli-triton-ultimate';

update public.vehicles set result = '{"stage_label":"Geral · após Dia 2","category_code":"T1M","position_general":16,"position_category":7,"time":"15:34:17","gap_leader":"+5:00:03","penalty_min":158,"team_official_name":"Sizmic Racing / Ford Racing","source":"resultados.sertoes.com.br"}'::jsonb
where slug = 'x-rally-ford-ranger';

update public.vehicles set result = '{"stage_label":"Geral · após Dia 2","category_code":"MT1","position_general":1,"position_category":1,"time":"10:39:01","gap_leader":"LIDER","penalty_min":0,"team_official_name":"Monster Energy Honda HRC","source":"resultados.sertoes.com.br"}'::jsonb
where slug = 'honda-hrc-tosha-schareina';

update public.vehicles set result = '{"stage_label":"Geral · após Dia 2","category_code":"MT1","position_general":33,"position_category":5,"time":"19:30:00","gap_leader":"+8:50:58","penalty_min":300,"team_official_name":"Yamaha IMS Rally Team","source":"resultados.sertoes.com.br"}'::jsonb
where slug = 'yamaha-adrien-metge';
