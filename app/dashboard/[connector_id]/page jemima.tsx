// 'use client';

// import { getCookie } from 'cookies-next';
// import { useEffect, useState, useMemo } from 'react';
// import { getSchema, modifyTable } from '@/app/lib/fivetran';
// import { callBigQuery } from '@/app/lib/bigquery';
// import ConnectorDetail from '@/app/ui/connector-detail-table';

// interface PageProps {
//   params: {
//     connector_id: string;
//   };
// }

// interface Credentials {
//   fivetranApiKey: string;
//   fivetranApiSecret: string;
// }

// interface TableSchema {
//   [key: string]: any; 
// }

// interface SchemaResponse {
//   schemas: {
//     [key: string]: TableSchema;
//   };
// }


// const Page = ({ params }: PageProps) => {
//   const id: string = params.connector_id;
//   const [credentials, setCredentials] = useState<Credentials>({ fivetranApiKey: '', fivetranApiSecret: '' });
//   const [schema, setSchema] = useState<TableSchema[]>([]);
//   const [queries, setQueries] = useState<any[]>([]); 
//   const [loaded, setLoaded] = useState<boolean>(false);


//   useEffect(() => {
//     const {fivetranApiKey, fivetranApiSecret} = JSON.parse(getCookie('user')|| '{}');
//     setCredentials({fivetranApiKey, fivetranApiSecret});

//     async function getInitialData () {
//       if (!fivetranApiKey || !fivetranApiSecret) {
//         return;
//       }
//       try {
//         // get schema
//         let res = await getSchema(id, fivetranApiKey, fivetranApiSecret);
//         const schema = res;
//         const name = Object.keys(schema.schemas)[0];
//         setSchema(schema.schemas[name]);
//         // get queries for the dataset
//         res = await callBigQuery(name);
//         setQueries(JSON.parse(res.body));
//         // get size of each table in dataset
//         setLoaded(true);

//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     }
//     getInitialData();
//   }, [id]);

//   async function disableTables (tablesToModify: string[]) {
//     for (const table of tablesToModify) {
//       try {
//         await modifyTable(id, schema.name_in_destination, table, { enabled: false }, credentials.fivetranApiKey, credentials.fivetranApiSecret);
//         const updatedSchema = {...schema};
//         updatedSchema.tables[table].enabled = false;
//         setSchema(updatedSchema);
//       } catch (error) {
//         console.error('Error disabling table:', error);
//       }
//     }
//   }

//   async function enableTables (tablesToModify: string[]) {
//     for (const table of tablesToModify) {
//       try {
//         await modifyTable(id, schema.name_in_destination, table, { enabled: true }, credentials.fivetranApiKey, credentials.fivetranApiSecret);
//         const updatedSchema = {...schema};
//         updatedSchema.tables[table].enabled = true;
//         setSchema(updatedSchema);
//       } catch (error) {
//         console.error('Error disabling table:', error);
//       }
//     }
//   }
  
//   return (
//     <>
//       <div className='flex flex-col m-10'>
//         <ConnectorDetail schema={schema} queries={queries} disable={disableTables} enable={enableTables}/>
//       </div>
//     </>
//   );
// }
