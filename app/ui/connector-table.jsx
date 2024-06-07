import React, { useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';


export default function ConnectorTable ({ data }) {
  const [searchTerm, setSearchTerm] = useState('');

  const columns = useMemo(() => [
    {
      name: 'ID',
      selector: row => row.id,
      sortable: true
    },
    {
      name: 'Source',
      selector: row => row.service,
      sortable: true
    },
    {
      name: 'Sync Frequency',
      selector: row => row.sync_frequency,
      sortable: true
    },
    {
      name: 'Sync Status',
      selector: row => row.status.sync_state,
      sortable: true
    },
    {
      name: 'Last Sync',
      selector: row => row.succeeded_at,
      sortable: true
    },
  ], []);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(
      item => 
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.service.toLowerCase().includes(searchTerm.toLowerCase())
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
          className="mb-4 p-2 border border-gray-300 rounded"
        />
        <DataTable columns={columns} data={filteredData}/>
      </div>
    </>
  );
};
