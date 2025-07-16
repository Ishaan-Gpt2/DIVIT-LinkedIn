import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'fail', message: 'Method not allowed' });
  }

  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ status: 'fail', message: 'Not allowed in production' });
  }

  try {
    // Create test user
    const testUser = {
      id: 'test-user-123',
      email: 'test@chaitra.ai',
      name: 'Test User',
      plan: 'creator',
      credits: 100
    };

    const { error: userError } = await supabase
      .from('profiles')
      .upsert(testUser);

    if (userError) {
      throw userError;
    }

    // Create test clone
    const { error: cloneError } = await supabase
      .from('ai_clones')
      .upsert({
        id: 'test-clone-123',
        user_id: testUser.id,
        name: 'Test Professional Clone',
        description: 'Professional writing style for testing',
        tone: 'Professional and engaging',
        personality: ['Knowledgeable', 'Helpful', 'Industry-focused'],
        sample_posts: ['Sample professional post for testing'],
        is_active: true
      });

    if (cloneError) {
      throw cloneError;
    }

    // Create test posts
    const testPosts = [
      {
        user_id: testUser.id,
        content: 'Test LinkedIn post content',
        tone: 'professional',
        status: 'posted',
        ai_score: 15,
        human_score: 85,
        engagement: { likes: 25, comments: 5, shares: 3 }
      },
      {
        user_id: testUser.id,
        content: 'Another test post for demonstration',
        tone: 'conversational',
        status: 'draft',
        ai_score: 20,
        human_score: 80,
        engagement: {}
      }
    ];

    const { error: postsError } = await supabase
      .from('linkedin_posts')
      .upsert(testPosts);

    if (postsError) {
      throw postsError;
    }

    return res.status(200).json({
      status: 'success',
      message: 'Test data seeded successfully',
      data: {
        user: testUser,
        postsCreated: testPosts.length
      }
    });

  } catch (error) {
    console.error('Seed error:', error);
    return res.status(500).json({
      status: 'fail',
      message: 'Failed to seed test data',
      error: error.message
    });
  }
}