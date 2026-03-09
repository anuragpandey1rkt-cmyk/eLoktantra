import { FastifyInstance } from 'fastify';
import '../plugins/supabase';

export class ManifestoService {
  private supabase: FastifyInstance['supabase'];

  constructor(fastify: FastifyInstance) {
    this.supabase = fastify.supabase;
  }

  async uploadManifesto(manifestoData: any) {
    // Simulate AI Summarization
    const summary = `AI Summary for ${manifestoData.party}'s ${manifestoData.policy_category} policy: This plan focuses on ${manifestoData.policy_text.substring(0, 50)}...`;
    
    const { data, error } = await this.supabase
      .from('manifestos')
      .insert([{
        ...manifestoData,
        summary
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async getAllManifestos() {
    const { data, error } = await this.supabase
      .from('manifestos')
      .select('*')
      .order('party', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  }

  async compareManifestos() {
    // Returns manifestos grouped by category for comparison
    const { data, error } = await this.supabase
      .from('manifestos')
      .select('*');

    if (error) throw new Error(error.message);

    const categories: any = {};
    data.forEach((item: any) => {
      if (!categories[item.policy_category]) {
        categories[item.policy_category] = [];
      }
      categories[item.policy_category].push({
        party: item.party,
        text: item.policy_text,
        summary: item.summary
      });
    });

    return categories;
  }
}
