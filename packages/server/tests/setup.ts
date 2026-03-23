import { afterEach, beforeAll, beforeEach } from 'vitest';
import { beginTest, resetTest } from './helpers/testPrisma';
import { execSync } from 'child_process';

beforeAll(() => {
   execSync('bun prisma migrate deploy', {
      stdio: 'inherit',
      env: {
         ...process.env,
         ENV: 'test',
      },
   });
});

beforeEach(async () => await beginTest());

afterEach(async () => await resetTest());
