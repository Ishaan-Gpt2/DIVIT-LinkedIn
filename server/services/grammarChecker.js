import axios from 'axios';

/**
 * Check and correct grammar using LanguageTool with enhanced processing
 * @param {string} text - Text to check
 * @returns {Object} Grammar check result
 */
export async function checkGrammar(text) {
  const apiKey = process.env.LANGUAGETOOL_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ LANGUAGETOOL_API_KEY not configured, using enhanced mock grammar check');
    return getEnhancedMockGrammarCheck(text);
  }

  try {
    console.log('✏️ Sending text to LanguageTool for grammar checking...');
    
    const response = await axios.post(
      'https://api.languagetoolplus.com/v2/check',
      new URLSearchParams({
        text: text,
        language: 'en-US',
        enabledOnly: 'false',
        level: 'picky'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 30000
      }
    );

    const matches = response.data?.matches || [];
    let correctedText = text;
    const corrections = [];

    console.log(`✏️ Found ${matches.length} potential grammar issues`);

    // Apply corrections in reverse order to maintain positions
    matches.reverse().forEach(match => {
      if (match.replacements && match.replacements.length > 0) {
        const replacement = match.replacements[0].value;
        const start = match.offset;
        const end = match.offset + match.length;
        const original = text.substring(start, end);
        
        // Only apply if replacement is different and reasonable
        if (replacement !== original && replacement.length < original.length * 3) {
          correctedText = correctedText.substring(0, start) + 
                         replacement + 
                         correctedText.substring(end);
          
          corrections.push({
            original: original,
            correction: replacement,
            message: match.message,
            category: match.rule?.category?.name || 'Grammar',
            ruleId: match.rule?.id || 'unknown',
            confidence: match.rule?.confidence || 0
          });
        }
      }
    });

    console.log(`✅ Applied ${corrections.length} grammar corrections`);

    return {
      originalText: text,
      correctedText,
      corrections,
      issuesFound: matches.length,
      correctionsApplied: corrections.length,
      service: 'languagetool',
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ LanguageTool error:', error.message);
    
    // Enhanced fallback grammar check
    console.log('✏️ Using enhanced mock grammar check');
    return getEnhancedMockGrammarCheck(text);
  }
}

/**
 * Enhanced mock grammar check with comprehensive corrections
 */
function getEnhancedMockGrammarCheck(text) {
  let correctedText = text;
  const corrections = [];

  // Comprehensive grammar and style corrections
  const grammarRules = [
    // Capitalization fixes
    {
      pattern: /\bi\b/g,
      replacement: 'I',
      message: 'Capitalize the pronoun "I"',
      category: 'Capitalization'
    },
    {
      pattern: /\bim\b/g,
      replacement: "I'm",
      message: 'Correct contraction for "I am"',
      category: 'Contractions'
    },
    
    // Common grammar mistakes
    {
      pattern: /\bits\s+/g,
      replacement: "it's ",
      message: 'Use contraction "it\'s" for "it is"',
      category: 'Contractions'
    },
    {
      pattern: /\byour\s+(going|coming|doing|being)/g,
      replacement: "you're $1",
      message: 'Use "you\'re" (you are) instead of "your"',
      category: 'Grammar'
    },
    {
      pattern: /\bthere\s+(going|coming|doing|being)/g,
      replacement: "they're $1",
      message: 'Use "they\'re" (they are) instead of "there"',
      category: 'Grammar'
    },
    
    // Punctuation fixes
    {
      pattern: /\s+([,.!?;:])/g,
      replacement: '$1',
      message: 'Remove space before punctuation',
      category: 'Punctuation'
    },
    {
      pattern: /([.!?])\s*([a-z])/g,
      replacement: '$1 $2',
      message: 'Add space after sentence-ending punctuation',
      category: 'Punctuation'
    },
    
    // Double spaces
    {
      pattern: /\s{2,}/g,
      replacement: ' ',
      message: 'Remove extra spaces',
      category: 'Spacing'
    },
    
    // Common word confusions
    {
      pattern: /\beffect\b/g,
      replacement: 'affect',
      message: 'Consider using "affect" (verb) instead of "effect" (noun)',
      category: 'Word Choice'
    },
    {
      pattern: /\bthen\b(?=\s+[a-z]+ing)/g,
      replacement: 'than',
      message: 'Use "than" for comparisons',
      category: 'Word Choice'
    },
    
    // Style improvements
    {
      pattern: /\bvery\s+good\b/g,
      replacement: 'excellent',
      message: 'Use more specific adjectives',
      category: 'Style'
    },
    {
      pattern: /\bvery\s+bad\b/g,
      replacement: 'terrible',
      message: 'Use more specific adjectives',
      category: 'Style'
    },
    {
      pattern: /\ba lot of\b/g,
      replacement: 'many',
      message: 'Use "many" instead of "a lot of"',
      category: 'Style'
    }
  ];

  // Apply grammar rules and track corrections
  grammarRules.forEach(rule => {
    const matches = [...correctedText.matchAll(rule.pattern)];
    
    matches.forEach(match => {
      if (match[0] !== rule.replacement) {
        corrections.push({
          original: match[0],
          correction: rule.replacement,
          message: rule.message,
          category: rule.category,
          position: match.index
        });
      }
    });
    
    correctedText = correctedText.replace(rule.pattern, rule.replacement);
  });

  // Additional LinkedIn-specific improvements
  correctedText = improveLinkedInStyle(correctedText);

  console.log(`✏️ Applied ${corrections.length} mock grammar corrections`);
  
  return {
    originalText: text,
    correctedText,
    corrections,
    issuesFound: corrections.length,
    correctionsApplied: corrections.length,
    service: 'enhanced-mock-grammar-checker',
    timestamp: new Date().toISOString()
  };
}

/**
 * Apply LinkedIn-specific style improvements
 */
function improveLinkedInStyle(text) {
  let improved = text;

  // Improve readability for LinkedIn
  const linkedInImprovements = [
    // Break up long sentences
    {
      pattern: /([.!?])\s+([A-Z][^.!?]{50,}[.!?])/g,
      replacement: '$1\n\n$2'
    },
    
    // Add emphasis to key points
    {
      pattern: /\b(key|important|crucial|essential)\s+([a-z]+)/g,
      replacement: '$1 $2'
    },
    
    // Improve list formatting
    {
      pattern: /(\d+\.)\s+/g,
      replacement: '$1 '
    }
  ];

  linkedInImprovements.forEach(improvement => {
    improved = improved.replace(improvement.pattern, improvement.replacement);
  });

  return improved.trim();
}