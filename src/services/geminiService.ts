import axios from 'axios';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCNInkxSat1peCdml8rEYZVZW-e9ZqOwLo';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiService {
  private static async makeRequest(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000
        }
      );

      const data: GeminiResponse = response.data;
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  static async generateLinkedInPost(topic: string, tone: string = 'professional'): Promise<string> {
    const prompt = `Generate a ${tone} LinkedIn post about: "${topic}"

Requirements:
- 150-300 words
- Professional tone that builds credibility
- Include relevant hashtags (3-5)
- Add a call-to-action
- Make it engaging and shareable
- Avoid AI-sounding phrases
- Include emojis where appropriate

Generate only the post content, no additional commentary.`;

    try {
      const result = await this.makeRequest(prompt);
      return result || this.getFallbackPost(topic, tone);
    } catch (error) {
      console.warn('Using fallback post due to API error:', error);
      return this.getFallbackPost(topic, tone);
    }
  }

  static async generateComment(postContent: string, tone: string = 'professional'): Promise<string> {
    const prompt = `Generate a ${tone} LinkedIn comment for this post: "${postContent.substring(0, 200)}..."

Requirements:
- 20-50 words
- Engaging and thoughtful
- Adds value to the conversation
- Professional but personable
- Include a question or insight

Generate only the comment, no additional text.`;

    try {
      const result = await this.makeRequest(prompt);
      return result || this.getFallbackComment();
    } catch (error) {
      console.warn('Using fallback comment due to API error:', error);
      return this.getFallbackComment();
    }
  }

  static async generateConnectionMessage(name: string, title: string, company: string): Promise<string> {
    const prompt = `Generate a personalized LinkedIn connection request message for:
Name: ${name}
Title: ${title}
Company: ${company}

Requirements:
- 50-100 words
- Professional and personable
- Mention their role or company
- Clear reason for connecting
- Not salesy or pushy

Generate only the message, no additional text.`;

    try {
      const result = await this.makeRequest(prompt);
      return result || this.getFallbackConnectionMessage(name, company);
    } catch (error) {
      console.warn('Using fallback connection message due to API error:', error);
      return this.getFallbackConnectionMessage(name, company);
    }
  }

  static async chatResponse(userMessage: string): Promise<string> {
    const prompt = `You are a helpful AI assistant for DIVIT.AI, a LinkedIn automation platform. 
User message: "${userMessage}"

Respond as a knowledgeable support agent who can help with:
- LinkedIn automation features
- Post generation and scheduling
- Connection building strategies
- Platform pricing and plans
- Technical support

Keep responses helpful, professional, and under 150 words.`;

    try {
      const result = await this.makeRequest(prompt);
      return result || this.getFallbackChatResponse(userMessage);
    } catch (error) {
      console.warn('Using fallback chat response due to API error:', error);
      return this.getFallbackChatResponse(userMessage);
    }
  }

  // Fallback methods for when API is unavailable
  private static getFallbackPost(topic: string, tone: string): string {
    const posts = [
      `🚀 Excited to share insights on ${topic}! 

In today's fast-paced business environment, understanding this concept is crucial for success. Here are my key takeaways:

✅ Innovation drives growth
✅ Collaboration builds stronger teams  
✅ Continuous learning is essential

What's your experience with ${topic}? I'd love to hear your thoughts in the comments!

#Leadership #Innovation #BusinessGrowth #ProfessionalDevelopment #LinkedIn`,

      `💡 Let's talk about ${topic} - a game-changer in our industry!

After years of experience, I've learned that success comes from:

🎯 Clear vision and strategy
🤝 Building meaningful relationships
📈 Data-driven decision making
🔄 Adapting to change quickly

The future belongs to those who embrace these principles. What strategies have worked best for you?

#Strategy #Growth #Leadership #Innovation #Success`,

      `🌟 Reflecting on ${topic} and its impact on our professional journey.

Key insights I've gathered:
• Authenticity builds trust
• Consistency creates momentum  
• Value-first approach wins long-term
• Community over competition

How has ${topic} influenced your career? Share your story below! 👇

#ProfessionalGrowth #CareerDevelopment #Networking #Success #LinkedIn`
    ];

    return posts[Math.floor(Math.random() * posts.length)];
  }

  private static getFallbackComment(): string {
    const comments = [
      "Great insights! This really resonates with my experience. Thanks for sharing your perspective.",
      "Absolutely agree with your points here. Have you considered the impact on team dynamics as well?",
      "This is exactly what I needed to read today. Your approach to this challenge is inspiring.",
      "Fantastic post! I'd love to hear more about your implementation strategy.",
      "Really valuable content. This aligns perfectly with what we're seeing in our industry."
    ];

    return comments[Math.floor(Math.random() * comments.length)];
  }

  private static getFallbackConnectionMessage(name: string, company: string): string {
    return `Hi ${name.split(' ')[0]}, I came across your profile and was impressed by your work at ${company}. I'd love to connect and share insights about our industry. Looking forward to building a meaningful professional relationship!`;
  }

  private static getFallbackChatResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('pricing') || lowerMessage.includes('cost') || lowerMessage.includes('plan')) {
      return "We offer flexible pricing plans starting with a free tier (5 credits/month), Creator plan ($29/month), Ghostwriter plan ($79/month), and Agency plan ($199/month). Each plan includes different features and credit allowances to match your automation needs.";
    } else if (lowerMessage.includes('feature') || lowerMessage.includes('what') || lowerMessage.includes('how')) {
      return "DIVIT.AI offers comprehensive LinkedIn automation including AI post generation, clone builder for personalized content, auto-commenting on relevant posts, connection engine for prospect discovery, and detailed analytics. Which feature would you like to learn more about?";
    } else {
      return "Thanks for reaching out! I'm here to help with any questions about DIVIT.AI's LinkedIn automation features, pricing, or getting started. What specific aspect would you like to know more about?";
    }
  }
}

export default GeminiService;