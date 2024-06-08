'use client';

import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { apiCall, modifyConnectors, resyncConnectors } from '../lib/fivetran';
import ConnectorTable from '../ui/connector-table';
import { getConnectors } from '../lib/fivetran';


export default function Page () {
  const [credentials, setCredentials] = useState({});
  const [groups, setGroups] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [connectors, setConnectors] = useState([]);
  

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
  async function pauseConnectors (connectors) {
    await  modifyConnectors(connectors, credentials.fivetranApiKey, credentials.fivetranApiSecret, { paused: true });
    const connectorsData = await getConnectors(selectedGroup, credentials.fivetranApiKey, credentials.fivetranApiSecret);
    setConnectors(connectorsData);
  }

  async function unpauseConnectors (connectors) {
    await  modifyConnectors(connectors, credentials.fivetranApiKey, credentials.fivetranApiSecret, { paused: false });
    const connectorsData = await getConnectors(selectedGroup, credentials.fivetranApiKey, credentials.fivetranApiSecret);
    setConnectors(connectorsData);
  }

  async function freqConnectors (connectors, freq) {
    await  modifyConnectors(connectors, credentials.fivetranApiKey, credentials.fivetranApiSecret, { sync_frequency: freq });
    const connectorsData = await getConnectors(selectedGroup, credentials.fivetranApiKey, credentials.fivetranApiSecret);
    setConnectors(connectorsData);
  }

  async function HistResyncConnectors (connectors) {
    await  resyncConnectors(connectors, credentials.fivetranApiKey, credentials.fivetranApiSecret);
    const connectorsData = await getConnectors(selectedGroup, credentials.fivetranApiKey, credentials.fivetranApiSecret);
    setConnectors(connectorsData);
  }
  


  return (
    <>
      <label>Select connector group: </label>
      {groups.length > 0 &&
      <select onChange={handleSelect}>
        {groups.map( (group) => (<option value={group} key={group.id}>{group.name}</option>))}
      </select> }
      <div>
        { connectors.length > 0 && <ConnectorTable data={connectors}
          types={types}
          onPause={pauseConnectors}
          onUnpause={unpauseConnectors}
          onFreq={freqConnectors}
          onResync={HistResyncConnectors}
        /> } 
      </div>
    </>
  );
}
