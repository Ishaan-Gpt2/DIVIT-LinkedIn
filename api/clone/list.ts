import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../auth/verify-token';
import { supabase } from '../../lib/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'fail', message: 'Method not allowed' });
  }

  try {
    const user = await verifyToken(req);
    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }

    const { data: clones, error } = await supabase
      .from('ai_clones')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return res.status(200).json({
      status: 'success',
      data: {
        clones: clones || [],
        total: clones?.length || 0
      }
    });

  } catch (error) {
    console.error('Clone list error:', error);
    return res.status(500).json({
      status: 'fail',
      message: 'Failed to fetch clones'
    });
  }
}