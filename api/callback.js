export default async function handler(req, res) {
  const CLIENT_ID     = 'b487a4d126584ea7a2cbdd1e5dc8afda';
  const CLIENT_SECRET = 'ea06595d947f4a799aa45813cf7b9ca3';
  const REDIRECT_URI  = 'https://spmc-one.vercel.app/api/callback';

  const code = req.query.code;
  if (!code) { res.status(400).send('Missing code'); return; }

  const params = new URLSearchParams({
    grant_type:   'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
  });

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
    },
    body: params.toString(),
  });

  const data = await response.json();

  if (!data.access_token) {
    res.status(500).send('Token exchange failed: ' + JSON.stringify(data));
    return;
  }

  const redirectTo = `/?access_token=${encodeURIComponent(data.access_token)}`
    + `&refresh_token=${encodeURIComponent(data.refresh_token || '')}`
    + `&expires_in=${encodeURIComponent(data.expires_in || 3600)}`;

  res.redirect(302, redirectTo);
}
