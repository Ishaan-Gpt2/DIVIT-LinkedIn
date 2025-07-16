import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from './auth/verify-token';
import { useCredits } from './credits/use';
import { uploadToMultiplePlatforms } from '../lib/services/contentUploader';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'fail', message: 'Method not allowed' });
  }

  try {
    const user = await verifyToken(req);
    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }

    const { fileUrl, description, platforms, userId } = req.body;

    if (!fileUrl || !description || !platforms || !userId) {
      return res.status(422).json({
        status: 'fail',
        message: 'Missing required fields: fileUrl, description, platforms, userId'
      });
    }

    // Check and deduct 2 credits for content upload
    const creditsUsed = await useCredits(user.id, 2);
    if (!creditsUsed) {
      return res.status(402).json({
        status: 'fail',
        message: 'Insufficient credits'
      });
    }

    const result = await uploadToMultiplePlatforms({
      fileUrl,
      description,
      platforms,
      userId
    });

    return res.status(200).json({
      status: 'success',
      message: 'Content uploaded successfully',
      data: result
    });

  } catch (error) {
    console.error('Content upload error:', error);
    return res.status(500).json({
      status: 'fail',
      message: 'Upload failed',
      error: error.message
    });
  }
}