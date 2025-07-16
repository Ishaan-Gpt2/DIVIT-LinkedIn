import axios from 'axios';

/**
 * Trigger PhantomBuster automation with enhanced error handling
 * @param {string} phantomId - PhantomBuster phantom ID
 * @returns {Object} Trigger result
 */
export async function triggerPhantomBuster(phantomId) {
  const apiKey = process.env.PHANTOMBUSTER_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ PHANTOMBUSTER_API_KEY not configured, simulating trigger');
    return getEnhancedMockPhantomResult(phantomId);
  }

  try {
    console.log('🤖 Triggering PhantomBuster automation...');
    console.log(`🆔 Phantom ID: ${phantomId}`);
    
    const response = await axios.post(
      'https://api.phantombuster.com/api/v2/agents/launch',
      {
        id: phantomId,
        output: 'first-result',
        saveFolder: 'chaitra-automation'
      },
      {
        headers: {
          'X-Phantombuster-Key': apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const result = response.data;
    console.log(`✅ PhantomBuster triggered successfully (Container: ${result.containerId})`);

    return {
      success: true,
      phantomId,
      containerId: result.containerId,
      status: result.status || 'launched',
      queuePosition: result.queuePosition || 0,
      estimatedTime: result.estimatedTime || 'Unknown',
      service: 'phantombuster',
      triggeredAt: new Date().toISOString(),
      apiResponse: {
        message: result.message || 'Phantom launched successfully',
        executionId: result.executionId
      }
    };

  } catch (error) {
    console.error('❌ PhantomBuster trigger error:', error.message);
    
    // Enhanced fallback with detailed simulation
    console.log('🤖 Using enhanced mock PhantomBuster trigger');
    return getEnhancedMockPhantomResult(phantomId, error.message);
  }
}

/**
 * Get PhantomBuster automation status
 * @param {string} containerId - Container ID from trigger response
 * @returns {Object} Status result
 */
export async function getPhantomStatus(containerId) {
  const apiKey = process.env.PHANTOMBUSTER_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ PHANTOMBUSTER_API_KEY not configured, using mock status');
    return getMockPhantomStatus(containerId);
  }

  try {
    const response = await axios.get(
      `https://api.phantombuster.com/api/v2/agents/output?id=${containerId}`,
      {
        headers: {
          'X-Phantombuster-Key': apiKey
        },
        timeout: 15000
      }
    );

    return {
      success: true,
      containerId,
      status: response.data.status,
      progress: response.data.progress || 0,
      output: response.data.output || [],
      service: 'phantombuster',
      checkedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ PhantomBuster status error:', error.message);
    return getMockPhantomStatus(containerId, error.message);
  }
}

/**
 * Generate enhanced mock PhantomBuster result
 */
function getEnhancedMockPhantomResult(phantomId, errorMessage = null) {
  const containerId = `mock_container_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`;
  
  console.log(`🤖 Mock PhantomBuster automation:`);
  console.log(`   Phantom ID: ${phantomId}`);
  console.log(`   Container ID: ${containerId}`);
  
  if (errorMessage) {
    console.log(`   Note: Fallback due to error - ${errorMessage}`);
  }

  const mockResult = {
    success: true,
    phantomId,
    containerId,
    status: 'launched',
    queuePosition: 0,
    estimatedTime: '2-5 minutes',
    service: 'enhanced-mock-phantombuster',
    triggeredAt: new Date().toISOString(),
    simulation: {
      automationType: 'LinkedIn Engagement',
      expectedActions: [
        'Profile visits',
        'Connection requests',
        'Post interactions',
        'Message sending'
      ],
      estimatedCompletion: new Date(Date.now() + 300000).toISOString(), // 5 minutes
      mockData: true
    },
    apiResponse: {
      message: 'Mock phantom launched successfully',
      executionId: `exec_${Date.now()}`
    }
  };

  if (errorMessage) {
    mockResult.fallbackReason = errorMessage;
    mockResult.note = 'Automation would run via PhantomBuster in production';
  }

  return mockResult;
}

/**
 * Generate mock PhantomBuster status
 */
function getMockPhantomStatus(containerId, errorMessage = null) {
  const statuses = ['running', 'completed', 'paused'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const progress = randomStatus === 'completed' ? 100 : Math.floor(Math.random() * 80) + 10;

  return {
    success: true,
    containerId,
    status: randomStatus,
    progress,
    output: [
      { action: 'Profile visited', target: 'linkedin.com/in/example-user', timestamp: new Date().toISOString() },
      { action: 'Connection sent', target: 'John Doe', timestamp: new Date().toISOString() },
      { action: 'Post liked', target: 'Recent industry update', timestamp: new Date().toISOString() }
    ],
    service: 'mock-phantombuster',
    checkedAt: new Date().toISOString(),
    simulation: {
      mockData: true,
      note: errorMessage ? `Fallback due to: ${errorMessage}` : 'Mock status for testing'
    }
  };
}

/**
 * Validate PhantomBuster phantom ID format
 */
export function validatePhantomId(phantomId) {
  // PhantomBuster IDs are typically UUIDs or similar format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const alphanumericRegex = /^[a-zA-Z0-9-_]{10,50}$/;
  
  return uuidRegex.test(phantomId) || alphanumericRegex.test(phantomId);
}

/**
 * Get available PhantomBuster phantoms
 */
export async function getAvailablePhantoms() {
  const apiKey = process.env.PHANTOMBUSTER_API_KEY;
  
  if (!apiKey) {
    return getMockPhantomsList();
  }

  try {
    const response = await axios.get(
      'https://api.phantombuster.com/api/v2/agents/fetch-all',
      {
        headers: {
          'X-Phantombuster-Key': apiKey
        },
        timeout: 15000
      }
    );

    return {
      success: true,
      phantoms: response.data.data || [],
      service: 'phantombuster',
      fetchedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Error fetching phantoms:', error.message);
    return getMockPhantomsList(error.message);
  }
}

/**
 * Generate mock phantoms list
 */
function getMockPhantomsList(errorMessage = null) {
  return {
    success: true,
    phantoms: [
      {
        id: 'linkedin-auto-connect-v1',
        name: 'LinkedIn Auto Connect',
        description: 'Automatically send connection requests to targeted prospects',
        status: 'ready'
      },
      {
        id: 'linkedin-post-engager-v2',
        name: 'LinkedIn Post Engager',
        description: 'Like and comment on relevant posts in your industry',
        status: 'ready'
      },
      {
        id: 'linkedin-profile-visitor-v1',
        name: 'LinkedIn Profile Visitor',
        description: 'Visit profiles of potential connections to increase visibility',
        status: 'ready'
      }
    ],
    service: 'mock-phantombuster',
    fetchedAt: new Date().toISOString(),
    note: errorMessage ? `Fallback due to: ${errorMessage}` : 'Mock phantoms for testing'
  };
}