import React, { useState, useMemo, useCallback, useEffect } from 'react';
import DataTable, { Media } from 'react-data-table-component';
import { formatDuration, formatDistanceToNow, compareAsc } from 'date-fns';
import { CheckCircleIcon, CheckIcon, ClockIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Primitive } from 'react-data-table-component/dist/DataTable/types';

const TIMEFFRAMES:number[]= [1,7,14,30,90,180,365];

// type CustomStyles = {
//   rows: {
//     style: {
//       minHeight: string;
//       fontSize: string;
//       fontWeight: string;
//     }
//   }
//   headCells: {
//     style: {
//       paddingLeft: string;
//       paddingRight: string;
//       fontSize: string;
//       fontWeight: string;
//     },
//   },
//   cells: {
//     style: {
//       paddingLeft: string;
//       paddingRight: string;
//     },
//   },

// }


const customStyles = {
  rows: {
    style: {
      minHeight: '30px',
      fontSize: '16px',
      fontWeight: '500'
    },
  },

  headCells: {
    style: {
      paddingLeft: '1px', // override the cell padding for head cells
      paddingRight: '1px',
      fontSize: '1rem',
      fontWeight: '800'
    },
  },
  cells: {
    style: {
      paddingLeft: '1px', // override the cell padding for data cells
      paddingRight: '1px',
    },
  },
};

interface ConnectorDetailProps {
  schema: any;
  queries: any;
  disable: any;
  enable: any;
}

interface Table {
  name: string;
  enabled: boolean;
  total_rows: number;
  select_queries: number;
  merge_queries: number;
  inserted: number;
  updated: number;
  deleted: number
  mar: number;
}

