import { FastifyReply, FastifyRequest } from 'fastify';
import { ManifestoService } from '../services/manifestoService';

export class ManifestoController {
  constructor(private manifestoService: ManifestoService) {}

  upload = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const result = await this.manifestoService.uploadManifesto(request.body);
      return reply.code(201).send({ success: true, manifesto: result });
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  };

  getAll = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const manifestos = await this.manifestoService.getAllManifestos();
      return reply.send({ success: true, count: manifestos.length, manifestos });
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  };

  compare = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const comparison = await this.manifestoService.compareManifestos();
      return reply.send({ success: true, categories: comparison });
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  };
}
