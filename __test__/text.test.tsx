import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import CredentialsForm from '../app/ui/credentials-form';

test('Home', () => {
  render(<CredentialsForm />);
  expect(
    screen.getByRole('button', { name: 'Update credentials' })
  ).toBeDefined();
});
