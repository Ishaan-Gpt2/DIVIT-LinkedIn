import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../auth/verify-token';
import { supabase } from '../../lib/supabase/client';
import { analyzeCloneTone } from '../../lib/services/aiGenerator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'fail', message: 'Method not allowed' });
  }

  try {
    const user = await verifyToken(req);
    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }

    const { samplePost, cloneName, userId } = req.body;

    if (!samplePost || !cloneName || !userId) {
      return res.status(422).json({
        status: 'fail',
        message: 'Missing required fields: samplePost, cloneName, userId'
      });
    }

    // Analyze tone using Gemini
    const toneAnalysis = await analyzeCloneTone(samplePost);

    // Save clone to Supabase
    const { data: clone, error } = await supabase
      .from('ai_clones')
      .insert({
        user_id: userId,
        name: cloneName,
        description: `AI clone based on writing sample analysis`,
        tone: toneAnalysis.tone,
        personality: toneAnalysis.personality,
        sample_posts: [samplePost],
        is_active: false
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(200).json({
      status: 'success',
      message: 'Clone saved successfully',
      data: { clone }
    });

  } catch (error) {
    console.error('Clone save error:', error);
    return res.status(500).json({
      status: 'fail',
      message: 'Failed to save clone',
      error: error.message
    });
  }
}