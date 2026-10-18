// Serves the static site from ./dist and handles POST /api/waitlist.
//
// The form works without JavaScript (a normal POST, answered with a redirect back to
// /?joined=1#waitlist); the page's script sends `Accept: application/json` and gets
// { ok, message } instead. Every valid address gets the same answer whether or not it
// was already on the list, so the endpoint can't be used to test who signed up.

const SUCCESS = "You're on the list. We'll send one email when Basalt 1.0 ships.";
const EMAIL = /^[^\s@]{1,64}@[^\s@.]+(\.[^\s@.]+)+$/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/waitlist') {
      if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
      }
      return join(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};

async function join(request, env) {
  const json = (request.headers.get('accept') || '').includes('application/json');
  const reply = (status, message) =>
    json
      ? Response.json({ ok: status < 400, message }, { status })
      : Response.redirect(new URL(`/?joined=${status < 400 ? 1 : 0}#waitlist`, request.url), 303);

  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return reply(403, 'Sign up from the Basalt site.');
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return reply(400, 'Something was wrong with that request.');
  }
  // Honeypot: people never see this field; bots fill it in. Pretend it worked.
  if (form.get('website')) return reply(200, SUCCESS);

  const email = String(form.get('email') || '').trim().toLowerCase();
  if (email.length > 254 || !EMAIL.test(email)) {
    return reply(400, "That doesn't look like an email address.");
  }

  if (env.WAITLIST_LIMIT) {
    const key = request.headers.get('cf-connecting-ip') || 'unknown';
    const { success } = await env.WAITLIST_LIMIT.limit({ key });
    if (!success) return reply(429, 'Too many tries. Wait a minute and try again.');
  }

  try {
    await env.DB.prepare('INSERT OR IGNORE INTO waitlist (email, created_at) VALUES (?1, ?2)')
      .bind(email, new Date().toISOString())
      .run();
  } catch (err) {
    console.error('waitlist insert failed', err);
    return reply(500, 'Something went wrong on our side. Try again later.');
  }
  return reply(200, SUCCESS);
}
