# Doações e prestação de contas

## Consultar e exportar

Acesse `/gestao/doacoes` e informe a chave de acesso privada. Escolha o período **de pagamento**, consulte os recebimentos e filtre por destino. O botão **Baixar planilha CSV** exporta as linhas selecionadas, incluindo os pagamentos de teste com indicação explícita de exclusão. A planilha abre no Excel com separador ponto e vírgula e valores em reais.

O relatório contém referência Cora, emissão, pagamento, nome e e-mail do doador, documento mascarado, valor cobrado, valor recebido, forma de pagamento, destino conciliado, descrição original e observações da conciliação. Ele não emite recibos fiscais nem substitui os comprovantes bancários.

O painel só mostra o total após concluir todas as páginas da consulta. Períodos podem ter até 366 dias; o limite por consulta é 2.000 cobranças bancárias. Reduza o período ao atingir esse limite. Cobranças da conta sem referência do checkout não entram como doações do site. Destinos não identificáveis ficam separados para conciliação, sem atribuição automática ao fundo geral.

Recebimentos externos sem data aparecem em seção própria e em linhas separadas do CSV. São considerados no acumulado geral, mas não no subtotal de pagamentos do período. Para prestação de contas por exercício, é necessário completar a data e reunir os comprovantes desses registros.

## Destino preservado no banco

O checkout geral exige seleção explícita de destino, inclusive fundo geral e cursos EAD. As páginas dos projetos já selecionam o próprio projeto; o botão de apoio ao EAD seleciona `cursos-ead`. A descrição enviada à Cora começa por `Destino [identificador]: título`. O identificador permanece mesmo quando o banco limita o texto a 100 caracteres. Cobranças antigas com `Apoio: título` também são reconhecidas.

O destino consta na cobrança persistida pela Cora. A emissão não conta como doação: só entram cobranças `PAID` com recebimento integral validado. Fechar o navegador não impede a consulta administrativa nem o cômputo do recebimento.

## Conciliação confirmada em 29/10/2026

| Registro | Destino conciliado | Tratamento |
| --- | --- | --- |
| R$ 550 no checkout | Cursos EAD | Correção confirmada pelo Instituto; descrição original como fundo geral preservada |
| R$ 100 no checkout | Fundo geral | Destino original da cobrança |
| R$ 30 no checkout | Teste | Recebimento mantido no relatório, excluído dos totais de doações |
| R$ 166 fora do checkout | Fundo geral | Registro manual confirmado pelo Instituto; data e comprovante ainda não informados |

Doações: **R$ 816**, sendo **R$ 266** para fundo geral e **R$ 550** para EAD. Os R$ 30 de teste não fazem parte desse total. A conciliação de cada cobrança é definida em `server/donations/reconciliation.ts`, pelo ID da cobrança, sem alterar as informações originais no banco. Novos recebimentos externos precisam ser incluídos como registros manuais identificados; não some novamente uma cobrança já recuperada da Cora.

## Acesso privado

A variável **DONATIONS_REPORT_ACCESS_HASH** deve conter o SHA-256 de uma chave aleatória exclusiva, com pelo menos 32 caracteres. Configure-a somente em produção, como segredo do servidor. Não use prefixo `VITE_`, não reutilize as credenciais Cora nem o segredo dos tokens do checkout e nunca envie a chave em URLs.

O servidor valida a chave antes de consultar dados bancários. O relatório autenticado não é armazenado em cache. O navegador guarda a chave apenas em memória e encerra o acesso após 20 minutos sem atividade. O endpoint público retorna apenas valores agregados, sem dados de doadores ou referências de cobranças.

A chave de acesso inicial foi entregue em arquivo local privado, dentro de `scratch/prestacao-de-contas/`, diretório ignorado pelo Git e pelos envios à Vercel. Guarde-a em um gerenciador de senhas. Para revogar acesso, gere uma nova chave, substitua seu hash na Vercel e publique novamente.

## Exportar localmente

Com as credenciais Cora no `.env`, execute:

```sh
npm run donations:report -- --start 2026-01-01 --end 2026-10-29
```

O comando faz consultas de leitura, sem emitir cobranças ou movimentar dinheiro. O CSV é salvo em `scratch/prestacao-de-contas/`, fora do Git. Preserve esses arquivos com acesso restrito.

## Verificação

`npm test`, `npm run lint` e `npm run build`. Os testes usam banco simulado e cobrem recuperação do destino, EAD, correções, exclusão de testes, valores em centavos, paginação, confirmação bancária, dados não identificados, autenticação, ausência de dados pessoais no endpoint público e proteção contra fórmulas no CSV.

Referências oficiais: [consulta de cobranças](https://developers.cora.com.br/reference/consultar-boletos-v2) e [detalhes da cobrança](https://developers.cora.com.br/reference/consultar-detalhes-de-um-boleto-v2).
