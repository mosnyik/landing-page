export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const KIT_FORM_ID = process.env.KIT_FORM_ID;
  const KIT_API_KEY = process.env.KIT_API_KEY;

  const response = await fetch(
    `https://api.kit.com/v4/forms/${KIT_FORM_ID}/subscribers`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': KIT_API_KEY,
      },
      body: JSON.stringify({ email_address: email }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    return res.status(response.status).json({ error });
  }

  return res.status(200).json({ success: true });
}
