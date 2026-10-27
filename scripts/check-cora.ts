import dotenv from 'dotenv';
import { CoraClient } from '../server/cora/client.ts';
import { readCoraConfig } from '../server/cora/config.ts';
dotenv.config({quiet: true});
try {
  const config = readCoraConfig();
  const result = await new CoraClient(config).checkConnection();
  console.log(`Autenticação Cora validada (${result.environment}). Certificado e chave válidos. Nenhuma cobrança emitida.`);
} catch {
  console.error('Não foi possível validar a Cora. Confira CORA_ENVIRONMENT, CORA_CLIENT_ID, CERTIFICATE_PEM, PRIVATE_KEY e CHECKOUT_SIGNING_SECRET. Nenhuma cobrança emitida.');
  process.exitCode = 1;
}
