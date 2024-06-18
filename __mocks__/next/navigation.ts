import { vi } from 'vitest';

export function mockUseRouter() {
  return { push: vi.fn() };
}
