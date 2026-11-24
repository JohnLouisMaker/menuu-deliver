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

## Arquitetura

A aplicação é dividida em frontend, API e PostgreSQL. O navegador nunca acessa o banco diretamente: todas as operações passam pela API, que autentica, valida e aplica as regras de negócio.

```mermaid
flowchart LR
    U[Cliente no navegador] -->|React / HTTPS ou HTTP| F[Frontend React]
    F -->|JSON e imagens; REST| A[API FastAPI]
    A -->|SQLAlchemy| DB[(PostgreSQL)]
    A -->|SMTP| MAIL[Servidor de e-mail]
    A -->|arquivos enviados| S[static/uploads]
    D[Docker Compose] -. inicia .-> F
    D -. inicia .-> A
```

No ambiente local, o Compose compila o frontend e o serve com Nginx na porta 80. O backend roda com Uvicorn na porta 8000 e aplica as migrações do Alembic antes de iniciar. O PostgreSQL é externo aos serviços definidos no Compose: configure uma instância acessível em `DATABASE_URL`.

### Caminho de uma requisição

1. O usuário interage com as páginas React. O estado do carrinho, da sessão e do tema é mantido em stores Zustand.
2. O cliente Axios envia requisições para `VITE_API_URL`. Nas chamadas autenticadas, o interceptor acrescenta `Authorization: Bearer <access_token>`.
3. O FastAPI valida o corpo com schemas Pydantic, resolve o usuário quando a rota exige autenticação e chama a camada de persistência SQLAlchemy.
4. O backend aplica permissões e regras de negócio, grava no PostgreSQL e responde em JSON. Erros são devolvidos com códigos HTTP e detalhes da API.
5. Na inicialização, o frontend verifica os tokens persistidos e renova o access token quando está expirado ou próximo do vencimento. Chamadas simultâneas que recebem 401 aguardam uma única renovação.

### Principais módulos

| Módulo | Responsabilidade |
| --- | --- |
| `deliver-frontend/src/pages` | Páginas de catálogo, login, cadastro, recuperação de senha, checkout, confirmação e conta. |
| `deliver-frontend/src/components` | Elementos reutilizáveis de interface, como produtos, carrinho, navegação e rodapé. |
| `deliver-frontend/src/api/api.ts` | Cliente Axios, URL da API, token de acesso e refresh automático. |
| `deliver-frontend/src/store/authStore.ts` | Sessão, usuário, tokens, login, logout e inicialização da autenticação. |
| `deliver-frontend/src/store/cartStore.ts` | Itens do carrinho, quantidades, tamanhos e subtotal informativo. |
| `deliver-frontend/src/store/themeStore.ts` | Preferência de tema claro/escuro persistida pelo Zustand. |
| `deliver-frontend/src/store/preferencesStore.ts` | Preferências de notificação salvas localmente. |
| `deliver-backend/app/main.py` | Cria o FastAPI, configura CORS, arquivos estáticos, healthcheck e routers. |
| `deliver-backend/app/routes` | Endpoints de autenticação, cardápio e pedidos. |
| `deliver-backend/app/schemas/schemas.py` | Contratos e validações Pydantic de entrada e saída. |
| `deliver-backend/app/models/models.py` | Modelos SQLAlchemy, enums, relacionamentos e restrições do banco. |
| `deliver-backend/app/dependencies.py` | Sessão de banco, leitura/verificação de JWT e resolução do usuário atual. |
| `deliver-backend/alembic` | Histórico e execução de migrações do PostgreSQL. |

## Validações e regras de negócio

A interface pode validar campos para orientar a pessoa, mas o backend é a autoridade: qualquer requisição pode ser enviada sem passar pelo formulário, portanto as regras importantes são repetidas ou aplicadas no servidor.

### Usuários e autenticação

- Cadastro: nome entre 3 e 120 caracteres, espaços externos removidos; e-mail validado como endereço; senha entre 8 e 72 caracteres.
- Login e recuperação: e-mail validado. A senha de login aceita de 1 a 72 caracteres para que credenciais incorretas sejam rejeitadas pela autenticação.
- Código de redefinição: exatamente seis dígitos; a nova senha deve ter de 8 a 72 caracteres.
- Senhas são armazenadas como hash bcrypt, nunca como texto puro.
- JWTs incluem assunto do usuário, expiração e tipo. Rotas autenticadas exigem token do tipo `access`; refresh e reset têm usos separados.
- Rotas protegidas verificam identidade no backend. Uma pessoa usuária só pode acessar os próprios pedidos; administradores podem acessar pedidos de outros usuários e gerenciar cardápio.
- O frontend mantém access e refresh tokens no `localStorage`, consulta `/auth/me` ao restaurar a sessão e limpa a sessão se a renovação falhar.

### Cardápio, carrinho e checkout

- O checkout exige ao menos um item, endereço de entrega com 1 a 500 caracteres, forma de pagamento válida e telefone com 1 a 20 caracteres.
- A quantidade de cada item deve ser maior que zero. A forma de pagamento precisa pertencer ao conjunto aceito pela API.
- Pizza requer tamanho (`pequena`, `media` ou `grande`) e preço cadastrado para aquela combinação. Itens sem tamanho rejeitam a seleção de tamanho.
- O backend confirma que o produto existe e está disponível. Não aceita preço enviado pelo navegador: consulta o valor atual no banco e calcula o total no servidor.
- `troco_para` é opcional e não pode ser negativo no schema; seu uso no checkout é destinado a pagamento em dinheiro.
- O subtotal mostrado no carrinho é uma estimativa de interface. O valor retornado pela API é o valor oficial.
- A tabela de preços por tamanho protege integridade com unicidade por produto+tamanho, enumeração permitida e preço maior que zero.
- Ao criar o pedido, nome, imagem e preço unitário são copiados para os itens do pedido. Esse snapshot mantém o conteúdo comprado mesmo se o item do cardápio mudar depois.

