![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white) ![React](https://img.shields.io/badge/React-19-20232A?logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white) ![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)

[![Backend CI](https://github.com/JohnLouisMaker/deliver-backend/actions/workflows/ci.yml/badge.svg)](https://github.com/JohnLouisMaker/deliver-backend/actions/workflows/ci.yml) [![Frontend CI](https://github.com/JohnLouisMaker/deliver-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/JohnLouisMaker/deliver-frontend/actions/workflows/ci.yml)

# Menuu Deliver

Aplicação de delivery com catálogo, carrinho, checkout e administração de produtos. O cliente faz o pedido pelo site; a API valida os dados, calcula o preço e registra tudo no banco.

**Status:** em desenvolvimento. Catálogo, autenticação e checkout estão funcionando. A API já permite consultar pedidos; a tela de histórico e o acompanhamento de status seguem no roadmap.

## Funcionalidades

- Catálogo de produtos com detalhes, categorias e disponibilidade.
- Carrinho com quantidade e tamanhos disponíveis.
- Cadastro, login e recuperação de senha por e-mail.
- Checkout com cálculo de preço feito no backend.
- Administração de produtos e imagens.
- Perfil, tema claro/escuro e preferências locais.
- Consulta de pedidos pela API, com acesso controlado por usuário.

## Como a aplicação funciona

O **frontend** é o site usado pelo cliente. Ele conversa com o **backend**, uma API que valida as solicitações e aplica as regras do delivery. O backend acessa o **PostgreSQL** para salvar e consultar usuários, produtos e pedidos.

```mermaid
flowchart LR
    C[Cliente] --> F[Frontend React]
    F -->|API REST| B[Backend FastAPI]
    B --> D[(PostgreSQL)]
    B --> M[E-mail SMTP]
```

No checkout, o backend busca os preços oficiais no banco. O navegador não define o valor final do pedido.

## Stack

| Categoria          | Tecnologia              |
| ------------------ | ----------------------- |
| Interface          | React 19 + TypeScript   |
| Build              | Vite                    |
| Estilização        | Tailwind CSS            |
| Rotas              | React Router DOM        |
| Estado global      | Zustand                 |
| Formulários        | React Hook Form + Zod   |
| Requisições HTTP   | Axios                   |
| Animações e ícones | Motion + Lucide React   |
| API                | Python + FastAPI        |
| Validação da API   | Pydantic                |
| Banco de dados     | PostgreSQL + SQLAlchemy |
| Migrações          | Alembic                 |
| Autenticação       | JWT + bcrypt            |
| E-mail             | SMTP                    |
| Execução           | Docker Compose          |
| Servidores         | Nginx + Uvicorn         |

## Validações e segurança

A API valida os dados recebidos, mesmo quando o formulário também verifica os campos no frontend. Cadastro e recuperação validam e-mail e senha; checkout valida itens, quantidades, entrega e pagamento. Produtos precisam estar disponíveis e tamanhos precisam ter preço cadastrado. O backend calcula o total e restringe o acesso aos pedidos ao dono ou a um administrador.

As senhas são armazenadas com hash bcrypt. A autenticação usa tokens JWT, com renovação automática da sessão pelo frontend.

## Tema claro e escuro

A pessoa pode escolher o tema na área **Minha conta**. A preferência fica salva no navegador e é reaplicada quando o site abre. O tema escuro usa estilos Tailwind ativados pela classe `dark`.

## Como executar

### Com Docker

É necessário ter Docker e um PostgreSQL acessível. Configure `deliver-backend/.env`:

```env
DATABASE_URL=postgresql://usuario:senha@host:5432/postgres
SECRET_KEY=uma-chave-secreta
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASSWORD=sua_senha_de_app
EMAIL_FROM=noreply@delivery.com
```

Na raiz do repositório, rode:

```bash
docker compose up --build
```

- Site: [http://localhost](http://localhost)
- API: [http://localhost:8000](http://localhost:8000)
- Documentação da API: [http://localhost:8000/docs](http://localhost:8000/docs)

O Compose aplica as migrações do banco ao iniciar o backend.

### Guias dos componentes

- [Frontend: instalação e desenvolvimento](deliver-frontend/README.md)
- [Backend: configuração, API e banco](deliver-backend/README.md)

## Estrutura

```text
.
├── deliver-frontend/   # Site React e TypeScript
├── deliver-backend/    # API FastAPI e acesso ao PostgreSQL
└── docker-compose.yml  # Execução local dos serviços
```

## Roadmap

- [ ] Histórico e detalhes de pedidos no frontend
- [ ] Acompanhamento do status dos pedidos
