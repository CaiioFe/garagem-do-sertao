-- Classificacao final do Sertoes Petrobras 2026 (evento encerrado, 8 dias),
-- fonte resultados.sertoes.com.br. Toyota (Lucas Moraes) venceu a geral.
update public.vehicles set result = '{"stage_label":"Final","category_code":"T1M","position_general":1,"position_category":1,"time":"36:09:53","gap_leader":"LIDER","penalty_min":3,"team_official_name":"Mem Motorsport","source":"resultados.sertoes.com.br"}'::jsonb
where slug = 'toyota-hilux-lucas-moraes';

update public.vehicles set result = '{"stage_label":"Final","category_code":"UTV","position_general":5,"position_category":3,"time":"37:46:35","gap_leader":"+1:08:29","penalty_min":13,"team_official_name":"Varela Rally","source":"resultados.sertoes.com.br"}'::jsonb
where slug = 'divino-fogao-maverick-x3';

update public.vehicles set result = '{"stage_label":"Final","category_code":"T1M","position_general":11,"position_category":5,"time":"41:45:41","gap_leader":"+5:35:47","penalty_min":104,"team_official_name":"Fifi Rally","source":"resultados.sertoes.com.br"}'::jsonb
where slug = 'fifi-century-cr7';

update public.vehicles set result = '{"stage_label":"Final","category_code":"MT1","position_general":17,"position_category":2,"time":"45:57:29","gap_leader":"+8:46:45","penalty_min":308,"team_official_name":"Yamaha IMS Rally Team","source":"resultados.sertoes.com.br"}'::jsonb
where slug = 'yamaha-adrien-metge';

update public.vehicles set result = '{"stage_label":"Final","category_code":"T1M","position_general":19,"position_category":8,"time":"54:40:15","gap_leader":"+18:30:21","penalty_min":803,"team_official_name":"Sizmic Racing / Ford Racing","source":"resultados.sertoes.com.br"}'::jsonb
where slug = 'x-rally-ford-ranger';

update public.vehicles set result = '{"stage_label":"Final","category_code":"T1M","position_general":21,"position_category":9,"time":"90:47:53","gap_leader":"+54:37:59","penalty_min":2730,"team_official_name":"Mitsubishi Spinelli Racing","source":"resultados.sertoes.com.br"}'::jsonb
where slug = 'spinelli-triton-ultimate';

update public.vehicles set result = '{"stage_label":"Final","category_code":"MT1","position_general":27,"position_category":4,"time":"61:46:26","gap_leader":"+24:35:43","penalty_min":1155,"team_official_name":"Monster Energy Honda HRC","source":"resultados.sertoes.com.br"}'::jsonb
where slug = 'honda-hrc-tosha-schareina';
