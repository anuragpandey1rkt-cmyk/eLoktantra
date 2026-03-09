import { FastifyInstance } from 'fastify';
import { PromiseService } from '../services/promiseService';
import { PromiseController } from '../controllers/promiseController';

export default async function promiseRoutes(fastify: FastifyInstance) {
  const promiseService = new PromiseService(fastify);
  const promiseController = new PromiseController(promiseService);

  fastify.post('/', promiseController.add);
  fastify.get('/', promiseController.getAll);
  fastify.get('/candidate/:id', promiseController.getByCandidate);
  fastify.patch('/:id', promiseController.update);
}
