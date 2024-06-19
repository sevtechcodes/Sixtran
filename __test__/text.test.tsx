import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import {
  beforeAll,
  expectTypeOf,
  describe,
  test,
  it,
  expect,
  vi,
} from 'vitest';
import ConnectorDetail from '../app/ui/connector-detail-table';
import { FiveTranMetaData } from '../app/dashboard/[connector_id]/page'; // Adjust the import path as necessary
import { mockUseRouter } from '../__mocks__/next/navigation';
import CredentialsForm from '../app/ui/credentials-form';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Page from '../app/setup/page';
import { apiCall } from '../app/lib/fivetran';
// mocks the router
vi.mock('next/navigation', () => ({
  useRouter: mockUseRouter,
}));

// mocks the cookie
vi.mock('cookies-next', () => ({
  getCookie: vi.fn(() => 'xyz'),
}));

describe('Credential page', () => {
  it('Check if existing credentials are valid, then render the page', () => {
    render(<Page />);
    const existingCredentials = screen.getByText('Use existing credentials');
    expect(existingCredentials).toBeInTheDocument();
  });

  it('Checks if the button Update credentials is present', () => {
    render(<CredentialsForm />);
    expect(
      screen.getByRole('button', { name: 'Update credentials' })
    ).toBeDefined();
  });
});

describe('Test change frequency', () => {
  it('checks that the user can update the frequency of API refresh', () => {});
});

describe('ConnectorDetail Component', () => {
  it('should render search input', () => {
    const mockSchema: FiveTranMetaData = {
      name_in_destination: 'Mock Dataset',
      tables: {},
      enabled: true,
      schemas: 'schema',
    };
    const { getByPlaceholderText } = render(
      //The getByPlaceholderText is a query provided by the @testing-library/react library.
      <ConnectorDetail
        schema={mockSchema}
        queries={[]}
        disable={() => {}}
        enable={() => {}}
      />
    );
    const inputElement = getByPlaceholderText('Search...');
    expect(inputElement).toBeInTheDocument();
  });
});

// describe('Test API call', () => {
//   it('Should return 200 status', async () => {
//     const mockData = {
//       data: 'xyz',
//     };
//     fetch.mockResolvedValue();
//   });
// });

const BEFORE_ALL_TIMEOUT = 30000;

const endpoint = 'account/info';
const fivetranApiKey = 'ry20pbspJZSlyxrQ';
const fivetranApiSecret = 'Ny5RezCXx4A4GmCccwjDvJxatTB7B3la';
const credentials = `${fivetranApiKey}:${fivetranApiSecret}`;
const encodedCredentials = Buffer.from(credentials).toString('base64');
const authorizationHeader = `Basic ${encodedCredentials}`;

describe('Test API', () => {
  let response: Response;
  let body: Array<{ [key: string]: unknown }>;

  beforeAll(async () => {
    try {
      const url = `https://api.fivetran.com/v1/${endpoint}?method=GET&apiKey=${fivetranApiKey}&apiSecret=${fivetranApiSecret}`;
      response = await fetch(url, 
        {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorizationHeader
        }
      }
      );
      body = await response.json();
      console.log('body', body)
    } catch (error) {
      console.error('error', error);
      throw error;
    }
  }, BEFORE_ALL_TIMEOUT);

  test('Should have response status 200', () => {
    expect(response.status).toBe(200);
  });

  test('Should have content-type', () => {
    expect(response.headers.get('Content-Type')).toBe('application/json');
  });

  test('Should have expected body structure', () => {
    expect(body).toHaveProperty('code', 'Success');
    expect(body).toHaveProperty('data');
    // expect(body.data).toHaveProperty('account_id', 'deepened_heavy');
    // expect(body.data).toHaveProperty('account_name', 'Codeworks');
    // expect(body.data).toHaveProperty('user_id', 'escargot_skating');
    // expect(body.data).toHaveProperty('system_key_id', null);
  });
});
