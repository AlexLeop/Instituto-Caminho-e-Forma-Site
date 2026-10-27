# Checkout Cora na Vercel

O checkout de doações usa a integração direta da Cora, com certificado e chave privada em todas as requisições. O botão geral de apoio e as páginas dos projetos compartilham o mesmo formulário e a função `POST /api/checkout`.

## O que está implementado

- Doação única por Pix (QR Code e Copia e Cola) ou boleto (PDF e linha digitável, com Pix alternativo quando disponibilizado pela Cora).
- CPF/CNPJ com validação de dígitos, valor entre R$ 5,00 e R$ 50.000,00 e projeto validado no servidor.
- Valores enviados à Cora em centavos e vencimento em três dias corridos.
- Idempotência: a mesma tentativa usa o mesmo UUID e os mesmos dados, inclusive após falha de conexão. Alterar os dados inicia outra tentativa.
- Consulta de pagamento protegida por um token assinado e vinculada à fatura, ao valor e ao ambiente. Nenhum dado pessoal do doador é devolvido pela API.
- A tela só confirma quando a Cora responde `PAID` com o valor integral. Não há confirmação por clique, temporizador ou webhook não verificado.
- Reabertura na mesma aba recupera a cobrança do `sessionStorage` e consulta novamente o banco. A consulta automática ocorre a cada dez segundos enquanto a página estiver visível, por até vinte minutos; depois o botão de consulta continua disponível.

O fluxo não cobra cartão e não contrata débito recorrente. As antigas opções simuladas de cartão e mensalidade foram retiradas do checkout. A feira solidária continua negociando diretamente com os produtores pelo WhatsApp; seus recebimentos não foram redirecionados para a conta do Instituto.

## Configurar na Vercel

1. Use como **Root Directory** a pasta que contém `package.json`, `vercel.json` e `api/checkout.ts`. Quando o conteúdo desta versão é enviado à raiz do repositório GitHub, mantenha o Root Directory padrão da Vercel; a pasta local `v1` não faz parte do caminho publicado.
2. Execute `npm run vercel:env`. Ele prepara `.env.vercel` com **somente as cinco variáveis do checkout**, usando certificado/chave em base64 para facilitar a configuração em uma linha. O arquivo contém segredos e está excluído do Git e do pacote de deploy.
3. No projeto da Vercel, abra **Settings → Environment Variables** e cadastre os cinco pares chave/valor de `.env.vercel`, no ambiente **Production**. Pode colar os pares em lote ou cadastrar cada variável individualmente. Não use prefixos `VITE_`.
4. Publique o código e faça um novo deploy depois de salvar as variáveis. O `.env` local não configura automaticamente o ambiente da Vercel.
5. No primeiro uso real, abra uma página de projeto ou “Apoie o Instituto”, preencha dados reais autorizados e gere uma cobrança. Confira no aplicativo bancário o recebedor e o valor antes de pagar. Verifique que o status só muda depois da confirmação da Cora.

| Variável | Conteúdo |
| --- | --- |
| `CORA_ENVIRONMENT` | `production` para a conta real; `stage` somente com credenciais de testes |
| `CORA_CLIENT_ID` | Identificador da integração direta na Cora |
| `PRIVATE_KEY` | Chave privada completa, PEM ou base64 |
| `CERTIFICATE_PEM` | Certificado completo correspondente à chave, PEM ou base64 |
| `CHECKOUT_SIGNING_SECRET` | Segredo aleatório com pelo menos 32 caracteres; manter estável entre deploys |

Os nomes alternativos `CORA_PRIVATE_KEY` e `CORA_CERTIFICATE_PEM` também são aceitos e têm prioridade, caso existam. Evite manter versões divergentes dos mesmos segredos.

O `vercel.json` instala as dependências com `npm ci` usando o `package-lock.json`, mantém as rotas `/api/` fora do fallback da aplicação e configura até 60 segundos para a função. A integração usa Node.js e o módulo HTTPS com mTLS; não deve ser convertida para Edge Runtime.

Para previews públicos de testes, use somente as credenciais **Stage** com `CORA_ENVIRONMENT=stage`. Credenciais de produção não devem ser copiadas para esses previews.

## Executar localmente

```sh
npm ci
npm run cora:check
npm run dev
```

`cora:check` valida o par de credenciais e obtém um token da Cora sem emitir cobrança, pagar ou transferir dinheiro. `npm run dev` atende a mesma função em `/api/checkout` por meio do middleware local do Vite. Não use `vite preview` como servidor de pagamentos: ele só serve a compilação estática.

## Verificação

```sh
npm test
npm run lint
npm run build
```

Os testes usam banco simulado, sem acessar a conta Cora. Cobrem validação, centavos, idempotência, confirmação pelo valor integral, expiração/adulteração de tokens, origem de requisições, limite de corpo, renovação de token bancário e mensagens de erro sem segredos. A autenticação real de produção foi validada durante a implementação; nenhuma fatura real foi criada ou paga para o teste.

## Limites operacionais

- A conta Cora precisa ter uma chave Pix cadastrada para disponibilizar o QR Code. Se a Cora ainda não retornar o código, a cobrança permanece pendente e o checkout permite consultar novamente.
- A própria Cora armazena a fatura. Não há banco de dados de doadores, mural de apoiadores, assinatura mensal, emissão fiscal ou envio de recibo fiscal nesta integração. Foi configurada a notificação de pagamento por e-mail da Cora, que não equivale a um recibo fiscal do Instituto.
- A confirmação ocorre por consulta autenticada à Cora enquanto o checkout está aberto ou quando o usuário retorna à mesma aba. Não há webhook, automação administrativa nem atualização dos totais estáticos dos projetos. Para conciliação administrativa, consulte as cobranças na Cora; integrações futuras podem persistir os eventos em uma base própria.
- A tentativa de emissão é válida por 24 horas e o acesso à consulta pelo site por sete dias. A expiração desse acesso não cancela a fatura na Cora. Nunca conclua que uma cobrança foi cancelada apenas porque a página expirou.
- Fazer outra doação não cancela a anterior. O checkout informa isso antes de oferecer uma nova cobrança.
- Proteção de leitura usa tokens assinados; eles não devem ser colocados em URLs ou logs. Não há limite distribuído contra automação de emissão nesta versão. Para tráfego público, configure limites no Vercel Firewall para `POST /api/checkout`, considerando que as consultas também usam essa rota.
- Rotacionar `CHECKOUT_SIGNING_SECRET` invalida os acessos de consulta já entregues; não afeta as faturas no banco. Renove certificados antes de vencerem e execute `npm run cora:check` após atualizar as credenciais.

## Documentação consultada

- [Utilização das APIs e mTLS](https://developers.cora.com.br/docs/utiliza%C3%A7%C3%A3o-das-apis)
- [Client Credentials e Client ID](https://developers.cora.com.br/docs/client-credentials-int-direta)
- [Emissão de QR Code Pix v2](https://developers.cora.com.br/reference/qr-code-pix-v2)
- [Emissão de boleto registrado v2](https://developers.cora.com.br/reference/emiss%C3%A3o-de-boleto-registrado-v2)
- [Consulta de detalhes do boleto](https://developers.cora.com.br/reference/consultar-detalhes-de-um-boleto-v2)
- [Vite na Vercel](https://vercel.com/docs/frameworks/frontend/vite)
- [Variáveis de ambiente na Vercel](https://vercel.com/docs/environment-variables/managing-environment-variables)
