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

const endpoint = 'groups';
const fivetranApiKey = 'ry20pbspJZSlyxrQ';
const fivetranApiSecret = 'Y5KJ0PUD1petnS99lmpceFWVF6bpb94D';
describe('Test API', () => {
  let response: Response;
  let body: Array<{ [key: string]: unknown }>;

  beforeAll(async () => {
    try {
      response = await fetch(
        'https://api.fivetran.com/v1/method=GET&endpoint=groups&apiKey=ry20pbspJZSlyxrQ&apiSecret=Y5KJ0PUD1petnS99lmpceFWVF6bpb94D',
        { method: 'POST', headers: { 'Content-Type': 'application/json' } }
        // {
        //   method: 'POST',
        //   body: JSON.stringify(payload),
        //   headers: { 'Content-Type': 'application/json' },
        // }
      );
      body = await response.json();
    } catch (error) {
      console.error('error', error);
    }
  }, BEFORE_ALL_TIMEOUT);
  test('Should have response status 200', () => {
    expect(response.status).toBe(200);
  });
  test('Should have content-type', () => {
    expect(response.headers.get('Content-Type')).toBe('application/json');
  });
  test('Should have array in the body', () => {
    expectTypeOf(body).toBeArray();
  });
});
