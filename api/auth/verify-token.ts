import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';

export interface User {
  id: string;
  email: string;
  plan: string;
}

export async function verifyToken(req: NextApiRequest): Promise<User | null> {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const jwtSecret = process.env.JWT_SECRET_KEY;

    if (!jwtSecret) {
      throw new Error('JWT_SECRET_KEY not configured');
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    
    return {
      id: decoded.sub || decoded.id,
      email: decoded.email,
      plan: decoded.plan || 'free'
    };

  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'fail', message: 'Method not allowed' });
  }

  try {
    const user = await verifyToken(req);
    
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid or expired token'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: { user }
    });

  } catch (error) {
    return res.status(500).json({
      status: 'fail',
      message: 'Token verification failed'
    });
  }
}