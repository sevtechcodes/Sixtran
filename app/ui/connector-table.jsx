import React, { useState, useMemo, useCallback, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { formatDuration, formatDistanceToNow, compareAsc } from 'date-fns';
import { PauseIcon, PlayIcon, BackwardIcon, AdjustmentsHorizontalIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { roundMinutes } from '../lib/utils';
import Link from 'next/link';

const SYNC_FREQS = [5, 15, 30, 60, 120, 180, 360, 480, 720, 1440];

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

export default function ConnectorTable ({ data, types, onPause, onUnpause, onFreq, onResync, onSync}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState(SYNC_FREQS[0]);

  const columns = useMemo(() => [
    {
      name: 'Connector ID',
      selector: row => <Link href={`dashboard/${row.id}`}
        className='hover:underline hover:font-bold hover:bg-[#5C5B61]'
      >{row.id}</Link>,
      sortable: true,
      sortFunction: (a, b) => b.id.localeCompare(a.id)
    },
    {
      name: 'Source',
      selector: row => {
        return (
          <>
            {/* TODO: change this to use Image */}
            <img className='max-h-5 inline mx-3' src={types.filter((type) => type.id === row.service)[0].icons[0]}></img>
            <span>{types.filter((type) => type.id === row.service)[0].name}</span>
          </>
        );
      },
      sortable: true,
      sortFunction: (a, b) => b.service.localeCompare(a.service)
    },
    {
      name: 'Sync Frequency',
      selector: row => formatDuration(roundMinutes(row.sync_frequency)),
      sortable: true,
      sortFunction: (a, b) => a.sync_frequency - b.sync_frequency
    },
    {
      name: 'Sync Status',
      selector: row => {
        switch (row.status.sync_state) {
        case 'paused':
          return (<div className='px-3 py-2 rounded-2xl bg-gray-200 text-gray-700'>Paused</div>);
        case 'scheduled':
          return (<div className='px-3 py-2 rounded-2xl bg-rose-50 text-rose-700'>Scheduled</div>);
        case 'syncing':
          return (<div className='px-3 py-2 rounded-2xl bg-green-200 text-green-700'>Syncing</div>);
        default:
          return (<div></div>);
        }
      },
      sortable: true,
      sortFunction: (a, b) => a.status.sync_state.localeCompare(b.status.sync_state)
    },
    {
      name: 'Last Sync',
      selector: row => row.succeeded_at ? formatDistanceToNow(new Date(row.succeeded_at)) : 'Never',
      sortable: true,
      sortFunction: (a, b) => {
        if (!a.succeeded_at) return -1;
        if (!b.succeeded_at) return 1;
        return compareAsc(new Date(a.succeeded_at), new Date(b.succeeded_at));
      }
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

  const handleRowSelected = useCallback(state => {
    setSelectedRows(state.selectedRows);
  }, []);

  function handleClearRows () {
    setToggleClearRows(!toggledClearRows);
    setSelectedRows([]);
  }

  async function pauseConnectors () {
    await onPause(selectedRows);
    handleClearRows();
  }

  async function unpauseConnectors () {
    await onUnpause(selectedRows);
    handleClearRows();
  }

  async function freqConnectors (event) {
    event.preventDefault();
    onFreq(selectedRows, selectedFrequency);
    handleClearRows();
  }

  async function resyncConnectors () {
    onResync(selectedRows);
    handleClearRows();
  }

  async function syncConnectors () {
    onSync(selectedRows);
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
          className="m-4 border border-black rounded text-xl w-1/4 min-h-1 text-lg p-1"
        />
        <div className='border'>
          <DataTable
            columns={columns}
            data={filteredData}
            selectableRows
            onSelectedRowsChange={handleRowSelected}
            clearSelectedRows={toggledClearRows}
            customStyles={customStyles}
          />
        </div>
      </div>
      <div className='flex justify-around mt-20'>
        <button onClick={pauseConnectors}
          className='py-1 px-4 text-s rounded-lg bg-black text-white font-bold hover:bg-[#5C5B61]'
        >
          <PauseIcon className='inline h-6 mx-2'/><span>Pause</span>
        </button>
        <button onClick={unpauseConnectors}
          className='py-1 px-4 text-s rounded-lg bg-black text-white font-bold hover:bg-[#5C5B61]'
        >
          <PlayIcon className='inline h-6 mx-2'/><span>Unpause</span>
        </button>
        <button onClick={syncConnectors}
          className='py-1 px-4 text-s rounded-lg bg-black text-white font-bold hover:bg-[#5C5B61]'
        >
          <ArrowPathIcon className='inline h-6 mx-2'/><span>Sync</span>
        </button>

        <button onClick={resyncConnectors}
          className='py-1 px-4 text-s rounded-lg bg-black text-white font-bold hover:bg-[#5C5B61]'
        >
          <BackwardIcon className='inline h-6 mx-2'/><span>Historical Sync</span>
        </button>
        <form onSubmit={freqConnectors}>
          <button type='submit'
            className='py-1 px-4 text-s rounded-lg bg-black text-white font-bold hover:bg-[#5C5B61]'
          >
            <AdjustmentsHorizontalIcon className='inline h-6 mx-2'/><span>Sync frequency:</span>
          </button>
          <select value={selectedFrequency} onChange={e => setSelectedFrequency(e.target.value)}
            className='text-xl'
          >
            {SYNC_FREQS.map(freq => <option key={freq} value={freq}>{formatDuration(roundMinutes(freq))}</option>)}
          </select>
        </form>
      </div>
    </>
  );
};
