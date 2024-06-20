'use client';
import { getCookie } from 'cookies-next';
import { useEffect, useState, useMemo } from 'react';
import { getSchema, modifyTable } from '../../lib/fivetran';
import { callBigQuery } from '../../lib/bigquery';
import ConnectorDetail from '../../ui/connector-detail-table';
type Credential = {
  fivetranApiKey: string;
  fivetranApiSecret: string;
};
export type FiveTranMetaData = {
  enabled: boolean;
  name_in_destination: string;
  schemas: any;
  tables: any;
};
interface PagaProps {
  params: any;
}
export default function Page({ params }: PagaProps) {
  const id = params.connector_id;
  const [credentials, setCredentials] = useState<Credential | null>(null);
  const [schema, setSchema] = useState<FiveTranMetaData | null>(null);
  const [queries, setQueries] = useState([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  useEffect(() => {
    console.log('from use effect');
    const { fivetranApiKey, fivetranApiSecret } = JSON.parse(
      getCookie('user') as string
    );
    setCredentials({ fivetranApiKey, fivetranApiSecret });
    async function getInitialData() {
      if (!fivetranApiKey || !fivetranApiSecret) {
        return;
      }
      try {
        // get schema
        let res = await getSchema(id, fivetranApiKey, fivetranApiSecret);
        const schema = res;
        const name: string = Object.keys(schema.schemas)[0];
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
  async function disableTables(tablesToModify) {
    for (const table of tablesToModify) {
      try {
        if (credentials === null || schema === null) {
          throw console.error();
        }
        await modifyTable(
          id,
          schema.name_in_destination,
          table,
          { enabled: false },
          credentials.fivetranApiKey,
          credentials.fivetranApiSecret
        );
        const updatedSchema = { ...schema };
        updatedSchema.tables[table].enabled = false;
        setSchema(updatedSchema);
      } catch (error) {
        console.error('Error disabling table:', error);
      }
    }
  }
  async function enableTables(tablesToModify) {
    for (const table of tablesToModify) {
      try {
        if (credentials === null || schema === null) {
          throw console.error();
        }
        await modifyTable(
          id,
          schema.name_in_destination,
          table,
          { enabled: true },
          credentials.fivetranApiKey,
          credentials.fivetranApiSecret
        );
        const updatedSchema = { ...schema };
        updatedSchema.tables[table].enabled = true;
        setSchema(updatedSchema);
      } catch (error) {
        console.error('Error disabling table:', error);
      }
    }
  }
  return schema === null ? (
    console.error('failed to fetch Fivetran Metadata')
  ) : (
    <>
      <div className='flex flex-col m-10'>
        <ConnectorDetail
          schema={schema}
          queries={queries}
          disable={disableTables}
          enable={enableTables}
        />
      </div>
    </>
  );
}
