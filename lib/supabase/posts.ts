import { supabase } from './client';

export async function savePostToSupabase({
  userId,
  content,
  aiScore,
  humanScore,
  metadata
}: {
  userId: string;
  content: string;
  aiScore: number;
  humanScore: number;
  metadata: any;
}) {
  try {
    const { data, error } = await supabase
      .from('linkedin_posts')
      .insert({
        user_id: userId,
        content,
        ai_score: aiScore,
        human_score: humanScore,
        status: 'draft',
        engagement: {},
        tone: 'professional'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error saving post to Supabase:', error);
    throw error;
  }
}