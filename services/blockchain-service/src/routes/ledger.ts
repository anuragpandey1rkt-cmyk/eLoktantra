import { FastifyInstance } from 'fastify';
import { BlockchainLedgerService } from '../services/blockchainLedgerService';
import { BlockchainLedgerController } from '../controllers/blockchainLedgerController';

export default async function ledgerRoutes(fastify: FastifyInstance) {
  const ledgerService = new BlockchainLedgerService(fastify);
  const ledgerController = new BlockchainLedgerController(ledgerService);

  fastify.post('/record-vote', ledgerController.record);
}
