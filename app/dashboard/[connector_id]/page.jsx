'use client';

import { getCookie } from 'cookies-next';
import { useEffect, useState, useMemo } from 'react';
import { getSchema } from '@/app/lib/fivetran';
import { callBigQuery } from '@/app/lib/bigquery';


export default function Page ({ params }) {
  const id = params.connector_id;
  const [credentials, setCredentials] = useState({});
  const [schema, setSchema] = useState([]);
  const [queries, setQueries] = useState([]);
  const [loaded, setLoaded] = useState(false);

  

  useEffect(() => {
    const {fivetranApiKey, fivetranApiSecret} = JSON.parse(getCookie('user'));
    setCredentials({fivetranApiKey, fivetranApiSecret});

    async function getInitialData () {
      if (!fivetranApiKey || !fivetranApiSecret) {
        return;
      }
      try {
        // get schema
        let res = await getSchema(id, fivetranApiKey, fivetranApiSecret);
        const schema = res;
        const name = Object.keys(schema.schemas)[0];
        setSchema(schema.schemas[name]);
        // get queries for the dataset
        res = await callBigQuery(name);
        setQueries(JSON.parse(res.body));
        // get size of each table in dataset
        setLoaded(true);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getInitialData();
  }, []);

  return (
    <>
      <h1>Connector ID: {id}</h1>
      <h2>Schema</h2>
      <pre>{JSON.stringify(schema, null, 2)}</pre>
      <h2>Queries</h2>
      <pre>{JSON.stringify(queries, null, 2)}</pre>

    </>
  );
}
