import axios from 'axios';

export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured');
  }

  try {
    const response = await axios.post(
      'https://api.resend.com/emails',
      {
        from: 'Chaitra AI <noreply@chaitra.ai>',
        to: Array.isArray(to) ? to : [to],
        subject,
        html
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    return {
      success: true,
      messageId: response.data?.id,
      to: Array.isArray(to) ? to : [to],
      subject,
      service: 'resend'
    };

  } catch (error) {
    console.error('Email send error:', error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
}