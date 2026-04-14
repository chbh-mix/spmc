export default async function handler(req, res) {
  const CLIENT_ID     = 'b487a4d126584ea7a2cbdd1e5dc8afda';
  const CLIENT_SECRET = 'ea06595d947f4a799aa45813cf7b9ca3';

  if (req.method !== 'POST') { res.status(405).send('Method not allowed'); return; }

  const refresh_token = req.body?.refresh_token;
  if (!refresh_token) { res.status(400).json({ error: 'missing refresh_token' }); return; }

  const params = new URLSearchParams({ grant_type: 'refresh_token', refresh_token });

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
    },
    body: params.toString(),
  });

  const data = await response.json();
  res.status(200).json(data);
}
