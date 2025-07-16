import axios from 'axios';

export async function scrapeLinkedInProfile(profileUrl: string) {
  const apiKey = process.env.APIFY_API_KEY;
  
  if (!apiKey) {
    throw new Error('APIFY_API_KEY not configured');
  }

  try {
    // Start scraping task
    const runResponse = await axios.post(
      `https://api.apify.com/v2/acts/drobnikj~linkedin-profile-scraper/runs?token=${apiKey}`,
      {
        startUrls: [{ url: profileUrl }],
        proxyConfiguration: { useApifyProxy: true }
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );

    const runId = runResponse.data?.data?.id;
    if (!runId) {
      throw new Error('Failed to start scraping task');
    }

    // Poll for results
    const result = await pollApifyResults(runId, apiKey);
    
    if (result && result.length > 0) {
      const profile = result[0];
      return {
        fullName: profile.fullName || 'Unknown',
        headline: profile.headline || '',
        about: profile.about || '',
        location: profile.location || '',
        industry: profile.industry || '',
        connections: profile.connectionsCount || 0,
        experience: profile.experience || [],
        education: profile.education || [],
        skills: profile.skills || []
      };
    }

    throw new Error('No profile data returned');

  } catch (error) {
    console.error('Profile scraping error:', error);
    throw new Error(`Profile scraping failed: ${error.message}`);
  }
}

async function pollApifyResults(runId: string, apiKey: string, maxAttempts = 12) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    try {
      const statusResponse = await axios.get(
        `https://api.apify.com/v2/actor-runs/${runId}?token=${apiKey}`,
        { timeout: 10000 }
      );

      if (statusResponse.data?.data?.status === 'SUCCEEDED') {
        const resultsResponse = await axios.get(
          `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${apiKey}`,
          { timeout: 10000 }
        );
        
        return resultsResponse.data;
      }
    } catch (error) {
      console.warn(`Polling attempt ${attempt} failed:`, error.message);
    }
  }
  
  throw new Error('Scraping timeout');
}