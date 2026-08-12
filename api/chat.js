const { SYSTEM_PROMPT } = require('./_persona');
const { checkOrigin, rateLimit } = require('./_guard');

const MODEL = 'google/gemini-2.0-flash-001';
const MAX_TURNS = 20;        // last 10 exchanges
const MAX_CHARS = 1000;      // per message

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
  if (!rateLimit(req, res, { limit: 12, windowMs: 60_000, key: 'chat' })) return;

  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({ error: 'Chat is not configured.' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body;
  const incoming = body && body.messages;

  if (!Array.isArray(incoming) || incoming.length === 0) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  // The system prompt lives on the server. Anything the client sends with a
  // role other than user/assistant is dropped so it cannot be overridden.
  const history = incoming
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .slice(-MAX_TURNS)
    .map(m => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (history.length === 0) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': req.headers.origin || 'https://benromdhaneaziz-github-io.vercel.app',
        'X-Title': 'Aziz Portfolio Chatbot',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      // Never echo the upstream body — it can leak account details.
      // The status alone is safe and makes misconfiguration diagnosable.
      console.error('OpenRouter error', response.status, await response.text());
      return res.status(502).json({
        error: 'Assistant is unavailable right now.',
        upstream: response.status,
      });
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({ error: 'Assistant returned an empty response.' });
    }

    return res.status(200).json({ reply });
  } catch (err) {
    const aborted = err.name === 'AbortError';
    console.error('Chat handler error', err);
    return res
      .status(aborted ? 504 : 500)
      .json({ error: aborted ? 'Assistant timed out.' : 'Internal server error' });
  } finally {
    clearTimeout(timeout);
  }
};

function safeParse(raw) {
  try { return JSON.parse(raw); } catch { return null; }
}
