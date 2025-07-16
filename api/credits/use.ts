import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../auth/verify-token';
import { supabase } from '../../lib/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'fail', message: 'Method not allowed' });
  }

  try {
    const user = await verifyToken(req);
    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }

    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(422).json({
        status: 'fail',
        message: 'Invalid amount'
      });
    }

    const success = await useCredits(user.id, amount);

    if (!success) {
      return res.status(402).json({
        status: 'fail',
        message: 'Insufficient credits'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Credits deducted successfully'
    });

  } catch (error) {
    console.error('Credits usage error:', error);
    return res.status(500).json({
      status: 'fail',
      message: 'Internal server error'
    });
  }
}

export async function useCredits(userId: string, amount: number): Promise<boolean> {
  try {
    // Get current user credits
    const { data: user, error: fetchError } = await supabase
      .from('profiles')
      .select('credits, plan')
      .eq('id', userId)
      .single();

    if (fetchError || !user) {
      throw new Error('User not found');
    }

    // Check if user has unlimited credits (paid plans)
    if (user.plan !== 'free') {
      return true; // Unlimited credits for paid plans
    }

    // Check if user has enough credits
    if (user.credits < amount) {
      return false;
    }

    // Deduct credits
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        credits: user.credits - amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    // Log API usage
    await supabase
      .from('api_usage')
      .insert({
        user_id: userId,
        service: 'credits',
        credits_used: amount,
        success: true
      });

    return true;

  } catch (error) {
    console.error('Credits deduction error:', error);
    return false;
  }
}