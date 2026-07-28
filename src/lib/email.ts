import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM ?? 'Blog CMS <onboarding@resend.dev>';

export async function sendWelcomeEmail(to: string) {
  if (!resend) {
    console.warn('RESEND_API_KEY not set — skipping welcome email send (dev/placeholder mode).');
    return;
  }

  await resend.emails.send({
    from: FROM,
    to,
    subject: "You're subscribed 🎉",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="color:#1B2333;">Welcome aboard</h1>
        <p style="color:#5C6470;">Thanks for subscribing. You'll get our best new posts straight to your inbox — no spam, unsubscribe anytime.</p>
      </div>
    `,
  });
}

export async function sendCommentNotification(to: string, postTitle: string) {
  if (!resend) return;
  await resend.emails.send({
    from: FROM,
    to,
    subject: `New comment on "${postTitle}"`,
    html: `<p>You have a new comment awaiting moderation on <strong>${postTitle}</strong>.</p>`,
  });
}

export async function sendContactReply(params: {
  to: string;
  recipientName: string;
  originalSubject: string;
  replyMessage: string;
}) {
  if (!resend) {
    console.warn('RESEND_API_KEY not set — cannot send contact reply email (dev/placeholder mode).');
    throw new Error(
      'Email sending is not configured yet. Add a RESEND_API_KEY in .env.local to enable replies.',
    );
  }

  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: `Re: ${params.originalSubject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <p style="color:#1B2333;">Hi ${params.recipientName},</p>
        <p style="color:#2A3142; white-space: pre-wrap;">${params.replyMessage}</p>
        <hr style="border: none; border-top: 1px solid #E3E5EB; margin: 24px 0;" />
        <p style="color:#5C6470; font-size: 13px;">This is a reply to your message: "${params.originalSubject}"</p>
      </div>
    `,
  });
}
