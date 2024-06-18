import { expect, test, describe, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
// // jest.mock('next/navigation');
// beforeAll(async () => {});
// test('Form', () => {
//   useRouter = vi.fn();
//   // expect(screen.getByText('Current path: /about')).toBeInTheDocument();

//   render(<CredentialsForm />);
//   expect(
//     screen.getByRole('button', { name: 'Update credentials' })
//   ).toBeDefined();
// });
