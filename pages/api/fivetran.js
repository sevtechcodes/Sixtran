const URL = 'https://api.fivetran.com/v1/';

export default async function handler (req, res) {
  const { method, endpoint, apiKey, apiSecret } = req.query;

  const headers = new Headers();
  const basicAuth = 'Basic ' + btoa(`${apiKey}:${apiSecret}`);
  headers.append('Authorization', basicAuth);

  try {
    const response = await fetch(`${URL}${endpoint}`, {
      method: method,
      headers: headers,
      body: method === 'GET'? undefined : req.body,
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