### Persistência e permissões

O PostgreSQL mantém usuários, produtos, preços por tamanho, pedidos e itens de pedido. Alembic versiona mudanças de schema. Chaves estrangeiras, enums, campos obrigatórios, índices e restrições `CHECK`/unicidade ajudam a impedir estados inválidos também no banco.

Uploads de imagens do cardápio são feitos por endpoint administrativo e ficam sob `static/uploads`, servidos pelo backend em `/static`. O middleware CORS permite as origens locais e os domínios de frontend configurados no código ou em `CORS_ORIGINS`.

## Stack completa

### Frontend

| Tecnologia | Uso |
| --- | --- |
| React 19 | Componentes e interface. |
| TypeScript | Tipos estáticos para componentes, estado e contratos da API. |
| Vite 7 | Servidor de desenvolvimento e build do frontend. |
| Tailwind CSS 4 | Estilos utilitários; variante `dark` customizada para o tema. |
| React Router DOM 7 | Rotas públicas, privadas e redirecionamentos. |
| Zustand 5 | Estado global do carrinho, sessão, tema e preferências. |
| Axios | Cliente HTTP e interceptors de autenticação/renovação. |
| React Hook Form + Zod | Composição e validação de formulários no cliente, conforme o README do frontend. |
| jwt-decode | Leitura da expiração do JWT no cliente para decidir quando renovar. |
| Motion | Animações de interface. |
| Lucide React | Ícones. |
| ESLint + TypeScript ESLint | Análise estática e lint. |

### Backend

| Tecnologia | Uso |
| --- | --- |
| Python 3.11 | Runtime da API. |
| FastAPI + Starlette | Rotas REST, middleware e documentação OpenAPI/Swagger. |
| Pydantic 2 + EmailStr | Validação, conversão e serialização dos dados da API. |
| SQLAlchemy 2 | ORM, consultas e relacionamentos com o banco. |
| PostgreSQL + psycopg2-binary | Banco de dados e driver. |
| Alembic | Migrações versionadas. |
| python-jose | Criação e validação de JWT. |
| passlib + bcrypt | Hash e verificação de senha. |
| fastapi-mail | Envio SMTP do código de recuperação. |
| python-dotenv | Carregamento das variáveis do arquivo `.env`. |
| Uvicorn | Servidor ASGI. |
| pytest + httpx | Testes de integração documentados no backend. |
| Ruff | Lint e formatação Python. |

### Infraestrutura e entrega

| Tecnologia | Uso |
| --- | --- |
| Docker | Imagens isoladas para frontend e backend. |
| Docker Compose | Inicialização dos serviços e aplicação das migrações. |
| Nginx | Entrega dos arquivos compilados do frontend e fallback de rotas SPA. |
| GitHub Actions | CI do frontend (lint/build) e backend (migrations/testes com PostgreSQL). |
| Supabase | Opção documentada de PostgreSQL gerenciado; não é obrigatório se houver outro PostgreSQL compatível. |

## Implementações do produto

### Catálogo e administração

O catálogo público da API lista apenas produtos disponíveis e aceita filtro de categoria. Há rota de detalhe por produto. Criar, editar e remover itens exige administrador; a criação permite upload de imagem. Produtos podem ter preço fixo ou uma tabela de valores por tamanho.

### Carrinho

O Zustand agrupa a linha do carrinho por identificador do produto e tamanho. Assim, o mesmo sabor de pizza em dois tamanhos ocupa linhas diferentes. Quantidade zero ou negativa remove a linha. O subtotal é apenas informativo e não substitui o cálculo do servidor.

### Checkout e pedidos

O frontend envia itens, quantidade e tamanho junto dos dados de entrega/pagamento. O backend cria o pedido numa operação de checkout, valida cada item, busca os preços oficiais, calcula o total e retorna um resumo. O backend também expõe operações para listar os pedidos do usuário, adicionar/remover itens e finalizar pedido; o histórico e detalhes de pedidos no frontend seguem indicados como roadmap no README do frontend.

### Tema claro/escuro

O seletor de aparência fica na área **Minha conta**. O tema começa em claro e pode ser alterado para claro ou escuro. A store `themeStore` usa Zustand com middleware `persist`, gravando a preferência no `localStorage` sob a chave `theme-storage`. Ao carregar a aplicação, `App.tsx` lê o tema e adiciona ou remove a classe `dark` do elemento `<html>`. O Tailwind CSS 4 foi configurado com uma variante que aplica estilos a essa classe; regras em `index.css` ajustam fundos, textos, bordas e cores de destaque. A preferência é local ao navegador e não é sincronizada com a conta nem com outros dispositivos.

### Conta e preferências

A página de conta permite atualizar nome/e-mail pela API e selecionar tema e preferências de notificações. As preferências de notificações são persistidas localmente; sua presença na interface não significa que o sistema já envie notificações de pedidos ou promoções.

### E-mail e recuperação de senha

O fluxo solicita código de recuperação por e-mail, valida o código e permite definir uma nova senha. A API usa as configurações SMTP do ambiente. Os tokens de redefinição são separados dos tokens de acesso e renovação.

### Healthcheck e documentação

`GET /health` verifica a conexão com o banco e responde com estado da API e do PostgreSQL. O FastAPI publica a documentação interativa em `/docs` e o schema OpenAPI em `/openapi.json`.

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
