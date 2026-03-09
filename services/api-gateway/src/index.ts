import Fastify from 'fastify';
import cors from '@fastify/cors';
import proxy from '@fastify/http-proxy';
import dotenv from 'dotenv';
// @ts-ignore
import { config } from '@eloktantra/config';

dotenv.config();

const fastify = Fastify({ logger: true });
const PORT = parseInt(process.env.PORT || '4000', 10);

fastify.register(cors);

// Health check for gateway
fastify.get('/health', async () => {
  return { status: 'OK', service: 'api-gateway' };
});

// Proxy routes to Microservices
fastify.register(proxy, {
  upstream: config.services.auth.url,
  prefix: '/auth',
  rewritePrefix: '/auth'
});

fastify.register(proxy, {
  upstream: config.services.candidate.url,
  prefix: '/candidates',
  rewritePrefix: '/candidates'
});

fastify.register(proxy, {
  upstream: config.services.issueReporting.url,
  prefix: '/issues',
  rewritePrefix: '/issues'
});

fastify.register(proxy, {
  upstream: config.services.voting.url,
  prefix: '/voting',
  rewritePrefix: ''
});

fastify.register(proxy, {
  upstream: config.services.blockchain.url,
  prefix: '/blockchain',
  rewritePrefix: ''
});

fastify.register(proxy, {
  upstream: config.services.manifesto.url,
  prefix: '/manifestos',
  rewritePrefix: '/manifestos'
});

fastify.register(proxy, {
  upstream: config.services.promiseTracker.url,
  prefix: '/promises',
  rewritePrefix: '/promises'
});

fastify.register(proxy, {
  upstream: config.services.audit.url,
  prefix: '/audit',
  rewritePrefix: '/audit'
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`API Gateway running on http://localhost:${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
