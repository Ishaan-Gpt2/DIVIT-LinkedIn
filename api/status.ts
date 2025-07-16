import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ status: 'fail', message: 'Method not allowed' });
  }

  try {
    const apiStatus = {
      gemini: !!process.env.GEMINI_API_KEY,
      undetectable: !!process.env.UNDETECTABLE_API_KEY,
      sapling: !!process.env.SAPLING_API_KEY,
      resend: !!process.env.RESEND_API_KEY,
      apify: !!process.env.APIFY_API_KEY,
      phantombuster: !!process.env.PHANTOMBUSTER_API_KEY,
      languagetool: !!process.env.LANGUAGETOOL_API_KEY,
      uploadPost: !!process.env.UPLOAD_POST_API_KEY,
      supabase: !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
    };

    const healthChecks = await Promise.allSettled([
      checkGeminiHealth(),
      checkSupabaseHealth(),
      checkResendHealth()
    ]);

    return res.status(200).json({
      status: 'success',
      data: {
        backend: 'operational',
        apis: apiStatus,
        health: {
          gemini: healthChecks[0].status === 'fulfilled',
          supabase: healthChecks[1].status === 'fulfilled',
          resend: healthChecks[2].status === 'fulfilled'
        },
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      }
    });

  } catch (error) {
    console.error('Status check error:', error);
    return res.status(500).json({
      status: 'fail',
      message: 'Health check failed'
    });
  }
}

async function checkGeminiHealth() {
  if (!process.env.GEMINI_API_KEY) return false;
  // Add actual Gemini API health check here
  return true;
}

async function checkSupabaseHealth() {
  if (!process.env.SUPABASE_URL) return false;
  // Add actual Supabase health check here
  return true;
}

async function checkResendHealth() {
  if (!process.env.RESEND_API_KEY) return false;
  // Add actual Resend health check here
  return true;
}