import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import supabasePlugin from './plugins/supabase';
import ledgerRoutes from './routes/ledger';

dotenv.config();

const fastify = Fastify({ logger: true });
const PORT = parseInt(process.env.PORT || '4009', 10);

fastify.register(cors);
fastify.register(supabasePlugin);

fastify.get('/health', async () => {
  return { status: 'OK', service: 'blockchain-ledger-service' };
});

fastify.register(ledgerRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Blockchain Ledger Service running on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
