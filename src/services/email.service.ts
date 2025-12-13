export const emailService = {
  sendAccountDeletionEmail: async (userEmail: string) => {
    try {
      const resendApiKey = 're_WfK7Ktnq_7JbRzxQk3GJT2zSf2DqQE4Pb';

      const emailContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #FF5252; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
              .content { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
              .footer { text-align: center; color: #999; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Account Deletion Request</h2>
              </div>
              <div class="content">
                <p><strong>User Email:</strong> ${userEmail}</p>
                <p><strong>Request Time:</strong> ${new Date().toISOString()}</p>
                <p><strong>Status:</strong> Pending Review</p>
                <hr>
                <p>A user has requested account deletion. Please review and process this request according to your data retention policies.</p>
                <p>The deletion should be completed within 48 hours.</p>
              </div>
              <div class="footer">
                <p>This is an automated email from Shoppy</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: 'shoppy.dot.plus@gmail.com',
          subject: `Account Deletion Request - ${userEmail}`,
          html: emailContent,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to send email: ${response.status}`);
      }

      const data = await response.json();
      console.log('Email sent successfully:', data);
      return data;
    } catch (error: any) {
      console.error('Email service error:', error);
      throw error;
    }
  },
};
