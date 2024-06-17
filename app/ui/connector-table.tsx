import React, { useState, useMemo, useCallback, useEffect } from 'react';
import DataTable, { Media } from 'react-data-table-component';
import { formatDuration, formatDistanceToNow, compareAsc } from 'date-fns';
import {
  PauseIcon,
  PlayIcon,
  BackwardIcon,
  AdjustmentsHorizontalIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { roundMinutes } from '../lib/utils';
import Link from 'next/link';
import { Primitive } from 'react-data-table-component/dist/DataTable/types';

const SYNC_FREQS = [5, 15, 30, 60, 120, 180, 360, 480, 720, 1440];

const customStyles = {
  rows: {
    style: {
      minHeight: '72px',
      fontSize: '16px',
      fontWeight: '500',
    },
  },
  headCells: {
    style: {
      paddingLeft: '8px', // override the cell padding for head cells
      paddingRight: '8px',
      fontSize: '1rem',
      fontWeight: '800',
    },
  },
  cells: {
    style: {
      paddingLeft: '8px', // override the cell padding for data cells
      paddingRight: '8px',
    },
  },
};

// interface LabeledValue {
//   label: string;
// }

// function printLabel(labeledObj: LabeledValue) {
//   console.log(labeledObj.label);
// }

// let myObj = { size: 10, label: "Size 10 Object" };
// printLabel(myObj);

export interface Connector {
  id: string;
  service: string;
  sync_frequency: number;
  status: {
    sync_state: string;
  };
  succeeded_at?: Date;
}

// interface Connector {
//   id: string;
//   status: {
//     sync_state: string;
//   };
//   sync_frequency?: number;
// }

interface Props {
  data: Connector[];
  types: any[];
  onPause: (rows: Connector[]) => Promise<void>;
  onUnpause: (rows: Connector[]) => Promise<void>;
  onFreq: (rows: Connector[], frequency: number) => void;
  onResync: (rows: Connector[]) => void;
  onSync: (rows: Connector[]) => void;
}

const ConnectorTable = ({
  data,
  types,
  onPause,
  onUnpause,
  onFreq,
  onResync,
  onSync,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState(SYNC_FREQS[0]);

  const columns = useMemo<
    {
      name: string;
      // selector: (row: Row) => string | number | React.JSX.Element;
      selector: (row: Connector) => Primitive;
      sortable: boolean;
      sortFunction?: any;
      grow?: number;
      hide?: Media | undefined;
    }[]
  >(
    () => [
      {
        name: 'Connector ID',
        // below: not intended by npm creators to use HTML elements but seems to work.
        // @ts-ignore
        selector: (row: Connector) => (
          <Link
            href={`dashboard/${row.id}`}
            passHref
            className='hover:underline hover:font-bold'>
            {row.id}
          </Link>
        ),
        sortable: true,
        sortFunction: (a: Connector, b: Connector) => b.id.localeCompare(a.id),
      },
      {
        name: 'Source',
        // below: not intended by npm creators to use HTML elements but seems to work.
        // @ts-ignore
        selector: (row: Connector) => (
          <>
            {/* TODO: change this to use Image */}
            <img
              className='max-h-5 inline mx-1'
              src={types.filter((type) => type.id === row.service)[0].icons[0]}
              alt={row.service}
            ></img>
            <span>
              {types.filter((type) => type.id === row.service)[0].name}
            </span>
          </>
        ),
        sortable: true,
        sortFunction: (a: Connector, b: Connector) =>
          b.service.localeCompare(a.service),
      },
      {
        name: 'Sync Frequency',
        selector: (row: Connector) =>
          formatDuration(roundMinutes(row.sync_frequency)),
        sortable: true,
        sortFunction: (a: Connector, b: Connector) =>
          a.sync_frequency - b.sync_frequency,
        hide: 'md' as Media,
      },
      {
        name: 'Sync Status',
        // below: not intended by npm creators to use HTML elements but seems to work.
        // @ts-ignore
        selector: (row: Connector) => {
          switch (row.status.sync_state) {
            case 'paused':
              return (
                <div className='px-3 py-2 rounded-2xl bg-gray-200 text-gray-700'>
                  Paused
                </div>
              );
            case 'scheduled':
              return (
                <div className='px-3 py-2 rounded-2xl bg-rose-50 text-rose-700'>
                  Scheduled
                </div>
              );
            case 'syncing':
              return (
                <div className='px-3 py-2 rounded-2xl bg-green-200 text-green-700'>
                  Syncing
                </div>
              );
            default:
              return <div></div>;
          }
        },
        sortable: true,
        sortFunction: (a: Connector, b: Connector) =>
          a.status.sync_state.localeCompare(b.status.sync_state),
        hide: 'md' as Media,
      },
      {
        name: 'Last Sync',
        selector: (row: Connector) =>
          row.succeeded_at
            ? formatDistanceToNow(new Date(row.succeeded_at))
            : 'Never',
        sortable: true,
        sortFunction: (a: Connector, b: Connector) => {
          if (!a.succeeded_at) return -1;
          if (!b.succeeded_at) return 1;
          return compareAsc(new Date(a.succeeded_at), new Date(b.succeeded_at));
        },
      },
    ],
    []
  );

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(
      (item) =>
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.service.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  function handleClearRows() {
    setToggleClearRows(!toggledClearRows);
    setSelectedRows([]);
  }

  async function pauseConnectors() {
    await onPause(selectedRows);
    handleClearRows();
  }

  async function unpauseConnectors() {
    await onUnpause(selectedRows);
    handleClearRows();
  }

  async function freqConnectors(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onFreq(selectedRows, selectedFrequency);
    handleClearRows();
  }

  async function resyncConnectors() {
    onResync(selectedRows);
    handleClearRows();
  }

  async function syncConnectors() {
    onSync(selectedRows);
    handleClearRows();
  }
  console.log('COL', columns);
  console.log('DATA', filteredData);
  console.log('TOGCLEAR', toggledClearRows);
  console.log('CS', customStyles);

  return (
    <>
      <div className='p-4'>
        <input
          type='text'
          placeholder='Search...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='my-4 border border-black rounded text-xl w-1/4 min-h-1 text-lg p-1'
        />
        <div className='border'>
          <DataTable
            columns={columns}
            data={filteredData}
            selectableRows
            onSelectedRowsChange={handleRowSelected}
            clearSelectedRows={toggledClearRows}
            customStyles={customStyles}
            pagination
          />
        </div>
      </div>
      <div className='flex justify-center mt-5'>
        <button
          onClick={pauseConnectors}
          className='mx-5 py-1 px-1 text-s rounded-lg bg-black text-white font-bold hover:bg-[#5C5B61]'
          title='Pause selected connectors'
        >
          <PauseIcon className='inline h-6 mx-2' />
        </button>
        <button
          onClick={unpauseConnectors}
          className='mx-5 py-1 px-1 text-s rounded-lg bg-black text-white font-bold hover:bg-[#5C5B61]'
          title='Unpause selected connectors'
        >
          <PlayIcon className='inline h-6 mx-2' />
        </button>
        <button
          onClick={syncConnectors}
          className='mx-5 py-1 px-1 text-s rounded-lg bg-black text-white font-bold hover:bg-[#5C5B61]'
          title='Sync selected connectors'
        >
          <ArrowPathIcon className='inline h-6 mx-2' />
        </button>

        <button
          onClick={resyncConnectors}
          className='mx-5 py-1 px-1 text-s rounded-lg bg-black text-white font-bold hover:bg-[#5C5B61]'
          title='Resync selected connectors'
        >
          <BackwardIcon className='inline h-6 mx-2' />
        </button>
        <form onSubmit={freqConnectors}>
          <button
            type='submit'
            className='mx-5 py-1 px-1 text-s rounded-lg bg-black text-white font-bold hover:bg-[#5C5B61]'
            title='Change sync frequency for selected connectors'
          >
            <AdjustmentsHorizontalIcon className='inline h-6 mx-2' />
          </button>
          <select
            value={selectedFrequency}
            onChange={(e) => setSelectedFrequency(parseInt(e.target.value))}
            className='text-s'
          >
            {SYNC_FREQS.map((freq) => (
              <option key={freq} value={freq}>
                {formatDuration(roundMinutes(freq))}
              </option>
            ))}
          </select>
        </form>
      </div>
    </>
  );
};

export default ConnectorTable;
