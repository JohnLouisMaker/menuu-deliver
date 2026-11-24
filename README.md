![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white) ![React](https://img.shields.io/badge/React-19-20232A?logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

[![Backend CI](https://github.com/JohnLouisMaker/deliver-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/JohnLouisMaker/deliver-backend/actions/workflows/ci.yml) [![Frontend CI](https://github.com/JohnLouisMaker/deliver-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/JohnLouisMaker/deliver-frontend/actions/workflows/ci.yml)

# Menuu Deliver

Aplicação de delivery com catálogo, carrinho, checkout e administração de produtos. O cliente usa o site para fazer pedidos; a API valida e registra cada operação no banco de dados.

**Status:** em desenvolvimento. O catálogo, autenticação e checkout estão implementados. Histórico e acompanhamento de pedidos ainda estão em evolução.

## Como funciona

O sistema tem três partes: o **frontend** é a interface usada pelo cliente; o **backend** é a API que aplica as regras do sistema; e o **PostgreSQL** guarda usuários, produtos e pedidos. O frontend conversa com a API, e somente a API acessa o banco.

```mermaid
flowchart LR
    C[Cliente] --> F[Frontend React]
    F -->|API REST| B[Backend FastAPI]
    B --> D[(PostgreSQL)]
    B --> E[E-mail SMTP]
```

No checkout, o backend consulta os preços oficiais e calcula o total. Assim, o valor não depende do que o navegador enviar. Produtos com tamanhos, como pizzas, precisam ter preço cadastrado para cada opção.

## Funcionalidades

- Catálogo de produtos, carrinho e checkout.
- Cadastro, login e recuperação de senha por e-mail.
- Administração de produtos e imagens por usuários administradores.
- Perfil do usuário e seleção de tema claro ou escuro.
- Controle de acesso aos pedidos conforme o usuário autenticado.

## Arquitetura e stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router, Zustand e Axios. React Hook Form e Zod apoiam os formulários.
- **Backend:** Python, FastAPI, Pydantic e SQLAlchemy.
- **Banco:** PostgreSQL, com alterações de estrutura controladas pelo Alembic.
- **Autenticação:** tokens JWT e senhas protegidas com hash bcrypt.
- **Infraestrutura:** Docker Compose para iniciar os serviços, Nginx para servir o frontend e Uvicorn para a API.
- **E-mail:** SMTP para recuperação de senha.

O frontend organiza a interface em páginas e componentes; stores Zustand mantêm sessão, carrinho, tema e preferências. No backend, as rotas cuidam de autenticação, cardápio e pedidos, enquanto schemas validam os dados e modelos representam as tabelas.

## Validações principais

Os dados são validados no backend, mesmo quando também há validações na interface:

- Cadastro verifica nome, e-mail e tamanho da senha; o código de redefinição precisa ter seis dígitos.
- Checkout exige itens, dados de entrega e forma de pagamento válidos.
- Quantidades devem ser positivas. Tamanho é obrigatório para produtos que oferecem opções.
- Produtos precisam existir e estar disponíveis. O preço é sempre consultado no banco.
- Clientes acessam os próprios pedidos; ações administrativas exigem perfil de administrador.

## Tema claro e escuro

O seletor de tema fica na área **Minha conta**. A preferência é salva no navegador pelo Zustand e reaplicada quando o site abre. O tema escuro ativa estilos Tailwind específicos por meio da classe `dark` no documento. A escolha é local ao navegador.

## Executar localmente com Docker

É necessário ter Docker e um banco PostgreSQL acessível. Configure `deliver-backend/.env`:

```env
DATABASE_URL=postgresql://usuario:senha@host:5432/postgres
SECRET_KEY=uma-chave-secreta
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_de_app
EMAIL_FROM=noreply@delivery.com
```

Na raiz do repositório:

```bash
docker compose up --build
```

- Site: [http://localhost](http://localhost)
- API: [http://localhost:8000](http://localhost:8000)
- Documentação da API: [http://localhost:8000/docs](http://localhost:8000/docs)

O Compose aplica as migrações do banco ao iniciar o backend. Consulte os guias específicos para configuração e desenvolvimento:

- [Frontend](deliver-frontend/README.md)
- [Backend](deliver-backend/README.md)

## Estrutura

```text
.
├── deliver-backend/    # API, regras de negócio e acesso ao banco
├── deliver-frontend/   # interface web
└── docker-compose.yml  # execução local dos serviços
```

## Projetos relacionados

- [Backend](https://github.com/JohnLouisMaker/deliver-backend)
- [Frontend](https://github.com/JohnLouisMaker/deliver-frontend)