export default function ConnectorDetail ({ schema, queries, disable, enable}: ConnectorDetailProps): React.ReactElement {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [timeframe, setTimeframe] = useState <number>(30);
  const [selectedRows, setSelectedRows] = useState([]); //TODO
  const [toggledClearRows, setToggleClearRows] = useState<boolean>(false);
  const [data, setData] = useState<any>([]); //TODO what is the data?

  useEffect(() => {
    const data: Table[] = [];

    const now: Date = new Date();
    const timeFrame: Date = new Date(now.setDate(now.getDate() - timeframe));

    for (const table in schema.tables) {

      const filteredQueries = queries.filter(q => q.table_id === table && compareAsc(new Date(q?.creation_time.value), timeFrame ) >= 0);





      const tableData: Table = {
        name: table,
        enabled: schema.tables[table].enabled,
        total_rows: queries.filter(q => q.table_id === table).reduce((_, q) => q.total_rows, 0),

        select_queries: filteredQueries.filter(q => q.statement_type === 'SELECT').length,
        merge_queries: filteredQueries.filter(q => q.statement_type === 'MERGE').length,
        inserted: filteredQueries.reduce((acc, q) => acc + q.inserted_rows, 0),
        updated: filteredQueries.reduce((acc, q) => acc + q.updated_rows, 0),
        deleted: filteredQueries.reduce((acc, q) => acc + q.deleted_rows, 0),
        mar: filteredQueries.reduce((acc, q) => acc + q.inserted_rows + q.updated_rows + q.deleted_rows, 0),
      };
      data.push(tableData);
    }
    setData(data.sort((a, b) => b.mar - a.mar));
  }, [schema, queries, timeframe]);


  interface Row {
    name: string;
    select_queries: number;
    merge_queries: number;
    inserted: number;
    updated: number;
    deleted: number;
    mar: number;
    total_rows: number;
    enabled: boolean;
  }

  const columns = useMemo<{
    name: string;
   // selector: (row: Row) => string | number | React.JSX.Element;
    selector: (row: Row) =>Primitive;
    sortable: boolean;
    minWidth?: string;
    grow?: number;
    hide?: Media | undefined;
      }[]>(() => [
        {
          name: 'Table name',
          selector: (row: Row) => row.name,
          sortable: true,
          minWidth: '250px',
          grow:2
        },
        {
          name: 'SELECT',
          selector: (row: Row) => row.select_queries,
          sortable: true,
        },
        {
          name: 'MERGE',
          selector: (row: Row) => row.merge_queries,
          sortable: true,
          hide: 'md' as Media,//go from Tailwind to CSS ClassName
        },
        // {
        //   name: 'UPDATE',
        //   selector: row => row.update_queries,
        //   sortable: true,
        //   hide: 'md' as Media,
        // },
        // {
        //   name: 'DELETE',
        //   selector: row => row.delete_queries,
        //   sortable: true,
        //   hide: 'md' as Media,
        // },
        {
          name: 'Inserted',
          selector: (row: Row) => row.inserted,
          sortable: true,
          hide: 'md' as Media,
        },
        {
          name: 'Updated',
          selector: (row: Row) => row.updated,
          sortable: true,
          hide: 'md' as Media,
        },
        {
          name: 'Deleted',
          selector: (row: Row) => row.deleted,
          sortable: true,
          hide: 'md' as Media,
        },
        {
          name: 'Active',
          selector: (row: Row) => row.mar,
          sortable: true
        },
        {
          name: 'Total',
          selector: (row: Row) => row.total_rows,
          sortable: true,
          hide: 'md' as Media,
        },
        {
          name: 'Enabled',
          // below: not intended by npm creators to use HTML elements but seems to work.
          // @ts-ignore
          selector: (row: Row) => row.enabled ? <CheckIcon className='inline h-6 mx-2'/> : <XMarkIcon className='inline h-6 mx-2'/>,
          sortable: true
        },

      ], []);

  function handleChange (event: React.ChangeEvent<HTMLSelectElement>) {
    setTimeframe(Number(event.target.value));
  }

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(
      item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const handleRowSelected = useCallback(state => {
    setSelectedRows(state.selectedRows);
  }, []);

  function handleClearRows () {
    setToggleClearRows(!toggledClearRows);
    setSelectedRows([]);
  }

  function disableTables (event:React.MouseEvent<HTMLButtonElement> ) {
    event.preventDefault();
    const tablesToDisable:string[] = selectedRows.map((row:Row) => row.name).reverse();
    disable(tablesToDisable);
    handleClearRows();
  }

  function enableTables (event:React.MouseEvent<HTMLButtonElement> ) {
    event.preventDefault();
    const tablesToEnable:string[] = selectedRows.map((row:Row)=> row.name).reverse();
    enable(tablesToEnable);
    handleClearRows();
  }


  return (
    <>
      <div className="p-4">
        <div className='flex items-center'>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="m-4 border border-black rounded text-xl w-1/10 min-h-1 text-lg p-1"
          />
          <h1 className='font-bold text-lg mr-3 ml-3'>Dataset:</h1><h1 className='bg-[#06AB78] text-white rounded px-2 py-1 text-lg font-bold'>{schema.name_in_destination}</h1>

        </div>
        {data.length > 0 && (
          <div className='border'>
            <DataTable
              columns={columns}
              data={filteredData}
              customStyles={customStyles}
              selectableRows
              onSelectedRowsChange={handleRowSelected}
              clearSelectedRows={toggledClearRows}
              pagination
            />
          </div> )}
      </div>
      <div>
        <button onClick={disableTables}
          className='mx-5 py-1 px-2 text-s rounded-lg bg-black text-white font-bold hover:bg-[#5C5B61]'
          title='Disable selected tables'
        >
          <XCircleIcon className='inline h-6 mx-2'/>
          <span>Disable</span>
        </button>

        <button onClick={enableTables}
          className='mx-5 py-1 px-2 text-s rounded-lg bg-black text-white font-bold hover:bg-[#5C5B61]'
          title='Enable selected tables'
        >
          <CheckCircleIcon className='inline h-6 mx-2'/>
          <span>Enable</span>
        </button>
        <button className='ml-5 py-1 px-2 text-s rounded-lg bg-white text-black font-bold'>
          <ClockIcon className='inline h-6 mx-2'/>
          <span>Select timeframe:</span>
        </button>
        <select onChange={handleChange}
          className='ml-1 py-1.5 px-0 hover:bg-[#5C5B61] hover:text-white bg-black text-white font-bold rounded-lg'
        >
          {TIMEFFRAMES.map((timeframe, index) => {
            if (timeframe === 30) {
              return <option key={index} value={timeframe} selected>{formatDuration({days: timeframe})}</option>;
            } else {
              return <option key={index} value={timeframe} >{formatDuration({days: timeframe})}</option>;
            }})}
        </select>
      </div>
    </>
  );
};
