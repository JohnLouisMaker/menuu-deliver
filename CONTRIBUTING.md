# Contribuindo — deliver-frontend

## Modelo de branches

O repositório segue um fluxo com três branches de longa duração e branches
curtas para cada tarefa.

| Branch       | Papel                          | Recebe merge de                                   |
| ------------ | ------------------------------ | ------------------------------------------------- |
| `main`       | Produção                       | `test` e `hotfix/*`                               |
| `test`       | Homologação / QA               | `dev` e `hotfix/*`                                |
| `dev`        | Integração                     | `feature/*`, `fix/*`, `refactor/*`, `chore/*`     |
| `feature/*`  | Nova funcionalidade            | — (sai de `dev`)                                  |
| `fix/*`      | Correção de bug                | — (sai de `dev`)                                  |
| `refactor/*` | Refatoração sem mudar comportamento | — (sai de `dev`)                             |
| `chore/*`    | Infra, CI, docs, dependências  | — (sai de `dev`)                                  |
| `hotfix/*`   | Correção urgente de produção   | — (sai de `main`)                                 |

```
feature/*  fix/*  refactor/*  chore/*
        \      |      |      /
                 dev
                  │  PR + QA
                test
                  │  PR + release
                main
```

### Fluxo normal

1. Atualize a `dev`: `git switch dev && git pull`.
2. Crie a branch da tarefa: `git switch -c feature/minha-feature`.
3. Faça commits pequenos e com Conventional Commits.
4. Abra um Pull Request para `dev`.
5. Após validar em `dev`, abra um PR `dev → test` para QA.
6. Após aprovação, abra um PR `test → main` e faça o release.

### Hotfix

1. Crie a branch a partir da `main`: `git switch -c hotfix/correcao-urgente main`.
2. Abra PR para `main`.
3. Depois do merge, faça o back-merge da `main` em `test` e `dev` para não
   perder a correção.

### Regras

- Não commite diretamente em `main` ou `test`.
- `dev` deve receber alterações por Pull Request (a única exceção é o setup
  inicial do fluxo).
- Toda branch `feature/*`, `fix/*`, `refactor/*` e `chore/*` sai de `dev` e
  volta para `dev`.
- Nunca invente endpoints: consulte o backend antes de integrar uma rota nova.
- Antes de abrir o PR, rode localmente:

```bash
npm run lint
npm run build
```

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/pt-br/):

```
feat(config): adiciona página de configurações
fix(checkout): valida telefone antes de enviar
refactor(cart): extrai CartBody para componente reutilizável
chore(ci): adiciona branches dev e test ao pipeline
docs(readme): documenta fluxo de branches
```

Tipos aceitos: `feat`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`,
`perf`. Escopo opcional entre parênteses, mensagem no imperativo e em
português.

## Checklist do Pull Request

- [ ] `npm run lint` e `npm run build` passando
- [ ] Testado em desktop e mobile
- [ ] Sem endpoints inventados
- [ ] Branch de destino correta (`dev`, `test` ou `main`)
