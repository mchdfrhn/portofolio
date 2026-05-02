import { Resend } from 'resend';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  }
});
const asCleanString = (value) => typeof value === "string" ? value.trim() : "";
const escapeHtml = (value) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const buildEmailHtml = ({
  name,
  email,
  message
}) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\n/g, "<br />");
  const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: Portfolio inquiry from ${name}`)}`;
  return `
    <!doctype html>
    <html>
      <body style="margin:0; padding:0; background:#f8fafc; font-family:Inter,Segoe UI,Arial,sans-serif; color:#111827;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f8fafc; padding:32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="width:100%; max-width:640px; overflow:hidden; border-radius:18px; background:#ffffff; border:1px solid #e5e7eb; box-shadow:0 18px 45px rgba(15,23,42,0.08);">
                <tr>
                  <td style="padding:28px 32px; background:#070c16;">
                    <div style="display:inline-block; padding:6px 10px; border-radius:999px; background:rgba(56,189,248,0.14); color:#7dd3fc; font-size:12px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;">
                      Portfolio Contact
                    </div>
                    <h1 style="margin:16px 0 0; color:#ffffff; font-size:26px; line-height:1.25; font-weight:800;">
                      New project inquiry
                    </h1>
                    <p style="margin:8px 0 0; color:#cbd5e1; font-size:15px; line-height:1.6;">
                      Someone reached out through your portfolio contact form.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:28px 32px 8px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding:0 0 14px;">
                          <div style="font-size:12px; color:#64748b; font-weight:700; letter-spacing:0.06em; text-transform:uppercase;">Name</div>
                          <div style="margin-top:6px; font-size:17px; color:#0f172a; font-weight:700;">${safeName}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:0 0 20px;">
                          <div style="font-size:12px; color:#64748b; font-weight:700; letter-spacing:0.06em; text-transform:uppercase;">Email</div>
                          <a href="mailto:${safeEmail}" style="display:inline-block; margin-top:6px; color:#0284c7; font-size:16px; font-weight:700; text-decoration:none;">${safeEmail}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 32px 28px;">
                    <div style="font-size:12px; color:#64748b; font-weight:700; letter-spacing:0.06em; text-transform:uppercase; margin-bottom:10px;">Message</div>
                    <div style="border:1px solid #e2e8f0; border-left:4px solid #38bdf8; border-radius:14px; background:#f8fafc; padding:18px 20px; color:#1f2937; font-size:15px; line-height:1.75;">
                      ${safeMessage}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 32px 32px;">
                    <a href="${mailto}" style="display:inline-block; padding:13px 18px; border-radius:10px; background:#0284c7; color:#ffffff; font-size:14px; font-weight:800; text-decoration:none;">
                      Reply to ${safeName}
                    </a>
                  </td>
                </tr>

                <tr>
                  <td style="padding:18px 32px; background:#f1f5f9; border-top:1px solid #e2e8f0; color:#64748b; font-size:12px; line-height:1.6;">
                    This email was sent automatically from your portfolio contact form.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};
const POST = async ({ request }) => {
  const contentType = request.headers.get("content-type") ?? "";
  let payload;
  try {
    if (contentType.includes("application/json")) {
      payload = await request.json();
    } else {
      const formData = await request.formData();
      payload = Object.fromEntries(formData.entries());
    }
  } catch {
    return json({ message: "Invalid request payload." }, 400);
  }
  const name = asCleanString(payload.name);
  const email = asCleanString(payload.email);
  const message = asCleanString(payload.message);
  const website = asCleanString(payload.website);
  if (website) {
    return json({ message: "Message accepted." });
  }
  if (name.length < 2 || name.length > 80) {
    return json({ message: "Please enter a valid name." }, 400);
  }
  if (!isEmail(email) || email.length > 120) {
    return json({ message: "Please enter a valid email address." }, 400);
  }
  if (message.length < 10 || message.length > 3e3) {
    return json({ message: "Please enter a message between 10 and 3000 characters." }, 400);
  }
  const apiKey = "re_cRxgM13H_HDpn2VE3SBYY1QhYY8wgacdc";
  const toEmail = "mochamadfarhanali@gmail.com";
  const fromEmail = "Portfolio <hello@mochamadfarhanali.my.id>";
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [toEmail],
    replyTo: email,
    subject: `Portfolio contact from ${name}`,
    text: `Name: ${name}
Email: ${email}

${message}`,
    html: buildEmailHtml({ name, email, message })
  });
  if (error) {
    console.error("Resend contact email failed:", error);
    return json({ message: "Unable to send your message right now." }, 502);
  }
  return json({ message: "Message sent successfully." });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
