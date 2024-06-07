'use client';

import { getCookie } from 'cookies-next';
import { useEffect } from 'react';
import { apiCall } from '../lib/fivetran';

export default function Page () {

  useEffect(() => {
    const {fivetranApiKey, fivetranApiSecret} = JSON.parse(getCookie('user'));
    
    async function getInitialData () {
      let res = await apiCall('groups', fivetranApiKey, fivetranApiSecret);
      const groups = res.body.data.items;

      res = await apiCall(`groups/${groups[0].id}/connectors`, fivetranApiKey, fivetranApiSecret);
      const connectors = res.body.data.items;

      // get all connector types
      // res = await apiCall('metadata/connector-types', fivetranApiKey, fivetranApiSecret);
      // const types = res.body.data.items;
      // console.log(types);
    }
    getInitialData();
  },[]);

  return (
    <div>
      
      
    </div>
  );
}