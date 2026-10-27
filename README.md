<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

## Checkout de doações — Cora e Vercel

O checkout geral e o das páginas dos projetos usam a função Node.js `api/checkout.ts` para emitir e consultar cobranças Pix e boleto na Cora. A chave e o certificado são usados apenas no servidor.

Consulte [CORA-CHECKOUT.md](./CORA-CHECKOUT.md) para configurar as cinco variáveis de ambiente na Vercel, preparar `.env.vercel`, publicar e executar os testes.

Comandos úteis: `npm test`, `npm run cora:check`, `npm run vercel:env` e `npm run dev`.

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/f3d31be9-6f2a-4ead-a1ce-45bf3a58c858

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
