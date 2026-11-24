![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white) ![React](https://img.shields.io/badge/React-19-20232A?logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

[![Backend CI](https://github.com/JohnLouisMaker/deliver-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/JohnLouisMaker/deliver-backend/actions/workflows/ci.yml) [![Frontend CI](https://github.com/JohnLouisMaker/deliver-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/JohnLouisMaker/deliver-frontend/actions/workflows/ci.yml)

# Menuu Deliver

Aplicação web de delivery de comida. O cliente consulta o cardápio, monta um carrinho, cria uma conta e envia um pedido; a equipe administra os produtos pela API.

> **Em desenvolvimento.** A experiência principal de catálogo, carrinho, autenticação e checkout está implementada. A documentação dos projetos indica que histórico/detalhes de pedidos e acompanhamento de status ainda estão no roadmap.

## Para entender sem ser técnico

Pense no sistema como duas partes que conversam:

- **A tela do cliente (frontend)** mostra o cardápio, mantém os itens escolhidos no carrinho e envia o pedido.
- **O serviço por trás (backend/API)** valida o usuário, consulta o cardápio e registra o pedido.
- **O banco de dados** guarda contas, produtos e pedidos.
- **O Docker Compose** inicia frontend e backend juntos no computador.

No checkout, o preço oficial é recalculado pelo backend usando os valores do cardápio. Isso evita confiar em um valor que poderia ser alterado na tela do cliente. Os dados dos produtos também são copiados para o pedido no momento da compra, preservando o registro histórico se o cardápio mudar depois.

## O que já oferece

- Consulta ao cardápio e detalhes dos produtos; categorias e disponibilidade são tratadas pela API.
- Carrinho com quantidade e tamanho para produtos que têm opções de tamanho.
- Cadastro, login, renovação de sessão e recuperação de senha por e-mail.
- Envio de pedidos autenticados e autorização para que cada cliente veja apenas os próprios pedidos; administradores têm acesso administrativo.
- Cadastro/gestão de produtos pela API, com upload de imagem e acesso restrito a administrador.
- Preferências de tema e notificações na interface (as preferências de notificação ficam no aparelho, conforme a documentação do frontend).

## Visão técnica

| Parte | Tecnologias e responsabilidade |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, React Router, Zustand e Axios. Interface e comunicação com a API. |
| Backend | Python 3.11, FastAPI, SQLAlchemy 2 e Pydantic. API REST, autenticação JWT e regras de negócio. |
| Persistência | PostgreSQL, com conexão configurada via `DATABASE_URL`; Supabase é uma opção documentada. |
| Migrações | Alembic. O Compose aplica `alembic upgrade head` ao iniciar o backend. |
| Imagens | Arquivos enviados ficam servidos pela rota estática `/static`. |
| Execução local | Docker Compose, com Nginx para servir o frontend e Uvicorn para a API. |

O backend documenta tokens JWT separados para acesso, renovação e redefinição de senha. No fluxo do pedido, o servidor busca preços e disponibilidade no banco, exige tamanho quando necessário e restringe o acesso ao pedido pelo proprietário ou por um administrador.

## Executar com Docker

### Pré-requisitos

- Docker com Docker Compose.
- Um banco PostgreSQL acessível. O projeto do backend documenta Supabase como opção.

### Configurar o ambiente

Crie `deliver-backend/.env` com as configurações necessárias. Exemplo:

```env
DATABASE_URL=postgresql://usuario:senha@host:5432/postgres
SECRET_KEY=gere-uma-chave-secreta-forte
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE=30
REFRESH_TOKEN_EXPIRE=7

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_de_app
EMAIL_FROM=noreply@delivery.com
```

As configurações de e-mail são usadas no fluxo de recuperação de senha. Consulte [o README do backend](deliver-backend/README.md) para detalhes, migrations e configuração do banco. Não use os valores de exemplo em produção e não envie seu arquivo `.env` ao Git.

### Subir a aplicação

Na raiz do repositório:

```bash
docker compose up --build
```

Depois de iniciar:

- Interface: [http://localhost](http://localhost)
- API: [http://localhost:8000](http://localhost:8000)
- Documentação interativa da API: [http://localhost:8000/docs](http://localhost:8000/docs)

O serviço backend precisa alcançar o PostgreSQL configurado em `DATABASE_URL`. O frontend é compilado com a URL da API definida no `docker-compose.yml` como `VITE_API_URL=http://localhost:8000`.

Para encerrar, use `Ctrl+C`; para parar e remover os containers, execute `docker compose down`.

## Desenvolvimento sem Docker

Os dois componentes também têm instruções próprias:

- [Frontend: instalação, comandos e integração](deliver-frontend/README.md)
- [Backend: ambiente, banco, migrations e API](deliver-backend/README.md)

Em resumo, o frontend requer Node.js 20+ e o backend requer Python 3.11+ e PostgreSQL. Rode o backend com as migrations aplicadas antes de iniciar a interface. Os READMEs de cada pasta trazem os comandos completos e as variáveis usadas por cada serviço.

## Estrutura do repositório

```text
.
├── deliver-backend/    # API FastAPI, modelos, rotas, migrations e testes
├── deliver-frontend/   # aplicação React/TypeScript
└── docker-compose.yml  # execução conjunta dos serviços
```

## Pontos de entrada para desenvolvimento

- Backend: `deliver-backend/app/main.py` registra os routers de autenticação, pedidos e cardápio.
- Frontend: veja `deliver-frontend/src`; a configuração e os scripts estão em `deliver-frontend/package.json`.
- Compose: `docker-compose.yml` configura portas, build, migrations e inicialização local.
- Documentação gerada da API: `/docs` quando o backend está rodando.

## Estado e próximos passos

O projeto está em desenvolvimento. Segundo os READMEs dos componentes, histórico e detalhes de pedidos no frontend e acompanhamento do status do pedido estão planejados. Consulte os READMEs de cada componente para ver o estado e os comandos específicos atualizados.

## Projetos relacionados

- [Backend](https://github.com/JohnLouisMaker/deliver-backend)
- [Frontend](https://github.com/JohnLouisMaker/deliver-frontend)
