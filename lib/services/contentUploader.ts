import axios from 'axios';

export async function uploadToMultiplePlatforms({
  fileUrl,
  description,
  platforms,
  userId
}: {
  fileUrl: string;
  description: string;
  platforms: string[];
  userId: string;
}) {
  const apiKey = process.env.UPLOAD_POST_API_KEY;
  
  if (!apiKey) {
    throw new Error('UPLOAD_POST_API_KEY not configured');
  }

  try {
    const uploadPromises = platforms.map(platform => 
      uploadToPlatform(platform, { fileUrl, description, userId }, apiKey)
    );

    const results = await Promise.allSettled(uploadPromises);
    
    const platformResults = {};
    let successCount = 0;
    
    results.forEach((result, index) => {
      const platform = platforms[index];
      
      if (result.status === 'fulfilled') {
        platformResults[platform] = result.value;
        successCount++;
      } else {
        platformResults[platform] = {
          success: false,
          error: result.reason.message,
          platform
        };
      }
    });

    return {
      success: successCount > 0,
      platforms,
      platformResults,
      summary: {
        total: platforms.length,
        successful: successCount,
        failed: platforms.length - successCount
      }
    };

  } catch (error) {
    console.error('Multi-platform upload error:', error);
    throw new Error(`Content upload failed: ${error.message}`);
  }
}

async function uploadToPlatform(
  platform: string,
  { fileUrl, description, userId }: { fileUrl: string; description: string; userId: string },
  apiKey: string
) {
  try {
    const response = await axios.post(
      `https://api.uploadpost.com/v1/upload/${platform}`,
      {
        file_url: fileUrl,
        caption: description,
        user_id: userId,
        auto_publish: true
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 45000
      }
    );

    return {
      success: true,
      platform,
      postId: response.data.post_id,
      url: response.data.post_url,
      status: 'published'
    };

  } catch (error) {
    throw new Error(`${platform} upload failed: ${error.message}`);
  }
}