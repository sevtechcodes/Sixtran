import React, { useState, useMemo, useCallback, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { formatDuration, formatDistanceToNow, compareAsc } from 'date-fns';


const customStyles = {
  rows: {
    style: {
      minHeight: '72px',
      fontSize: '16px',
      fontWeight: '500'
    },
  },
  headCells: {
    style: {
      paddingLeft: '8px', // override the cell padding for head cells
      paddingRight: '8px',
      fontSize: '1rem',
      fontWeight: '800'
    },
  },
  cells: {
    style: {
      paddingLeft: '8px', // override the cell padding for data cells
      paddingRight: '8px',
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
        inserted: queries.filter(q => q.table_id === table).reduce((acc, q) => acc + q.inserted_rows, 0),
        updated: queries.filter(q => q.table_id === table).reduce((acc, q) => acc + q.updated_rows, 0),
        deleted: queries.filter(q => q.table_id === table).reduce((acc, q) => acc + q.deleted_rows, 0),
      };
      data.push(tableData);
    }
    setData(data);
  }, [schema, queries]);

  const columns = useMemo(() => [
    {
      name: 'Table',
      selector: row => row.name,
      sortable: true
    },
    {
      name: 'Number of SELECT queries',
      selector: row => row.select_queries,
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
      selector: row => row.inserted + row.updated + row.deleted,
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
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="m-4 border border-black rounded text-xl w-1/4 min-h-1 text-lg p-1"
        />
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
