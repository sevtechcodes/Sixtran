export function callBigQuery (dataset_id) {
  return fetch(`/api/bigquery?dataset_id=${dataset_id}`,
    {
      method: 'GET',
    }
  )
    .then(r =>  r.json().then(data => ({status: r.status, body: data})))
    .catch(e => console.error(e));
}
