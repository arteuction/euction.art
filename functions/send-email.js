/**
 * Email Notification Service using SendGrid
 * Handles all email notifications for the platform
 */

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const { to, subject, html, template, data } = JSON.parse(event.body);

    if (!to || !subject) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: to, subject' }),
      }
    }

    // Check for SendGrid API key
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SendGrid API key not configured');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Email service not configured' }),
      }
    }

    // Prepare email content
    let emailHtml = html;

    // If template is specified, use predefined template
    if (template) {
      emailHtml = getEmailTemplate(template, data);
    }

    // Send email via SendGrid API
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }],
          subject: subject
        }],
        from: {
          email: process.env.FROM_EMAIL || 'noreply@arteuction.com',
          name: 'ART EUction'
        },
        content: [{
          type: 'text/html',
          value: emailHtml
        }]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('SendGrid error:', error);
      throw new Error('Failed to send email');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Email sent successfully' }),
    }

  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send email' }),
    }
  }
}

// Email template generator
function getEmailTemplate(templateName, data) {
  const baseStyle = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
      .content { background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
      .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
    </style>
  `;

  const templates = {
    welcome: `
      ${baseStyle}
      <div class="container">
        <div class="header">
          <h1>🎨 Welcome to ART EUction!</h1>
        </div>
        <div class="content">
          <p>Hello ${data.name},</p>
          <p>Thank you for joining ART EUction, where art meets social impact!</p>
          <p>Your account has been successfully created. You can now browse artworks, place bids, and support causes aligned with the UN Sustainable Development Goals.</p>
          <a href="${data.dashboardUrl || 'https://arteuction.com/dashboard'}" class="button">Go to Dashboard</a>
          <p>If you have any questions, feel free to reach out to our support team.</p>
          <p>Best regards,<br>The ART EUction Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ART EUction. All rights reserved.</p>
        </div>
      </div>
    `,

    artist_approved: `
      ${baseStyle}
      <div class="container">
        <div class="header">
          <h1>🎉 Your Artist Application is Approved!</h1>
        </div>
        <div class="content">
          <p>Hello ${data.name},</p>
          <p>Great news! Your artist application has been approved by our curation team.</p>
          <p>You can now submit your artworks for auction on our platform.</p>
          <a href="${data.submitUrl || 'https://arteuction.com/artwork-submission.html'}" class="button">Submit Artwork</a>
          <p>We're excited to showcase your work and support your chosen causes!</p>
          <p>Best regards,<br>The ART EUction Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ART EUction. All rights reserved.</p>
        </div>
      </div>
    `,

    artist_rejected: `
      ${baseStyle}
      <div class="container">
        <div class="header">
          <h1>Artist Application Update</h1>
        </div>
        <div class="content">
          <p>Hello ${data.name},</p>
          <p>Thank you for your interest in becoming an artist on ART EUction.</p>
          <p>After careful review, we're unable to approve your application at this time. This decision is based on our current curation criteria and platform needs.</p>
          <p>We encourage you to continue developing your work and consider reapplying in the future.</p>
          <p>Thank you for your understanding.</p>
          <p>Best regards,<br>The ART EUction Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ART EUction. All rights reserved.</p>
        </div>
      </div>
    `,

    artwork_approved: `
      ${baseStyle}
      <div class="container">
        <div class="header">
          <h1>✅ Your Artwork is Approved!</h1>
        </div>
        <div class="content">
          <p>Hello ${data.artistName},</p>
          <p>Excellent news! Your artwork "<strong>${data.artworkTitle}</strong>" has been approved for auction.</p>
          <p>Our team will schedule it for an upcoming auction and notify you of the details.</p>
          <p>Expected auction date: ${data.auctionDate || 'To be determined'}</p>
          <a href="${data.dashboardUrl || 'https://arteuction.com/artist-dashboard.html'}" class="button">View Dashboard</a>
          <p>Thank you for contributing to positive social impact through art!</p>
          <p>Best regards,<br>The ART EUction Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ART EUction. All rights reserved.</p>
        </div>
      </div>
    `,

    auction_reminder_24h: `
      ${baseStyle}
      <div class="container">
        <div class="header">
          <h1>⏰ Auction Ending in 24 Hours!</h1>
        </div>
        <div class="content">
          <p>Hello ${data.name},</p>
          <p>The auction for "<strong>${data.artworkTitle}</strong>" is ending in 24 hours!</p>
          <p><strong>Current Bid:</strong> $${data.currentBid}</p>
          <p><strong>Ends:</strong> ${data.endTime}</p>
          <p>Don't miss your chance to own this incredible piece while supporting ${data.ngoName}.</p>
          <a href="${data.auctionUrl}" class="button">Place Your Bid</a>
          <p>Best regards,<br>The ART EUction Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ART EUction. All rights reserved.</p>
        </div>
      </div>
    `,

    outbid_notification: `
      ${baseStyle}
      <div class="container">
        <div class="header">
          <h1>😮 You've Been Outbid!</h1>
        </div>
        <div class="content">
          <p>Hello ${data.name},</p>
          <p>Someone has placed a higher bid on "<strong>${data.artworkTitle}</strong>".</p>
          <p><strong>Your Bid:</strong> $${data.yourBid}</p>
          <p><strong>Current Highest Bid:</strong> $${data.currentBid}</p>
          <p><strong>Auction Ends:</strong> ${data.endTime}</p>
          <p>Place a higher bid to stay in the running!</p>
          <a href="${data.auctionUrl}" class="button">Increase Your Bid</a>
          <p>Best regards,<br>The ART EUction Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ART EUction. All rights reserved.</p>
        </div>
      </div>
    `,

    winning_bid: `
      ${baseStyle}
      <div class="container">
        <div class="header">
          <h1>🎉 Congratulations! You Won!</h1>
        </div>
        <div class="content">
          <p>Hello ${data.name},</p>
          <p>Congratulations! You've won the auction for "<strong>${data.artworkTitle}</strong>"!</p>
          <p><strong>Winning Bid:</strong> $${data.winningBid}</p>
          <p>Your contribution of ${data.ngoAmount} will go directly to ${data.ngoName} to support their work on ${data.sdgGoal}.</p>
          <p>We'll contact you shortly with payment and delivery instructions.</p>
          <a href="${data.paymentUrl}" class="button">Complete Payment</a>
          <p>Thank you for making a difference through art!</p>
          <p>Best regards,<br>The ART EUction Team</p>
        </div>
        <div class="footer">
          <p>© ${new Date().getFullYear()} ART EUction. All rights reserved.</p>
        </div>
      </div>
    `
  };

  return templates[templateName] || templates.welcome;
}
