import axios from 'axios';

export async function detectAI(text: string) {
  const apiKey = process.env.SAPLING_API_KEY;
  
  if (!apiKey) {
    throw new Error('SAPLING_API_KEY not configured');
  }

  try {
    const response = await axios.post(
      'https://api.sapling.ai/api/v1/aidetect',
      { text },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const score = response.data?.score;
    
    if (typeof score !== 'number') {
      throw new Error('Invalid AI detection score');
    }

    return {
      score,
      humanScore: Math.round((1 - score) * 100),
      aiScore: Math.round(score * 100),
      confidence: response.data?.confidence || 'medium',
      service: 'sapling'
    };

  } catch (error) {
    console.error('AI detection error:', error);
    throw new Error(`AI detection failed: ${error.message}`);
  }
}