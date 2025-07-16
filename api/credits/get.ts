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

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('credits, plan')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      return res.status(404).json({
        status: 'fail',
        message: 'User profile not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        credits: profile.credits,
        plan: profile.plan,
        unlimited: profile.plan !== 'free'
      }
    });

  } catch (error) {
    console.error('Get credits error:', error);
    return res.status(500).json({
      status: 'fail',
      message: 'Internal server error'
    });
  }
}