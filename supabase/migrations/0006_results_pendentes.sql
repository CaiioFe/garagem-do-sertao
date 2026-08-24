-- Resultado oficial (Dia 1), fonte: resultados.sertoes.com.br, cronometragem Chronosat.
-- Nomes de piloto confirmam sem ambiguidade: Divino Fogao = "Varela Rally" (#101),
-- X Rally Team = "Sizmic Racing / Ford Racing" (#301).
update public.vehicles set race_number = '101', result = '{"stage_label":"Dia 1","category_code":"UTU","position_general":1,"position_category":1,"time":"05:20:55","gap_leader":"LIDER","penalty_min":0,"team_official_name":"Varela Rally","source":"resultados.sertoes.com.br"}'::jsonb
where slug = 'divino-fogao-maverick-x3';

update public.vehicles set race_number = '301', result = '{"stage_label":"Dia 1","category_code":"T1M","position_general":3,"time":"05:26:47","gap_leader":"+1:58","penalty_min":0,"team_official_name":"Sizmic Racing / Ford Racing","source":"resultados.sertoes.com.br"}'::jsonb
where slug = 'x-rally-ford-ranger';
