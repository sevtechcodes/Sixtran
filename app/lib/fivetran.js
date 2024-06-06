
export function apiCall (endpoint, apiKey, apiSecret, method='GET') {
  return fetch(`/api/fivetran?method=${method}&endpoint=${endpoint}&apiKey=${apiKey}&apiSecret=${apiSecret}`)
    .then(r =>  r.json().then(data => ({status: r.status, body: data})))
    .catch(e => console.log(e));
}