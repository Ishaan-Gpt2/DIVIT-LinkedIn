import axios from 'axios';

/**
 * Detect AI-generated content using Sapling AI Detection with enhanced analysis
 * @param {string} text - Text to analyze
 * @returns {Object} AI detection result
 */
export async function detectAI(text) {
  const apiKey = process.env.SAPLING_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ SAPLING_API_KEY not configured, using enhanced mock AI detection');
    return getEnhancedMockAIDetection(text);
  }

  try {
    console.log('🔍 Sending text to Sapling AI for detection analysis...');
    
    const response = await axios.post(
      'https://api.sapling.ai/api/v1/aidetect',
      {
        text: text
      },
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
      throw new Error('Invalid AI detection score returned');
    }

    const humanScore = Math.round((1 - score) * 100);
    const aiScore = Math.round(score * 100);
    
    console.log(`✅ AI detection complete: ${humanScore}% human, ${aiScore}% AI`);

    return {
      score: score, // 0-1 scale, where 1 = likely AI-generated
      humanScore: humanScore,
      aiScore: aiScore,
      confidence: response.data?.confidence || calculateConfidence(score),
      service: 'sapling',
      analysis: {
        likely_ai: score > 0.5,
        confidence_level: score > 0.8 ? 'high' : score > 0.3 ? 'medium' : 'low',
        quality_assessment: getQualityAssessment(score),
        recommendations: getRecommendations(score)
      },
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Sapling AI detection error:', error.message);
    
    // Enhanced fallback detection
    console.log('🔍 Using enhanced mock AI detection');
    return getEnhancedMockAIDetection(text);
  }
}

/**
 * Calculate confidence level based on score
 */
function calculateConfidence(score) {
  if (score > 0.8 || score < 0.2) return 'high';
  if (score > 0.6 || score < 0.4) return 'medium';
  return 'low';
}

/**
 * Get quality assessment based on AI score
 */
function getQualityAssessment(score) {
  if (score < 0.2) return 'Excellent - Very human-like';
  if (score < 0.4) return 'Good - Mostly human-like';
  if (score < 0.6) return 'Fair - Some AI characteristics';
  if (score < 0.8) return 'Poor - Clearly AI-generated';
  return 'Very Poor - Obviously AI-generated';
}

/**
 * Get recommendations based on AI score
 */
function getRecommendations(score) {
  if (score < 0.3) {
    return ['Content appears human-like', 'Ready for publication'];
  } else if (score < 0.6) {
    return ['Consider adding personal anecdotes', 'Use more conversational language', 'Add specific examples'];
  } else {
    return ['Needs significant humanization', 'Add personal experiences', 'Use more natural language', 'Break up formal structure'];
  }
}

/**
 * Enhanced mock AI detection with sophisticated analysis
 */
function getEnhancedMockAIDetection(text) {
  let score = 0.15; // Base human-like score
  
  // Analyze text characteristics that indicate AI generation
  const aiIndicators = [
    { pattern: /\b(Furthermore|Moreover|Additionally|Consequently)\b/gi, weight: 0.08 },
    { pattern: /\b(In conclusion|To summarize|In summary)\b/gi, weight: 0.06 },
    { pattern: /\b(delve into|leverage|utilize|facilitate|optimize)\b/gi, weight: 0.05 },
    { pattern: /\b(comprehensive|extensive|substantial|significant)\b/gi, weight: 0.03 },
    { pattern: /\b(It is important to note|It should be noted)\b/gi, weight: 0.07 },
    { pattern: /\b(various|numerous|multiple)\b/gi, weight: 0.02 },
    { pattern: /\. [A-Z][^.]{100,}\./g, weight: 0.04 }, // Very long sentences
    { pattern: /\b\w{12,}\b/g, weight: 0.01 }, // Very long words
  ];

  // Human indicators (reduce AI score)
  const humanIndicators = [
    { pattern: /\b(I'm|don't|can't|won't|it's)\b/gi, weight: -0.03 },
    { pattern: /[!?]{1,2}/g, weight: -0.02 },
    { pattern: /\.\.\./g, weight: -0.02 },
    { pattern: /\b(honestly|actually|really|pretty|quite)\b/gi, weight: -0.02 },
    { pattern: /\b(I think|I believe|In my opinion)\b/gi, weight: -0.04 },
    { pattern: /\b(lol|haha|😊|🤔|💡)\b/gi, weight: -0.05 },
  ];

  // Calculate AI indicators
  aiIndicators.forEach(indicator => {
    const matches = text.match(indicator.pattern);
    if (matches) {
      score += matches.length * indicator.weight;
    }
  });

  // Calculate human indicators
  humanIndicators.forEach(indicator => {
    const matches = text.match(indicator.pattern);
    if (matches) {
      score += matches.length * indicator.weight;
    }
  });

  // Text length factor
  if (text.length > 1000) score += 0.02;
  if (text.length < 200) score += 0.03;

  // Sentence structure analysis
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
  
  if (avgSentenceLength > 100) score += 0.05;
  if (avgSentenceLength < 30) score -= 0.02;

  // Keep score in reasonable range
  score = Math.max(0.05, Math.min(0.95, score));
  
  const humanScore = Math.round((1 - score) * 100);
  const aiScore = Math.round(score * 100);

  console.log(`🔍 Enhanced AI detection: ${humanScore}% human, ${aiScore}% AI`);
  
  return {
    score,
    humanScore,
    aiScore,
    confidence: calculateConfidence(score),
    service: 'enhanced-mock-detector',
    analysis: {
      likely_ai: score > 0.5,
      confidence_level: score > 0.8 ? 'high' : score > 0.3 ? 'medium' : 'low',
      quality_assessment: getQualityAssessment(score),
      recommendations: getRecommendations(score),
      indicators_found: {
        ai_patterns: aiIndicators.filter(ind => text.match(ind.pattern)).length,
        human_patterns: humanIndicators.filter(ind => text.match(ind.pattern)).length,
        avg_sentence_length: Math.round(avgSentenceLength)
      }
    },
    timestamp: new Date().toISOString()
  };
}