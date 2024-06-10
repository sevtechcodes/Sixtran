'use client';

import { getCookie } from 'cookies-next';
import { useEffect, useState, useMemo } from 'react';
import { getSchema } from '@/app/lib/fivetran';
import { callBigQuery } from '@/app/lib/bigquery';
import ConnectorDetail from '@/app/ui/connector-detail-table';


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
  }, [id]);

  return (
    <>
      <div className='flex flex-col m-10'>
        <ConnectorDetail schema={schema} queries={queries} />
      </div>
    </>
  );
}
