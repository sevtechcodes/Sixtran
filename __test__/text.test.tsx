import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, it, expect, vi } from 'vitest';
import ConnectorDetail from '../app/ui/connector-detail-table';
import { FiveTranMetaData } from '../app/dashboard/[connector_id]/page'; // Adjust the import path as necessary
import { mockUseRouter } from '../__mocks__/next/navigation';
import CredentialsForm from '../app/ui/credentials-form';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import Page from '../app/setup/page';

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
