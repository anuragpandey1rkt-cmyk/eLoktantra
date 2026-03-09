import { FastifyInstance } from 'fastify';
import '../plugins/supabase';

export class PromiseService {
  private supabase: FastifyInstance['supabase'];

  constructor(fastify: FastifyInstance) {
    this.supabase = fastify.supabase;
  }

  async addPromise(promiseData: any) {
    const { data, error } = await this.supabase
      .from('promises')
      .insert([promiseData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async getAllPromises() {
    const { data, error } = await this.supabase
      .from('promises')
      .select('*, candidates(name, party)');

    if (error) throw new Error(error.message);
    return data;
  }

  async getPromisesByCandidate(candidateId: string) {
    const { data, error } = await this.supabase
      .from('promises')
      .select('*')
      .eq('candidate_id', candidateId);

    if (error) throw new Error(error.message);
    return data;
  }

  async updatePromise(id: string, updateData: any) {
    const { data, error } = await this.supabase
      .from('promises')
      .update({ ...updateData, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
}
