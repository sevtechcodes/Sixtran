'use client';

import { getCookie } from 'cookies-next';
import { useEffect, useState, useMemo } from 'react';
import { apiCall, modifyConnectors, resyncConnectors, syncConnectors } from '../lib/fivetran';
import ConnectorTable from '../ui/connector-table';
import { getConnectors } from '../lib/fivetran';


export default function Page () {
  const [credentials, setCredentials] = useState({});
  const [groups, setGroups] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [connectors, setConnectors] = useState([]);
  const [pending, setPending] = useState(true);
  

  useEffect(() => {
    const {fivetranApiKey, fivetranApiSecret} = JSON.parse(getCookie('user'));
    setCredentials({fivetranApiKey, fivetranApiSecret});

    async function getInitialData () {
      if (!fivetranApiKey || !fivetranApiSecret) {
        return;
      }
      try {
        // get types
        let res = await apiCall('metadata/connector-types?limit=1000', fivetranApiKey, fivetranApiSecret);
        const typesData = res.body.data.items;
        setTypes(typesData);
        // get groups
        res = await apiCall('groups', fivetranApiKey, fivetranApiSecret);
        const groupsData = res.body.data.items;
        setGroups(groupsData);
        setSelectedGroup(groupsData[0]);
        // get connectors
        const connectorsData = await getConnectors(groupsData[0], fivetranApiKey, fivetranApiSecret);
        setConnectors(connectorsData);
        setPending(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    getInitialData();
  }, []);


  async function handleSelect (event) {
    event.preventDefault();
    selectedGroup(event.target.value);
    setConnectors(connectorsData);
  }

  // TODO: refactor these functions:
  async function pauseConnectors (connectorsToModify) {
    await  modifyConnectors(connectorsToModify, credentials.fivetranApiKey, credentials.fivetranApiSecret, { paused: true });
    const updatedConnectors = connectors.map(connector => {
      if (connectorsToModify.find(c => c.id === connector.id)) {
        return { ...connector, status: { ...connector.status, sync_state: 'paused' } };
      }
      return connector;
    });
    setConnectors(updatedConnectors);
  }

  async function unpauseConnectors (connectorsToModify) {
    await  modifyConnectors(connectorsToModify, credentials.fivetranApiKey, credentials.fivetranApiSecret, { paused: false });
    const updatedConnectors = connectors.map(connector => {
      if (connectorsToModify.find(c => c.id === connector.id)) {
        return { ...connector, status: { ...connector.status, sync_state: 'scheduled' } };
      }
      return connector;
    });
    setConnectors(updatedConnectors);
  }

  async function freqConnectors (connectorsToModify, freq) {
    await  modifyConnectors(connectorsToModify, credentials.fivetranApiKey, credentials.fivetranApiSecret, { sync_frequency: freq });
    const updatedConnectors = connectors.map(connector => {
      if (connectorsToModify.find(c => c.id === connector.id)) {
        return { ...connector, sync_frequency: freq };
      }
      return connector;
    });
    setConnectors(updatedConnectors);
  }

  async function HistResyncConnectors (connectorsToResync) {
    await  resyncConnectors(connectorsToResync, credentials.fivetranApiKey, credentials.fivetranApiSecret);
    const updatedConnectors = connectors.map(connector => {
      if (connectorsToResync.find(c => c.id === connector.id)) {
        return { ...connector, status: { ...connector.status, sync_state: 'syncing' } };
      }
      return connector;
    });
    setConnectors(updatedConnectors);
  }

  async function NormalSyncConnectors (connectorsToSync) {
    await syncConnectors(connectorsToSync, credentials.fivetranApiKey, credentials.fivetranApiSecret);
    const updatedConnectors = connectors.map(connector => {
      if (connectorsToSync.find(c => c.id === connector.id)) {
        return { ...connector, status: { ...connector.status, sync_state: 'syncing' } };
      }
      return connector;
    });
    setConnectors(updatedConnectors);
  }


  return (
    <>
      <div className='m-10 font-bold text-lg'>
        <label>Select your connector group: </label>
        {!pending &&
        <select onChange={handleSelect} className='bg-[#06AB78] text-white rounded p-1'>
          {groups.map( (group) => (<option value={group} key={group.id}>{group.name}</option>))}
        </select> }
      </div>
      <div>
        { !pending && <ConnectorTable data={connectors}
          types={types}
          onPause={pauseConnectors}
          onUnpause={unpauseConnectors}
          onFreq={freqConnectors}
          onResync={HistResyncConnectors}
          onSync={NormalSyncConnectors}
        /> } 
      </div>
    </>
  );
}
