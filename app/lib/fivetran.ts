interface ApiCallInterface {
  status: number;
  body: any;
}

export async function apiCall(
  endpoint: string,
  apiKey: any,
  apiSecret: any,
  method: string,
  payload?: {}
): Promise<ApiCallInterface> {
  try {
    const response = await fetch(
      `/api/fivetran?method=${method}&endpoint=${endpoint}&apiKey=${apiKey}&apiSecret=${apiSecret}`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const apiResponse = await response.json();
    return { status: response.status, body: apiResponse };
  } catch (error) {
    console.error('API call error', error);
    throw new Error('Cannot calculate the square root of a negative number.');
  }
}

export async function getSchema(
  connector_id: string,
  fivetranApiKey: string,
  fivetranApiSecret: string
): Promise<any> {
  const res = await apiCall(
    `connectors/${connector_id}/schemas`,
    fivetranApiKey,
    fivetranApiSecret
  );
  if (res.body) {
    return res.body.data;
  }
}

export async function getConnectors(group, fivetranApiKey, fivetranApiSecret) {
  const res = await apiCall(
    `groups/${group.id}/connectors`,
    fivetranApiKey,
    fivetranApiSecret,
    'GET'
  );
  return res.body.data.items;
}

export async function modifyConnectors(
  connectors,
  fivetranApiKey,
  fivetranApiSecret,
  payload
) {
  try {
    await Promise.all(
      connectors.map((connector) =>
        apiCall(
          `connectors/${connector.id}`,
          fivetranApiKey,
          fivetranApiSecret,
          'PATCH',
          payload
        )
      )
    );
  } catch (error) {
    console.error('Error modifying connectors:', error);
  }
}

export async function resyncConnectors(
  connectors,
  fivetranApiKey,
  fivetranApiSecret
) {
  try {
    await Promise.all(
      connectors.map((connector) =>
        apiCall(
          `connectors/${connector.id}/resync`,
          fivetranApiKey,
          fivetranApiSecret,
          'POST'
        )
      )
    );
  } catch (error) {
    console.error('Error resyncing connectors:', error);
  }
}

export async function syncConnectors(
  connectors,
  fivetranApiKey,
  fivetranApiSecret
) {
  try {
    await Promise.all(
      connectors.map((connector) =>
        apiCall(
          `connectors/${connector.id}/sync`,
          fivetranApiKey,
          fivetranApiSecret,
          'POST',
          { force: true }
        )
      )
    );
  } catch (error) {
    console.error('Error syncing connectors:', error);
  }
}

export async function modifyTable(
  connector_id,
  schema,
  table,
  payload,
  fivetranApiKey,
  fivetranApiSecret
) {
  try {
    await apiCall(
      `connectors/${connector_id}/schemas/${schema}/tables/${table}`,
      fivetranApiKey,
      fivetranApiSecret,
      'PATCH',
      payload
    );
  } catch (error) {
    console.error('Error modifying tables:', error);
  }
}
