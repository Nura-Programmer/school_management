import { execSync } from 'child_process';
import { beforeEach, afterEach } from 'vitest';
import { beginTestTransaction, rollbackTestTransaction } from './helpers/testPrisma';

beforeEach(async () => {
    await beginTestTransaction();
});

afterEach(async () => {
    await rollbackTestTransaction();
});

export default async () => {
    execSync("bun prisma migrate deploy", {
        stdio: 'inherit',
        env: {
            ...process.env,
            ENV: 'test'
        }
    })
};
