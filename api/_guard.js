/**
 * Shared request guards for the serverless endpoints.
 *
 * Note: the rate limiter is in-memory, so it is per warm lambda instance.
 * It stops casual abuse (a script hammering the endpoint), not a distributed
 * attack. Swap the Map for Upstash/Redis if this ever needs to be strict.
 */

const DEFAULT_ORIGINS = [
  'https://benromdhaneaziz-github-io.vercel.app',
  'https://benromdhaneaziz.github.io',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
];

function allowedOrigins() {
  const extra = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  return [...DEFAULT_ORIGINS, ...extra];
}

/**
 * Same-origin browser requests from the deployed site send no Origin header on
 * some navigations, so a missing Origin is allowed; a foreign one is not.
 */
function checkOrigin(req, res) {
  const origin = req.headers.origin;
  if (!origin) return true;

  const list = allowedOrigins();
  const ok = list.includes(origin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/.test(origin);

  if (!ok) {
    res.status(403).json({ error: 'Forbidden origin' });
    return false;
  }
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  return true;
}

const buckets = new Map();

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd.length) return fwd.split(',')[0].trim();
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
}

/**
 * Fixed-window limiter: `limit` requests per `windowMs` per IP.
 * Returns true when the request may proceed.
 */
function rateLimit(req, res, { limit = 15, windowMs = 60_000, key = 'default' } = {}) {
  const now = Date.now();
  const id = `${key}:${clientIp(req)}`;
  const bucket = buckets.get(id);

  if (!bucket || now > bucket.reset) {
    buckets.set(id, { count: 1, reset: now + windowMs });
  } else if (bucket.count >= limit) {
    const retry = Math.ceil((bucket.reset - now) / 1000);
    res.setHeader('Retry-After', String(retry));
    res.status(429).json({ error: `Too many requests. Try again in ${retry}s.` });
    return false;
  } else {
    bucket.count += 1;
  }

  // Keep the map from growing without bound on a long-lived instance.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (now > v.reset) buckets.delete(k);
  }
  return true;
}

module.exports = { checkOrigin, rateLimit, clientIp };
