
export function apiCall (endpoint, apiKey, apiSecret, method='GET', payload={}) {
  return fetch(`/api/fivetran?method=${method}&endpoint=${endpoint}&apiKey=${apiKey}&apiSecret=${apiSecret}`,
    {
      method: 'POST',
      body: JSON.stringify(payload)
    }
  )
    .then(r =>  r.json().then(data => ({status: r.status, body: data})))
    .catch(e => console.error(e));
}
