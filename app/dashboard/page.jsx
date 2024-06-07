'use client';

import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import { apiCall } from '../lib/fivetran';
import ConnectorTable from '../ui/connector-table';

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
        
        res = await apiCall(`groups/${groupsData[0].id}/connectors`, fivetranApiKey, fivetranApiSecret);
        const connectorsData = res.body.data.items;
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
    res = await apiCall(`groups/${selectedGroup.id}/connectors`, credentials.fivetranApiKey, credentials.fivetranApiSecret);
    const connectorsData = res.body.data.items;
    setConnectors(connectorsData);
  }


  return (
    <>
      <label>Connector Group: </label>
      {groups.length > 0 &&
      <select onChange={handleSelect}>
        {groups.map( (group) => (<option value={group} key={group.id}>{group.name}</option>))}
      </select> }
      <div>
        { connectors.length > 0 && <ConnectorTable data={connectors} /> } 
      </div>
    </>
  );
}
