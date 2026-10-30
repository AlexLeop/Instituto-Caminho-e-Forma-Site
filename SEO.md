# Busca no Google e ícone

O build gera o HTML das páginas públicas usando os mesmos componentes React da aplicação. O Google e visitantes sem JavaScript recebem conteúdo, títulos, descrições, links e endereço canônico de cada página. As páginas dos projetos usam `/projetos/{id}`; os endereços antigos com `?id=` redirecionam para esses endereços.

`scripts/build-seo.ts`, executado por `npm run build`, gera também `robots.txt`, `sitemap.xml` e os ícones SVG, ICO e PNG a partir do emblema oficial, com tela quadrada sem distorção. Não exige credenciais nem consulta doações. A área administrativa e o portal do apoiador usam HTML vazio, `noindex` e não entram no sitemap. A autorização dos dados continua nas APIs.

## Cadastro no Search Console

1. Cadastre a propriedade **Domínio** `institutocaminhoeforma.org.br` no [Google Search Console](https://search.google.com/search-console).
2. Adicione o registro TXT fornecido pelo Google no serviço que gerencia o DNS do domínio e conclua a verificação.
3. Na seção **Sitemaps**, envie `https://institutocaminhoeforma.org.br/sitemap.xml`.
4. Em **Inspeção de URL**, inspecione a página inicial e solicite a indexação. Confira o teste da URL publicada e eventuais motivos de exclusão.
5. Acompanhe o relatório de indexação. Corrigir o site e enviar o sitemap facilita a descoberta; o Google decide quais páginas indexa e quando atualiza os resultados e o ícone.

Antes desta correção, os endereços de robots, sitemap e favicon devolviam a página inicial em HTML; as páginas públicas dependiam de JavaScript para exibir conteúdo e usavam botões em grande parte da navegação. Esses problemas técnicos foram corrigidos. O motivo específico de uma exclusão do índice depende do diagnóstico do Search Console.

Referências: [JavaScript e SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview), [solicitar novo rastreamento](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl) e [favicon nos resultados](https://developers.google.com/search/docs/appearance/favicon-in-search).
