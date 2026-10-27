import fs from 'node:fs';
import dotenv from 'dotenv';
import { readCoraConfig } from '../server/cora/config.ts';
dotenv.config({quiet: true});
try {
  const config = readCoraConfig();
  const values = {
    CORA_ENVIRONMENT: config.environment,
    CORA_CLIENT_ID: config.clientId,
    PRIVATE_KEY: Buffer.from(config.privateKey).toString('base64'),
    CERTIFICATE_PEM: Buffer.from(config.certificate).toString('base64'),
    CHECKOUT_SIGNING_SECRET: config.signingSecret,
  };
  const content = Object.entries(values).map(([key, value]) => `${key}=${value}`).join('\n') + '\n';
  fs.writeFileSync('.env.vercel', content, {mode: 0o600});
  console.log('.env.vercel preparado com as cinco variáveis do checkout. Arquivo privado e ignorado pelo Git e pelo deploy. Cadastre os valores nas variáveis de ambiente da Vercel; não publique o arquivo como código.');
} catch {
  console.error('Configuração incompleta. Corrija o .env antes de preparar as variáveis da Vercel.');
  process.exitCode = 1;
}
