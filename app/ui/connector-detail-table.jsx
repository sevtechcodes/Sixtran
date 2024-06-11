import React, { useState, useMemo, useCallback, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { formatDuration, formatDistanceToNow, compareAsc } from 'date-fns';
import { CheckCircleIcon, CheckIcon, ClockIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const TIMEFFRAMES = [1,7,14,30,90,180,365];

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

export default function ConnectorDetail ({ schema, queries, disable, enable}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeframe, setTimeframe] = useState(30);
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const data = [];
    const now = new Date();
    const timeFrame = new Date(now.setDate(now.getDate() - timeframe));

    for (const table in schema.tables) {

      const filteredQueries = queries.filter(q => q.table_id === table && compareAsc(new Date(q?.creation_time.value), timeFrame ) >= 0);

      const tableData = {
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

  const columns = useMemo(() => [
    {
      name: 'Table name',
      selector: row => row.name,
      sortable: true,
      minWidth: '250px',
      grow:2
    },
    {
      name: 'SELECT',
      selector: row => row.select_queries,
      sortable: true,
    },
    {
      name: 'MERGE',
      selector: row => row.merge_queries,
      sortable: true,
      hide: 'md',
    },
    // {
    //   name: 'UPDATE',
    //   selector: row => row.update_queries,
    //   sortable: true,
    //   hide: 'md',
    // },
    // {
    //   name: 'DELETE',
    //   selector: row => row.delete_queries,
    //   sortable: true,
    //   hide: 'md',
    // },
    {
      name: 'Inserted',
      selector: row => row.inserted,
      sortable: true,
      hide: 'md',
    },
    {
      name: 'Updated',
      selector: row => row.updated,
      sortable: true,
      hide: 'md',
    },
    {
      name: 'Deleted',
      selector: row => row.deleted,
      sortable: true,
      hide: 'md',
    },
    {
      name: 'Active',
      selector: row => row.mar,
      sortable: true
    },
    {
      name: 'Total',
      selector: row => row.total_rows,
      sortable: true,
      hide: 'md',
    },
    {
      name: 'Enabled',
      selector: row => row.enabled ? <CheckIcon className='inline h-6 mx-2'/> : <XMarkIcon className='inline h-6 mx-2'/>,
      sortable: true
    },

  ], []);

  function handleChange (event) {
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

  function disableTables (event) {
    event.preventDefault();
    const tablesToDisable = selectedRows.map(row => row.name).reverse();
    disable(tablesToDisable);
    handleClearRows();
  }

  function enableTables (event) {
    event.preventDefault();
    const tablesToEnable = selectedRows.map(row => row.name).reverse();
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
          <h1 className='font-bold text-lg mr-3 ml-3'>Dataset:</h1><h1 className='bg-[#06AB78] text-white rounded p-1 text-lg font-bold'>{schema.name_in_destination}</h1>
          
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
