# Doações e prestação de contas

## Consultar e exportar

Acesse `/gestao/doacoes` e informe a chave de acesso privada. Escolha o período **de pagamento**, consulte os recebimentos e filtre por destino. O botão **Baixar planilha CSV** exporta as linhas selecionadas, incluindo os pagamentos de teste com indicação explícita de exclusão. A planilha abre no Excel com separador ponto e vírgula e valores em reais.

O relatório contém referência Cora, emissão, pagamento, nome e e-mail do doador, documento mascarado, valor cobrado, valor recebido, forma de pagamento, destino conciliado, descrição original e observações da conciliação. Ele não emite recibos fiscais nem substitui os comprovantes bancários.

O painel só mostra o total após concluir todas as páginas da consulta. Períodos podem ter até 366 dias; o limite por consulta é 2.000 cobranças bancárias. Reduza o período ao atingir esse limite. Cobranças da conta sem referência do checkout não entram como doações do site. Destinos não identificáveis ficam separados para conciliação, sem atribuição automática ao fundo geral.

Recebimentos externos aparecem em seção própria e em linhas separadas do CSV, e são somados no **Resumo das doações** do topo junto com os pagamentos Cora, respeitando o destino selecionado e sem duplicação. Registros sem data também entram no resumo, com aviso explícito de que a data ainda não foi informada; não é atribuída uma data fictícia para enquadrá-los no período consultado. Para prestação de contas por exercício, é necessário completar a data e reunir os comprovantes desses registros.

## Destino preservado no banco

O checkout geral exige seleção explícita de destino, inclusive fundo geral e cursos EAD. O campo permite digitar para filtrar por palavras, com ou sem acentos, e apresenta as opções em ordem alfabética em português. Digitar sem selecionar uma opção não define o destino. As páginas dos projetos já selecionam o próprio projeto; o botão de apoio ao EAD seleciona `cursos-ead`. A descrição enviada à Cora começa por `Destino [identificador]: título`. O identificador permanece mesmo quando o banco limita o texto a 100 caracteres. Cobranças antigas com `Apoio: título` também são reconhecidas.

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

Essa chave também autoriza o registro de realocações internas e estornos no painel administrativo. Ela não movimenta dinheiro na Cora. Deve ser compartilhada somente com os responsáveis pela administração financeira.

## Realocações internas

Depois de consultar o relatório, a seção **Realocações de recursos** mostra o recebido originalmente, as entradas e saídas por realocação e o valor destinado a cada projeto após essas mudanças. Os saldos são acumulados; o filtro de período limita a lista de movimentações.

Para registrar, escolha origem e destino, informe o valor, o responsável e o motivo. Confira o resumo e confirme o registro. A data é preenchida no servidor. A operação é atômica, verifica o saldo de origem e usa uma referência única para impedir duplicação em uma repetição da mesma requisição. O responsável é o nome informado pelo administrador que possui a chave; o painel não identifica individualmente quem compartilha essa chave.

Exemplo: uma doação de R$ 1.000 ao boxe continua registrada como recebimento do boxe. Ao realocar R$ 800 para o ballet, os valores destinados passam a R$ 200 no boxe e R$ 800 no ballet. O total recebido pelo Instituto permanece R$ 1.000. Os indicadores públicos de arrecadação e o extrato do apoiador preservam a destinação da contribuição; a movimentação posterior aparece no painel administrativo.

As realocações não alteram a descrição original nem a conciliação das cobranças. Não representam pagamento ou transferência bancária automática, e os valores destinados não são o saldo da conta bancária. Despesas e pagamentos efetivos precisam ser comprovados pelos documentos financeiros correspondentes.

Para corrigir uma realocação, utilize **Estornar registro**, informe o motivo e confirme. O estorno cria um lançamento contrário, vinculado ao original. Não apaga o histórico e exige saldo no projeto de retorno. Se os recursos já foram realocados novamente, é necessário reorganizar as movimentações antes de estornar. Cada registro pode ter apenas um estorno.

O botão **Baixar realocações CSV** exporta o histórico completo encontrado no período, incluindo estornos, responsável, motivo e referências. O CSV das doações permanece separado para não confundir realocações com novas receitas.

A tabela `donation_fund_movements` permite apenas leitura e inserção pelo servidor; não permite atualização ou exclusão pela API. As funções de saldo e registro também são privadas. O acesso do apoiador é separado e documentado em `PORTAL-DO-APOIADOR.md`.

## Banco Supabase

O servidor utiliza **SUPABASE_URL** e **SUPABASE_SECRET_KEY**. A chave secreta nunca é importada pelo frontend. Não são necessárias senha PostgreSQL ou chaves de assinatura JWT no código publicado. A integração também funciona sem Supabase configurado, consultando a Cora; se uma configuração parcial for fornecida, ela deve ser corrigida.

A tabela `public.donation_ledger` preserva referência, estado da cobrança, valor, destino, descrição original e conciliação. A chave composta `(environment, id)` evita duplicação e separa Stage de produção. A tabela `public.donation_ledger_events` mantém os estados anteriores quando há alterações; observações repetidas sem mudanças não criam novos eventos. As duas tabelas têm RLS habilitado e nenhuma permissão de leitura para `anon` ou `authenticated`. O servidor possui acesso restrito; os eventos não podem ser atualizados ou apagados pelo papel da API.

A função privada `donation_public_totals` soma exclusivamente registros incluídos, com estado `PAID` e valor recebido integral. O pagamento de teste permanece com `included = false`, visível apenas na prestação de contas. Somente os valores agregados são enviados pelo endpoint público do site. Nenhum documento completo, código Pix, token de checkout ou credencial é gravado nessas tabelas.

Em caso de indisponibilidade da Cora, o painel pode consultar os registros já salvos e exibe um aviso de que pagamentos recentes podem ainda não aparecer. A gravação de uma cobrança não a torna uma doação: registros pendentes não entram na arrecadação.

Para preparar a estrutura e importar as cobranças conciliadas usando as credenciais locais:

```sh
npm run donations:database -- --apply
npm run donations:sync
```

O primeiro comando usa `POSTGRES_URL_NON_POOLING` somente no computador, valida o projeto de destino e a conexão TLS com o certificado oficial. As migrações estão em `supabase/migrations/20261029224832_donation_ledger.sql` e `supabase/migrations/20261029233335_fund_reallocations_supporter_access.sql`. Não precisam ser executadas durante o deploy. Sem `--apply`, o comando apenas confere as proteções. O segundo comando consulta a Cora e salva os registros de forma idempotente, sem emitir cobranças.

## Exportar localmente

Com as credenciais Cora no `.env`, execute:

```sh
npm run donations:report -- --start 2026-01-01 --end 2026-10-29
```

O comando faz consultas de leitura, sem emitir cobranças ou movimentar dinheiro. O CSV é salvo em `scratch/prestacao-de-contas/`, fora do Git. Preserve esses arquivos com acesso restrito.

## Verificação

`npm test`, `npm run lint` e `npm run build`. Os testes usam banco simulado e cobrem recuperação do destino, EAD, correções, exclusão de testes, valores em centavos, paginação, confirmação bancária, dados não identificados, autenticação, ausência de dados pessoais no endpoint público e proteção contra fórmulas no CSV.

Referências oficiais: [consulta de cobranças](https://developers.cora.com.br/reference/consultar-boletos-v2) e [detalhes da cobrança](https://developers.cora.com.br/reference/consultar-detalhes-de-um-boleto-v2).
