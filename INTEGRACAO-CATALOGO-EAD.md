# Catálogo EAD CGD/Cursoo

O site apresenta o catálogo e direciona cada produto à sua página de detalhes na
loja oficial `https://icfead.cursoo.com.br/`. Cadastro, pagamento, acesso às aulas
e certificados permanecem na plataforma contratada. Não há criação de alunos,
matrículas ou liberação de cursos por esta integração.

## Fontes verificadas em 04/11/2026

- O PDF `Edição de produtos em lote - CGD Gestão.pdf`, confirmado pelo Instituto
  como a relação de produtos ativos: nomes, categorias, cargas horárias e preços.
- HTMLs da loja enviados pelo Instituto: URLs individuais, descrições e imagens.
  Foram cruzadas as versões recebidas antes e depois da correção de Admin_EAD.
- API autenticada: 140 cursos CGD e nenhum de autoria. Vinte e quatro produtos
  foram associados ao ID exato, conferindo título, versão e carga horária.
  Introdução à Inteligência Artificial V5 usa os dados da loja e do PDF, pois não
  consta no catálogo recebido da API. Nenhum ID de outro curso foi atribuído.

O catálogo confirmado contém 25 cursos individuais de R$ 40,00 e cinco combos de
R$ 60,00, distribuídos em cinco categorias. Os combos são promoções por categoria,
com seleção feita na loja. A carga administrativa de 1 hora foi omitida: combos
usam `kind: combo` e `hours: null`.

## Funcionamento

`server/cgd/store-products.json` mantém os produtos ativos confirmados, preços,
URLs e metadados verificados. As imagens oficiais estão em `public/cursos/ead`.
Nenhum aluno, dado de doador ou segredo aparece nesses arquivos públicos.

`GET /api/courses` consulta os catálogos CGD e de autoria em paralelo, devolve
somente os produtos confirmados e mantém a resposta por cinco minutos. Outros
métodos de escrita são recusados. A chave não é devolvida ao navegador.

O build gera `src/data/courseCatalog.generated.json` somente com dados públicos.
Os mesmos componentes renderizam os 30 produtos no HTML inicial, mantendo o
catálogo acessível a mecanismos de busca e visitantes sem JavaScript. O navegador
consulta a função para atualizar os metadados; se ela estiver indisponível, os
dados verificados continuam visíveis com uma indicação de falha na atualização.

O catálogo possui busca sem distinção de acentos, filtro pelas categorias reais,
ordem alfabética e agrupamento entre cursos e combos promocionais. Imagem, título
e botão de cada produto levam à mesma página individual na loja.

## Configuração da Vercel

Configurar no ambiente Production, antes do deploy:

- `CGD_API_KEY`: segredo usado exclusivamente no servidor, sem prefixo `VITE_`.
- `CGD_URL_LOJA`: URL HTTPS da loja oficial do Instituto.

Não publicar `.env`, credenciais ou HTMLs administrativos como arquivos do site.
Esta integração não altera o checkout de doações nem seus indicadores.

## Manutenção

A API fornecida não informa preço, URL de venda ou publicação na loja. Portanto,
preços, novos produtos, remoções e links NÃO são sincronizados automaticamente.
Atualizar `store-products.json` com dados confirmados da loja, adicionar eventuais
imagens oficiais locais e executar o build, a verificação e a publicação.

Uma futura API de ofertas da CGD poderá substituir esse cadastro. Não derivar
slugs de títulos, anunciar valores presumidos ou usar a página inicial da loja
como se fosse a página de detalhes de um curso.
