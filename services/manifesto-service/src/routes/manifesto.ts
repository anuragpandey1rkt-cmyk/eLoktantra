import { FastifyInstance } from 'fastify';
import { ManifestoService } from '../services/manifestoService';
import { ManifestoController } from '../controllers/manifestoController';

export default async function manifestoRoutes(fastify: FastifyInstance) {
  const manifestoService = new ManifestoService(fastify);
  const manifestoController = new ManifestoController(manifestoService);

  fastify.post('/upload', manifestoController.upload);
  fastify.get('/', manifestoController.getAll);
  fastify.get('/compare', manifestoController.compare);
}
