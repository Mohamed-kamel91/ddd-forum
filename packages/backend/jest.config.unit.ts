import { JestConfigWithTsJest } from 'ts-jest';

export default async (): Promise<JestConfigWithTsJest> => ({
  displayName: 'Backend (Unit)',
  testMatch: ['**/@(src|tests)/**/*.@(unit).*'],
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', {}],
  },
});
