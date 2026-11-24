# Contribuindo

## Fluxo de branches

- `main`: versão estável do projeto.
- `dev`: integração das mudanças antes de chegar à versão estável.
- `feat/<descricao>`: nova funcionalidade.
- `fix/<descricao>`: correção de bug.
- `refactor/<descricao>`: reorganização ou melhoria interna sem alterar o comportamento esperado.
- `chore/<descricao>`: manutenção, dependências, ferramentas ou configuração.
- `docs/<descricao>`: documentação.
- `test/<descricao>`: criação ou melhoria de testes.

Use nomes curtos, em português, sem acentos ou espaços. Exemplo: `feat/finalizar-pedido`.

## Mensagens de commit

Escreva commits em português, objetivos e no imperativo, com o tipo indicando a intenção:


- `feat: adiciona etapa de pagamento ao checkout`
- `fix: corrige cálculo do total do pedido`
- `refactor: separa validação de endereço`
- `docs: explica como configurar o ambiente local`
- `test: adiciona testes para o carrinho`
- `chore: atualiza dependências`


Tipos recomendados: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `build` e `ci`.


## Pull requests

1. Crie uma branch a partir de `dev`.
2. Faça commits pequenos e descritivos.
3. Atualize ou crie testes quando necessário.
4. Abra uma Pull Request para `dev`.
5. Após revisão e validação, `dev` poderá ser integrado em `main`.


Não faça commits diretamente em `main` para mudanças de desenvolvimento.
