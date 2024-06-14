export function callBigQuery (dataset_id : string): Promise< {status: number; body: any} >  {
  return fetch(`/api/bigquery?dataset_id=${dataset_id}`,
    {
      method: 'GET',
    }
  )
    .then(response =>  response.json().then(data => ({status: response.status, body: data})))
    .catch(e => {
      console.error(e); 
      throw new Error('error');
    });
}

