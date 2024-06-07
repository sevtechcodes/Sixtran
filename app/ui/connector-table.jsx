import React, { useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';

const SYNC_FREQS = [5, 15, 30, 60, 120, 180, 360, 480, 720, 1440];

export default function ConnectorTable ({ data, onPause, onSync, onFreq}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState(false);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState(SYNC_FREQS[0]);

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

  function handleChange ({selectedRows}) {
    setSelectedRows(selectedRows);
  }

  function handleClearRows () {
    setToggleClearRows(!toggledClearRows);
  }

  async function pauseConnectors () {
    await onPause(selectedRows);
    handleClearRows();
  }

  async function syncConnectors () {
    await onSync(selectedRows);
    handleClearRows();
  }

  async function freqConnectors (event) {
    event.preventDefault();
    onFreq(selectedRows, selectedFrequency);
    handleClearRows();
  }

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
        <DataTable
          columns={columns}
          data={filteredData}
          selectableRows
          onSelectedRowsChange={handleChange}
          clearSelectedRows={toggledClearRows}
        />
      </div>
      <div className='flex justify-around'>
        <button onClick={pauseConnectors}>Pause</button>
        <button onClick={syncConnectors}>Sync</button>
        <button>Hsitorical Sync</button>
        <form onSubmit={freqConnectors}>
          <button type='submit'>Change sync frequency: </button>
          <select value={selectedFrequency} onChange={e => setSelectedFrequency(e.target.value)}>
            {SYNC_FREQS.map(freq => <option key={freq} value={freq}>{freq + ' min'}</option>)}
          </select>
        </form>
      </div>
    </>
  );
};
