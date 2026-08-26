# 🏁 Garagem dos Sertões

Site não oficial, feito por fã, com o perfil de cada equipe e cada veículo do Rally dos Sertões 2026: fotos reais, história, piloto e navegador, e o resultado oficial de cada etapa direto da cronometragem.

🔗 **[garagemsertao.vercel.app](https://garagemsertao.vercel.app)**

## Contexto

O Rally dos Sertões é uma das provas de rali mais duras da América Latina: motos, UTVs e carros enfrentando milhares de km fora de estrada, em oito dias. Dá pra acompanhar a prova pela cronometragem oficial, mas é quase impossível achar de novo a equipe que você viu de perto, saber a história do carro, revisitar o piloto depois que ele já foi embora. A Garagem dos Sertões existe pra resolver essa parte: um lugar único com o perfil de cada veículo cadastrado.

## Funcionalidades

**Pra quem visita**
- Perfil de cada equipe (logo, cidade, patrocinadores, redes sociais, histórico)
- Perfil de cada veículo (foto, especificações, piloto e navegador, títulos)
- Classificação geral dos veículos cadastrados, atualizada por etapa direto da cronometragem oficial
- Curtir e colecionar veículos, com carta compartilhável em imagem
- Guia do evento: programação, etapas, glossário e categorias
- PWA instalável na tela inicial, funciona bem em conexão ruim

**Pra equipes**
- Cadastro de equipe e veículo sem precisar de login
- Cada equipe recebe um código de edição único ao se cadastrar, e usa esse código pra reivindicar e editar o próprio perfil depois
- Equipes cadastradas por terceiros (imprensa) ficam marcadas como "não confirmadas" até a própria equipe reivindicar o perfil

## Como funciona o cadastro

Não tem autenticação de usuário. Toda escrita passa por funções do banco (`security definer`) que validam um token:

- Ao criar uma equipe, o sistema gera um código de edição (ex: `FIFI-7K3Q`) e mostra uma única vez
- Esse código funciona como senha da equipe: com ele dá pra editar o perfil e cadastrar veículos, sem conta nem e-mail
- Um PIN de administrador (hash `bcrypt` no banco) permite moderar qualquer equipe ou veículo
- Toda equipe começa como "não verificada"; o selo some assim que a própria equipe salva uma edição com o código real

## Dados reais, sem invenção

Regra do projeto: nada de estatística, comparação ou "raridade" inventada sobre pessoas ou equipes reais. Só entra no app o que é fato verificável, informado pela própria equipe ou coletado da cronometragem oficial do rally (`resultados.sertoes.com.br`). Times pré-cadastrados pela imprensa exibem aviso explícito de que os dados ainda não foram confirmados.

## Stack

- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, React Router, TanStack Query
- **Backend:** Supabase (Postgres com Row Level Security, RPCs `security definer` pra toda escrita, Storage pra fotos)
- **Deploy:** Vercel, domínio próprio, PWA com service worker

## Rodando localmente

```bash
npm install
cp .env.example .env   # preencher VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY
npm run dev
```

As migrations do banco estão em `supabase/migrations/`.

## Sobre

Construído sozinho, do modelo de dados ao deploy, com o [Claude Code](https://claude.com/claude-code) guiando o desenvolvimento de ponta a ponta. Não tem vínculo com a organização do Rally dos Sertões nem com as equipes citadas.
