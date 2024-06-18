import React from 'react';
import { render, screen} from '@testing-library/react';
import { describe,test, it, expect , vi} from 'vitest';
import '@testing-library/jest-dom';  // Import jest-dom for the matchers
import ConnectorDetail from '../app/ui/connector-detail-table';
import { FiveTranMetaData } from '../app/dashboard/[connector_id]/page'; // Adjust the import path as necessary
import { mockUseRouter } from '../__mocks__/next/navigation';
import CredentialsForm from '../app/ui/credentials-form';
import Hello from '../app/ui/hello';


vi.mock('next/navigation', () => ({
  useRouter: mockUseRouter,
}));

test('Home', () => {
  render(<CredentialsForm />);
  expect(
    screen.getByRole('button', { name: 'Update credentials' })
  ).toBeDefined();
});

describe('Hello component', () => {
  it('renders "Hello World" in an h1 tag', () => {
    render(<Hello />);
    const h1Element = screen.getByText('Hello World');
    expect(h1Element.tagName).toBe('H1');
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
      enabled: true,  // Placeholder value
      schemas: 'schema'  // Placeholder value
    };

    const { getByPlaceholderText } = render( //The getByPlaceholderText is a query provided by the @testing-library/react library. 
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


