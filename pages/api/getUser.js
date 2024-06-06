
export default function handler (req, res) {
  const { email, fivetranApiKey, fivetranApiSecret} = req.cookies;
  res.status(200).json({ email, fivetranApiKey, fivetranApiSecret });
}
