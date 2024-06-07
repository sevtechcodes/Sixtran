'use client';

import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { apiCall } from '../lib/fivetran';
import ConnectorTable from '../ui/connector-table';


async function getConnectors (group, fivetranApiKey, fivetranApiSecret) {
  const res = await apiCall(`groups/${group.id}/connectors`, fivetranApiKey, fivetranApiSecret);
  return res.body.data.items;
}

export default function Page () {
  const [credentials, setCredentials] = useState({});
  const [groups, setGroups] = useState([]);
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
        let res = await apiCall('groups', fivetranApiKey, fivetranApiSecret);
        const groupsData = res.body.data.items;
        setGroups(groupsData);
        setSelectedGroup(groupsData[0]);
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

  async function pauseConnectors (connectors) {
    try {
      await Promise.all(
        connectors.map((row) =>
          apiCall(`connectors/${row.id}`, credentials.fivetranApiKey, credentials.fivetranApiSecret, 'PATCH', { paused: true })
        )
      );
      const connectorsData = await getConnectors(selectedGroup, credentials.fivetranApiKey, credentials.fivetranApiSecret);
      setConnectors(connectorsData);
    } catch (error) {
      console.error('Error pausing connectors:', error);
    }
  }


  return (
    <>
      <label>Connector Group: </label>
      {groups.length > 0 &&
      <select onChange={handleSelect}>
        {groups.map( (group) => (<option value={group} key={group.id}>{group.name}</option>))}
      </select> }
      <div>
        { connectors.length > 0 && <ConnectorTable data={connectors} onPause={pauseConnectors}/> } 
      </div>
    </>
  );
}
