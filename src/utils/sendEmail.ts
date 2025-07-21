// utils/sendEmail.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!); // Make sure your key is in .env

export const sendConfirmationEmail = async (toEmail: string, studentName: string) => {
  const msg = {
    to: toEmail,
    from: 'greenvalleyproject01@gmail.com', // Must match your verified sender
    subject: 'Application Received – Green Valley School',
    html: `
      <p>Dear ${studentName},</p>
      <p>Thank you for submitting your application to Green Valley School. Our admissions team will review your information and reach out soon.</p>
      <p>Best regards,<br/>Green Valley Admissions Team</p>
    `
  };

  await sgMail.send(msg);
};
