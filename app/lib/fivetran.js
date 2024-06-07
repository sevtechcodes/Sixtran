
export function apiCall (endpoint, apiKey, apiSecret, method='GET', payload={}) {
  return fetch(`/api/fivetran?method=${method}&endpoint=${endpoint}&apiKey=${apiKey}&apiSecret=${apiSecret}`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json'}
    }
  )
    .then(r =>  r.json().then(data => ({status: r.status, body: data})))
    .catch(e => console.error(e));
}

export async function getConnectors (group, fivetranApiKey, fivetranApiSecret) {
  const res = await apiCall(`groups/${group.id}/connectors`, fivetranApiKey, fivetranApiSecret);
  return res.body.data.items;
}

export async function modifyConnectors (connectors, fivetranApiKey, fivetranApiSecret, payload) {
  try {
    await Promise.all(
      connectors.map((connector) =>
        apiCall(`connectors/${connector.id}`, fivetranApiKey, fivetranApiSecret, 'PATCH', payload)
      )
    );
  } catch (error) {
    console.error('Error modifying connectors:', error);
  }
}

export async function resyncConnectors (connectors, fivetranApiKey, fivetranApiSecret) {
  try {
    await Promise.all(
      connectors.map((connector) =>
        apiCall(`connectors/${connector.id}/resync`, fivetranApiKey, fivetranApiSecret, 'POST')
      )
    );
  } catch (error) {
    console.error('Error resyncing connectors:', error);
  }
}
