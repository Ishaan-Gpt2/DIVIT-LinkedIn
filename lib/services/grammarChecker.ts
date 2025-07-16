import axios from 'axios';

export async function checkGrammar(text: string) {
  const apiKey = process.env.LANGUAGETOOL_API_KEY;
  
  if (!apiKey) {
    throw new Error('LANGUAGETOOL_API_KEY not configured');
  }

  try {
    const response = await axios.post(
      'https://api.languagetoolplus.com/v2/check',
      new URLSearchParams({
        text: text,
        language: 'en-US'
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

    // Apply corrections in reverse order
    matches.reverse().forEach(match => {
      if (match.replacements && match.replacements.length > 0) {
        const replacement = match.replacements[0].value;
        const start = match.offset;
        const end = match.offset + match.length;
        
        correctedText = correctedText.substring(0, start) + 
                       replacement + 
                       correctedText.substring(end);
        
        corrections.push({
          original: text.substring(start, end),
          correction: replacement,
          message: match.message,
          category: match.rule?.category?.name || 'Grammar'
        });
      }
    });

    return {
      originalText: text,
      correctedText,
      corrections,
      issuesFound: matches.length,
      service: 'languagetool'
    };

  } catch (error) {
    console.error('Grammar check error:', error);
    throw new Error(`Grammar check failed: ${error.message}`);
  }
}