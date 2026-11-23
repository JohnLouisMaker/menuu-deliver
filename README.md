# Deliver Fullstack

Aplicação de delivery com backend FastAPI e frontend React.

## Rodar com Docker

Configure `deliver-backend/.env` com as variáveis necessárias, incluindo
`DATABASE_URL` do Supabase. Consulte a seção de configuração do
[README do backend](deliver-backend/README.md).

Na raiz do repositório, execute:

```bash
docker compose up --build
```

- Frontend: http://localhost
- API: http://localhost:8000/docs

O Compose aplica as migrations do Alembic ao iniciar o backend.
