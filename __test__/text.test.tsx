import { expect, test, describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import CredentialsForm from '../app/ui/credentials-form';
import Hello from '../app/ui/hello';

// test('Home', () => {
//   render(<CredentialsForm />);
//   expect(
//     screen.getByRole('button', { name: 'Update credentials' })
//   ).toBeDefined();
// });

describe('Hello component', () => {
  it('renders "Hello World" in an h1 tag', () => {
    render(<Hello />);
    const h1Element = screen.getByText('Hello World');
    expect(h1Element.tagName).toBe('H1');
  });
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
