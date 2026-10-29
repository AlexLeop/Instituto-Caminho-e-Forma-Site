# Área do apoiador

O acesso em `/portal-do-apoiador` usa o e-mail da doação, os últimos quatro dígitos do CPF e um código enviado por e-mail pelo Supabase Auth. A correspondência é conferida com uma doação Cora confirmada, incluída na arrecadação, já gravada no Supabase. O teste de R$ 30 não habilita acesso nem entra nos totais.

O painel mostra apenas os registros vinculados ao e-mail e ao final do documento que iniciaram a confirmação. Exibe contribuições confirmadas e cobranças pendentes desse mesmo apoiador, preservando o destino original e o valor conciliado. A exportação CSV contém somente o histórico dele. O arquivo é um extrato, não um recibo fiscal.

## Concluir o envio de códigos

O fluxo depende de **SMTP personalizado no Supabase**. O SMTP padrão não serve para a operação com apoiadores: restringe destinatários à equipe do projeto e possui limites baixos.

1. No projeto `mywxiyojndkjqyjrfqmw`, configure o remetente e o SMTP na seção de e-mails do Supabase Auth.
2. Em **Email Templates**, configure os modelos **Confirm signup** e **Magic Link** com o conteúdo de `supabase/templates/supporter-otp.html`. O primeiro modelo é usado no primeiro acesso; o segundo nos seguintes.
3. Use um assunto como **Seu código de acesso — Instituto Caminho e Forma**. O corpo precisa incluir `{{ .Token }}` para que a pessoa receba o código numérico.
4. Mantenha o provedor de e-mail habilitado. O primeiro acesso utiliza o cadastro por OTP do Supabase Auth; o sistema só solicita o envio após conferir a correspondência da doação. Novos cadastros por e-mail não podem estar globalmente desabilitados se apoiadores novos ainda não possuem usuário no Auth.
5. Depois de configurar, um apoiador com doação confirmada deve solicitar o código na página, recebê-lo na própria caixa postal e concluir o acesso. Não use uma conta de teste sem doação confirmada para validar a correspondência de dados.

A equipe do site não precisa receber senha de e-mail pelo chat. O SMTP e os templates são administrados no Supabase. As variáveis de servidor já utilizadas são `SUPABASE_URL`, `SUPABASE_SECRET_KEY` e `CHECKOUT_SIGNING_SECRET`; elas não são expostas no frontend.

## Proteções

- Até cinco solicitações por identidade e vinte por origem em quinze minutos; a identificação da origem é armazenada como HMAC, sem IP em texto aberto.
- Até cinco tentativas de código por solicitação; validade de dez minutos e uso único.
- O Supabase Auth comprova o controle do e-mail. O CPF parcial, isoladamente, não concede acesso.
- Sessão da aplicação aleatória, sem dados pessoais no token, em cookie `HttpOnly`, `SameSite=Strict` e `Secure` na Vercel. Somente o hash da sessão é armazenado no banco.
- Sessão válida por trinta minutos. A saída revoga o registro no banco e limpa o cookie. Excluir o usuário no Supabase Auth remove suas sessões da aplicação pela chave estrangeira.
- Nenhum código, sessão ou credencial é salvo no armazenamento público do navegador. Dados de outras pessoas não são retornados por seletores fornecidos pelo cliente.
- Tabelas e funções de autenticação são restritas ao servidor, com RLS, sem acesso de `anon` e `authenticated`.

As verificações automatizadas e de navegador usam códigos e entregas simulados; elas não comprovam a entrega real de e-mail. A validação da entrega precisa ocorrer depois da configuração do SMTP e dos templates.

Referências oficiais: [SMTP personalizado](https://supabase.com/docs/guides/auth/auth-smtp), [acesso por OTP](https://supabase.com/docs/guides/auth/auth-email-passwordless) e [modelos de e-mail](https://supabase.com/docs/guides/auth/auth-email-templates).
