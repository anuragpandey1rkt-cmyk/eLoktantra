import { FastifyReply, FastifyRequest } from 'fastify';
import { PromiseService } from '../services/promiseService';

export class PromiseController {
  constructor(private promiseService: PromiseService) {}

  add = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const promise = await this.promiseService.addPromise(request.body);
      return reply.code(201).send({ success: true, promise });
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  };

  getAll = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const promises = await this.promiseService.getAllPromises();
      return reply.send({ success: true, count: promises.length, promises });
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  };

  getByCandidate = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const promises = await this.promiseService.getPromisesByCandidate(request.params.id);
      return reply.send({ success: true, count: promises.length, promises });
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  };

  update = async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const promise = await this.promiseService.updatePromise(request.params.id, request.body);
      return reply.send({ success: true, promise });
    } catch (error: any) {
      return reply.code(500).send({ success: false, error: error.message });
    }
  };
}
