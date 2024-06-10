import React, { useState, useMemo, useCallback, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { formatDuration, formatDistanceToNow, compareAsc } from 'date-fns';


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

export default function ConnectorDetail ({ schema, queries}) {
  const [searchTerm, setSearchTerm] = useState('');

  const [data, setData] = useState([]);

  useEffect(() => {
    const data = [];
    for (const table in schema.tables) {
      const tableData = {
        name: table,
        select_queries: queries.filter(q => q.table_id === table && q.statement_type === 'SELECT').length,
        merge_queries: queries.filter(q => q.table_id === table && q.statement_type === 'MERGE').length,
        update_queries: queries.filter(q => q.table_id === table && q.statement_type === 'UPDATE').length,
        delete_queries: queries.filter(q => q.table_id === table && q.statement_type === 'DELETE').length,
        inserted: queries.filter(q => q.table_id === table).reduce((acc, q) => acc + q.inserted_rows, 0),
        updated: queries.filter(q => q.table_id === table).reduce((acc, q) => acc + q.updated_rows, 0),
        deleted: queries.filter(q => q.table_id === table).reduce((acc, q) => acc + q.deleted_rows, 0),
        mar: queries.filter(q => q.table_id === table).reduce((acc, q) => acc + q.inserted_rows + q.updated_rows + q.deleted_rows, 0)
      };
      data.push(tableData);
    }
    setData(data.sort((a, b) => b.mar - a.mar));
  }, [schema, queries]);

  const columns = useMemo(() => [
    {
      name: 'Table name',
      selector: row => row.name,
      sortable: true,
      minWidth: '250px'
    },
    {
      name: 'SELECT',
      selector: row => row.select_queries,
      sortable: true
    },
    {
      name: 'MERGE',
      selector: row => row.merge_queries,
      sortable: true
    },
    {
      name: 'UPDATE',
      selector: row => row.update_queries,
      sortable: true
    },
    {
      name: 'DELETE',
      selector: row => row.delete_queries,
      sortable: true
    },
    {
      name: 'Inserted rows',
      selector: row => row.inserted,
      sortable: true
    },
    {
      name: 'Updated rows',
      selector: row => row.updated,
      sortable: true
    },
    {
      name: 'Deleted rows',
      selector: row => row.deleted,
      sortable: true
    },
    {
      name: 'Estimated MAR',
      selector: row => row.mar,
      sortable: true
    },

  ], []);



  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(
      item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);


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
            />
          </div> )}
      </div>
    </>
  );
};
