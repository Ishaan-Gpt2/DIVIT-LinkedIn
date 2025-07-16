import axios from 'axios';

export async function humanizeContent(content: string) {
  const apiKey = process.env.UNDETECTABLE_API_KEY;
  
  if (!apiKey) {
    throw new Error('UNDETECTABLE_API_KEY not configured');
  }

  try {
    const response = await axios.post(
      'https://api.undetectable.ai/submit',
      {
        content: content,
        readability: 'High School',
        purpose: 'General Writing',
        strength: 'More Human'
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    if (response.data?.id) {
      // Poll for results
      const result = await pollUndetectableResults(response.data.id, apiKey);
      
      return {
        content: result.output || content,
        originalLength: content.length,
        humanizedLength: result.output?.length || content.length,
        service: 'undetectable.ai'
      };
    }

    throw new Error('No job ID returned from Undetectable.ai');

  } catch (error) {
    console.error('Humanization error:', error);
    throw new Error(`Content humanization failed: ${error.message}`);
  }
}

async function pollUndetectableResults(jobId: string, apiKey: string, maxAttempts = 10) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
      const response = await axios.get(
        `https://api.undetectable.ai/document/${jobId}`,
        {
          headers: { 'Authorization': `Bearer ${apiKey}` },
          timeout: 10000
        }
      );

      if (response.data?.status === 'done') {
        return response.data;
      }
    } catch (error) {
      console.warn(`Polling attempt ${attempt} failed:`, error.message);
    }
  }
  
  throw new Error('Humanization timeout');
}