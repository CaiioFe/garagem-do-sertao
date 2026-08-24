-- Resultado oficial (snapshot), fonte: resultados.sertoes.com.br, cronometragem Chronosat.
-- Atualizado manualmente conforme o rally avanca. Nunca inventar posicao/tempo, so o que
-- o sistema oficial mostrar.
alter table public.vehicles add column if not exists result jsonb;
