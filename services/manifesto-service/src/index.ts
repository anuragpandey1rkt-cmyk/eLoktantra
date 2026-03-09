import Fastify from 'fastify';
import cors from '@fastify/cors';
import dotenv from 'dotenv';
import supabasePlugin from './plugins/supabase';
import manifestoRoutes from './routes/manifesto';

dotenv.config();

const fastify = Fastify({ logger: true });
const PORT = parseInt(process.env.PORT || '4003', 10);

fastify.register(cors);
fastify.register(supabasePlugin);

fastify.get('/health', async () => {
  return { status: 'OK', service: 'manifesto-service' };
});

fastify.register(manifestoRoutes, { prefix: '/manifestos' });

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Manifesto Service running on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
