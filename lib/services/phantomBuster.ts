import axios from 'axios';

export async function triggerPhantomBuster(phantomId: string) {
  const apiKey = process.env.PHANTOMBUSTER_API_KEY;
  
  if (!apiKey) {
    throw new Error('PHANTOMBUSTER_API_KEY not configured');
  }

  try {
    const response = await axios.post(
      'https://api.phantombuster.com/api/v2/agents/launch',
      { id: phantomId },
      {
        headers: {
          'X-Phantombuster-Key': apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    return {
      success: true,
      phantomId,
      containerId: response.data?.containerId,
      status: response.data?.status || 'launched',
      service: 'phantombuster'
    };

  } catch (error) {
    console.error('PhantomBuster error:', error);
    throw new Error(`PhantomBuster trigger failed: ${error.message}`);
  }
}