import { FastifyInstance } from 'fastify';
import '../plugins/supabase';
import axios from 'axios';

const IDENTITY_URL = process.env.IDENTITY_SERVICE_URL || 'http://localhost:4008';
const BLOCKCHAIN_URL = process.env.BLOCKCHAIN_SERVICE_URL || 'http://localhost:4009';

export class VotingService {
  private supabase: FastifyInstance['supabase'];

  constructor(fastify: FastifyInstance) {
    this.supabase = fastify.supabase;
  }

  async getElections() {
    const { data, error } = await this.supabase
      .from('elections')
      .select('*')
      .order('start_time', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async getElectionById(id: string) {
    const { data, error } = await this.supabase
      .from('elections')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new Error(error.message);
    
    // Also fetch candidates for the election's constituency
    const { data: candidates } = await this.supabase
      .from('candidates')
      .select('*')
      .eq('constituency', data.constituency);

    return { ...data, candidates: candidates || [] };
  }

  async createElection(electionData: any) {
    const { data, error } = await this.supabase
      .from('elections')
      .insert([electionData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async generateToken(voterId: string, electionId: string) {
    // Generate token by calling identity-service
    const response = await axios.post(`${IDENTITY_URL}/generate-voting-token`, {
      voterId,
      electionId
    });
    return response.data.tokenHash;
  }

  async submitVote(electionId: string, tokenHash: string, encryptedVote: string) {
    // 1. Verify token with Identity Service or DB
    const { data: tokenData, error: tokenError } = await this.supabase
      .from('voting_tokens')
      .select('*')
      .eq('token_hash', tokenHash)
      .eq('election_id', electionId)
      .single();

    if (tokenError || !tokenData) throw new Error('Invalid voting token');
    if (tokenData.used) throw new Error('Token has already been used');

    // 2. Mark token as used
    await this.supabase
      .from('voting_tokens')
      .update({ used: true })
      .eq('id', tokenData.id);

    // 3. Submit encrypted vote to Blockchain Ledger
    const ledgerResponse = await axios.post(`${BLOCKCHAIN_URL}/record-vote`, {
      electionId,
      encryptedVote
    });

    const txHash = ledgerResponse.data.txHash;

    // 4. Record vote in DB
    const { data: vote, error: voteError } = await this.supabase
      .from('votes')
      .insert([{
        election_id: electionId,
        encrypted_vote: encryptedVote,
        blockchain_tx_hash: txHash
      }])
      .select()
      .single();

    if (voteError) throw new Error(voteError.message);

    return vote;
  }
}
