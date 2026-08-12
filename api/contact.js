const { checkOrigin, rateLimit } = require('./_guard');

const TO = process.env.CONTACT_TO || 'Benromdhane.Aziz@esprit.tn';
// Resend accepts onboarding@resend.dev until a custom domain is verified.
const FROM = process.env.CONTACT_FROM || 'Portfolio <onboarding@resend.dev>';

const LIMITS = { name: 100, email: 200, message: 4000 };

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    if (!checkOrigin(req, res)) return;
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!checkOrigin(req, res)) return;
  if (!rateLimit(req, res, { limit: 4, windowMs: 10 * 60_000, key: 'contact' })) return;

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body;
  if (!body) return res.status(400).json({ error: 'Invalid request body' });

  // Hidden field: only bots fill it in. Pretend success so they stop retrying.
  if (typeof body.company === 'string' && body.company.trim()) {
    return res.status(200).json({ ok: true });
  }

  const name = str(body.name, LIMITS.name);
  const email = str(body.email, LIMITS.email);
  const message = str(body.message, LIMITS.message);

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  // No mail provider configured — tell the client to fall back to mailto.
  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ error: 'Mail service not configured.', fallback: 'mailto' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: `Portfolio contact from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        html:
          `<p><strong>Name:</strong> ${esc(name)}<br>` +
          `<strong>Email:</strong> ${esc(email)}</p>` +
          `<p style="white-space:pre-wrap">${esc(message)}</p>`,
      }),
    });

    if (!response.ok) {
      console.error('Resend error', response.status, await response.text());
      return res.status(502).json({ error: 'Could not send the message.', fallback: 'mailto' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact handler error', err);
    return res.status(500).json({ error: 'Could not send the message.', fallback: 'mailto' });
  } finally {
    clearTimeout(timeout);
  }
};

function str(value, max) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function esc(value) {
  return value.replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

function safeParse(raw) {
  try { return JSON.parse(raw); } catch { return null; }
}
