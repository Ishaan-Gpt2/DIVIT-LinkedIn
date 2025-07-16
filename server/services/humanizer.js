import axios from 'axios';

/**
 * Humanize AI-generated content using Undetectable.ai with enhanced processing
 * @param {string} content - Content to humanize
 * @returns {Object} Humanized content result
 */
export async function humanizeContent(content) {
  const apiKey = process.env.UNDETECTABLE_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ UNDETECTABLE_API_KEY not configured, using enhanced mock humanization');
    return getEnhancedMockHumanization(content);
  }

  try {
    console.log('👤 Sending content to Undetectable.ai for humanization...');
    
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
        timeout: 60000 // 60 second timeout for humanization
      }
    );

    if (response.data && response.data.id) {
      // Poll for results
      const result = await pollForResults(response.data.id, apiKey);
      
      if (result && result.output) {
        console.log(`✅ Content humanized successfully (${result.output.length} characters)`);
        
        return {
          content: result.output,
          originalLength: content.length,
          humanizedLength: result.output.length,
          service: 'undetectable.ai',
          mode: 'more_human',
          confidence: result.confidence || 'high',
          timestamp: new Date().toISOString()
        };
      }
    }

    throw new Error('No humanized content returned from Undetectable.ai');

  } catch (error) {
    console.error('❌ Undetectable.ai error:', error.message);
    
    // Enhanced fallback humanization
    console.log('👤 Using enhanced mock humanization');
    return getEnhancedMockHumanization(content);
  }
}

/**
 * Poll Undetectable.ai for processing results
 */
async function pollForResults(jobId, apiKey, maxAttempts = 10) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
      
      const response = await axios.get(
        `https://api.undetectable.ai/document/${jobId}`,
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.data && response.data.status === 'done') {
        return response.data;
      }
      
      console.log(`⏳ Humanization in progress... (attempt ${attempt}/${maxAttempts})`);
      
    } catch (error) {
      console.warn(`⚠️ Polling attempt ${attempt} failed:`, error.message);
    }
  }
  
  throw new Error('Humanization timeout - max attempts reached');
}

/**
 * Enhanced mock humanization with sophisticated transformations
 */
function getEnhancedMockHumanization(content) {
  let humanized = content;

  // Advanced humanization transformations
  const transformations = [
    // Convert formal contractions
    { from: /\bdo not\b/gi, to: "don't" },
    { from: /\bcannot\b/gi, to: "can't" },
    { from: /\bwill not\b/gi, to: "won't" },
    { from: /\bit is\b/gi, to: "it's" },
    { from: /\bthat is\b/gi, to: "that's" },
    { from: /\bwe are\b/gi, to: "we're" },
    { from: /\bthey are\b/gi, to: "they're" },
    { from: /\byou are\b/gi, to: "you're" },
    { from: /\bI am\b/gi, to: "I'm" },
    
    // Replace overly formal language
    { from: /\bFurthermore,\b/g, to: "Plus," },
    { from: /\bHowever,\b/g, to: "But" },
    { from: /\bTherefore,\b/g, to: "So" },
    { from: /\bNevertheless,\b/g, to: "Still," },
    { from: /\bConsequently,\b/g, to: "As a result," },
    { from: /\bIn conclusion,\b/g, to: "Bottom line:" },
    { from: /\bTo summarize,\b/g, to: "In short:" },
    
    // Replace AI-sounding phrases
    { from: /\bdelve into\b/gi, to: "explore" },
    { from: /\bleverage\b/gi, to: "use" },
    { from: /\butilize\b/gi, to: "use" },
    { from: /\bfacilitate\b/gi, to: "help" },
    { from: /\boptimize\b/gi, to: "improve" },
    { from: /\benhance\b/gi, to: "boost" },
    { from: /\bimplement\b/gi, to: "put in place" },
    
    // Add more natural variations
    { from: /\bvery\b/gi, to: "really" },
    { from: /\bextremely\b/gi, to: "incredibly" },
    { from: /\bsignificant\b/gi, to: "major" },
    { from: /\bsubstantial\b/gi, to: "big" },
    { from: /\bnumerous\b/gi, to: "many" },
    { from: /\badditional\b/gi, to: "more" },
    
    // Make language more conversational
    { from: /\bIt should be noted that\b/gi, to: "Worth noting:" },
    { from: /\bIt is important to\b/gi, to: "You should" },
    { from: /\bOne must\b/gi, to: "You need to" },
    { from: /\bIt is essential to\b/gi, to: "Make sure to" },
  ];

  // Apply transformations
  transformations.forEach(({ from, to }) => {
    humanized = humanized.replace(from, to);
  });

  // Add natural pauses and emphasis (sparingly)
  if (Math.random() > 0.7) {
    humanized = humanized.replace(/\. ([A-Z])/g, '... $1');
  }

  // Add occasional informal elements
  if (Math.random() > 0.8) {
    humanized = humanized.replace(/\?$/gm, '? 🤔');
  }

  // Fix any double spaces or formatting issues
  humanized = humanized
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.!?])/g, '$1')
    .replace(/([.!?])\s*([a-z])/g, '$1 $2')
    .trim();

  console.log('👤 Applied enhanced humanization transformations');
  
  return {
    content: humanized,
    originalLength: content.length,
    humanizedLength: humanized.length,
    service: 'enhanced-mock-humanizer',
    mode: 'advanced',
    confidence: 'high',
    transformationsApplied: transformations.length,
    timestamp: new Date().toISOString()
  };
}