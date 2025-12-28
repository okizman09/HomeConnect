const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Send email notification (Chat)
exports.sendEmailNotification = async (toEmail, senderName) => {
  try {
    await resend.emails.send({
      from: 'HomeConnect <onboarding@resend.dev>', // Use verified domain in prod, e.g. 'noreply@homeconnect.com'
      to: toEmail,
      subject: 'New Message on HomeConnect',
      html: `
        <h2>New Message Notification</h2>
        <p>You have received a new message from <strong>${senderName}</strong>.</p>
        <p>Log in to your HomeConnect dashboard to view and reply to the message.</p>
        <a href="${process.env.FRONTEND_URL}/dashboard" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">View Message</a>
      `
    });
    console.log('Email sent successfully via Resend');
  } catch (error) {
    console.error('Resend Email error:', error);
  }
};

// Send generic email
exports.sendEmail = async (options) => {
  try {
    const data = await resend.emails.send({
      from: 'HomeConnect <onboarding@resend.dev>',
      to: options.email,
      subject: options.subject,
      html: options.message,
      text: options.text || options.message.replace(/<[^>]*>?/gm, '') // Fallback to stripped HTML
    });
    console.log('Email sent via Resend:', data);
  } catch (error) {
    console.error('Resend Email error:', error);
    throw new Error(error.message);
  }
};
