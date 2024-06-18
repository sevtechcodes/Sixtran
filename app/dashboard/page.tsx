'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import { getCookie } from 'cookies-next';
import {
  apiCall,
  modifyConnectors,
  resyncConnectors,
  syncConnectors,
} from '../lib/fivetran';
import { Connector } from '../ui/connector-table';
import ConnectorTable from '../ui/connector-table';
import { getConnectors } from '../lib/fivetran';
import Hello from '../ui/hello';

type Credential = {
  fivetranApiKey: string;
  fivetranApiSecret: string;
};

type Group = {
  id: string;
  name: string;
  created_at: string;
};

// interface Connector {
//   id: string;
//   status: {
//     sync_state: string;
//   };
//   sync_frequency?: number;
// }

type Type = {
  id: string;
  name: string;
  created_at: string;
};

type ApiResponse<T> = {
  status: number;
  body?: {
    data: {
      items: T;
    };
  };
};

export default function Page(): React.ReactElement {
  const [credentials, setCredentials] = useState<Credential | null>(null); //Added null checks to handle cases where cookies might not be present or credentials might be null
  const [groups, setGroups] = useState<Group[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [pending, setPending] = useState<boolean>(true);

  console.log('selectedGroup GLOBAL', selectedGroup);
  useEffect(() => {
    const userCookie = getCookie('user');

    if (userCookie && typeof userCookie === 'string') {
      try {
        const { fivetranApiKey, fivetranApiSecret } = JSON.parse(userCookie);
        setCredentials({ fivetranApiKey, fivetranApiSecret });

        const getInitialData = async () => {
          if (!fivetranApiKey || !fivetranApiSecret) return;

          try {
            // Get types
            let response: ApiResponse<Type[]> | void = await apiCall(
              'metadata/connector-types?limit=1000',
              fivetranApiKey,
              fivetranApiSecret,
              'GET'
            );
            if (
              response &&
              response.body &&
              response.body.data &&
              response.body.data.items
            ) {
              //Added to make sure response and the response body are available
              const typesData = response.body.data.items;
              setTypes(typesData);
            }

            // Get groups
            response = await apiCall(
              'groups',
              fivetranApiKey,
              fivetranApiSecret,
              'GET'
            );
            if (
              response &&
              response.body &&
              response.body.data &&
              response.body.data.items
            ) {
              //Added to make sure response and the response body are available
              const groupsData = response.body.data.items;
              setGroups(groupsData);
              console.log('GROUPDATA', groupsData);
              setSelectedGroup(groupsData[0]);
              console.log('GROUPE DATA 0', groupsData[0]);
              console.log('selected group', selectedGroup);
            }

            // Get connectors
            // Assuming you want to get connectors for the selected group (first group by default)

            // if (selectedGroup) {
            //   const connectorsData = await getConnectors(
            //     selectedGroup,
            //     fivetranApiKey,
            //     fivetranApiSecret
            //   );
            //   console.log('line 112');
            //   setConnectors(connectorsData);
            //   setPending(false);
            // }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };

        getInitialData();
      } catch (error) {
        console.error('Error parsing cookie:', error);
      }
    } else {
      console.error('No user cookie found or cookie is not a string');
    }
  }, []);

  useEffect(() => {
    const getSelectGroup = async () => {
      const userCookie = getCookie('user');
      if (userCookie && typeof userCookie === 'string') {
        const { fivetranApiKey, fivetranApiSecret } = JSON.parse(userCookie);
        setCredentials({ fivetranApiKey, fivetranApiSecret });

        if (selectedGroup) {
          const connectorsData = await getConnectors(
            selectedGroup,
            fivetranApiKey,
            fivetranApiSecret
          );
          console.log('line 112');
          setConnectors(connectorsData);
          setPending(false);
        }
      }
    };
    getSelectGroup();
  }, [selectedGroup]);

  async function handleSelect(event: ChangeEvent<HTMLSelectElement>) {
    event.preventDefault();
    const group = groups.find((g) => g.id === event.target.value);

    if (group && credentials) {
      //added this line to make sure there are groupt
      setSelectedGroup(group);
      setPending(true);
      const connectorsData = await getConnectors(
        group,
        credentials.fivetranApiKey,
        credentials.fivetranApiSecret
      );
      setConnectors(connectorsData);
      setPending(false);
    }
  }

  async function pauseConnectors(connectorsToModify: Connector[]) {
    if (credentials) {
      //checking if credenntials are there
      await modifyConnectors(
        connectorsToModify,
        credentials.fivetranApiKey,
        credentials.fivetranApiSecret,
        { paused: true }
      );
      const updatedConnectors = connectors.map((connector) => {
        if (connectorsToModify.find((c) => c.id === connector.id)) {
          return {
            ...connector,
            status: { ...connector.status, sync_state: 'paused' },
          };
        }
        return connector;
      });
      setConnectors(updatedConnectors);
    }
  }

  async function unpauseConnectors(connectorsToModify: Connector[]) {
    if (credentials) {
      //checking if credenntials are there
      await modifyConnectors(
        connectorsToModify,
        credentials.fivetranApiKey,
        credentials.fivetranApiSecret,
        { paused: false }
      );
      const updatedConnectors = connectors.map((connector) => {
        if (connectorsToModify.find((c) => c.id === connector.id)) {
          return {
            ...connector,
            status: { ...connector.status, sync_state: 'scheduled' },
          };
        }
        return connector;
      });
      setConnectors(updatedConnectors);
    }
  }

  async function freqConnectors(connectorsToModify: Connector[], freq: number) {
    if (credentials) {
      //checking if credenntials are there
      await modifyConnectors(
        connectorsToModify,
        credentials.fivetranApiKey,
        credentials.fivetranApiSecret,
        { sync_frequency: freq }
      );
      const updatedConnectors = connectors.map((connector) => {
        if (connectorsToModify.find((c) => c.id === connector.id)) {
          return { ...connector, sync_frequency: freq };
        }
        return connector;
      });
      setConnectors(updatedConnectors);
    }
  }

  async function HistResyncConnectors(connectorsToResync: Connector[]) {
    if (credentials) {
      //checking if credenntials are there
      await resyncConnectors(
        connectorsToResync,
        credentials.fivetranApiKey,
        credentials.fivetranApiSecret
      );
      const updatedConnectors = connectors.map((connector) => {
        if (connectorsToResync.find((c) => c.id === connector.id)) {
          return {
            ...connector,
            status: { ...connector.status, sync_state: 'syncing' },
          };
        }
        return connector;
      });
      setConnectors(updatedConnectors);
    }
  }

  async function NormalSyncConnectors(connectorsToSync: Connector[]) {
    if (credentials) {
      //checking if credenntials are there
      await syncConnectors(
        connectorsToSync,
        credentials.fivetranApiKey,
        credentials.fivetranApiSecret
      );
      const updatedConnectors = connectors.map((connector) => {
        if (connectorsToSync.find((c) => c.id === connector.id)) {
          return {
            ...connector,
            status: { ...connector.status, sync_state: 'syncing' },
          };
        }
        return connector;
      });
      setConnectors(updatedConnectors);
    }
  }
  console.log('HI');
  console.log('pensed', pending);
  console.log('connectors', connectors);
  return (
    <>
      <div className='mx-12 mt-5 font-bold text-lg items-center'>
        <label>Select your connector group: </label>
        {!pending && (
          <select
            onChange={handleSelect}
            className='bg-[#06AB78] text-white rounded p-1'
          >
            {groups.map((group) => (
              <option value={group.id} key={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <div className='mx-9'>
        {!pending && (
          <ConnectorTable
            data={connectors}
            types={types}
            onPause={pauseConnectors}
            onUnpause={unpauseConnectors}
            onFreq={freqConnectors}
            onResync={HistResyncConnectors}
            onSync={NormalSyncConnectors}
          />
        )}
      </div>
      <div>
        <Hello />
      </div>
    </>
  );
}
