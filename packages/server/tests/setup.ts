import { execSync } from 'child_process';

export default async () => {
    execSync("bun prisma migrate deploy", {
        stdio: 'inherit',
        env: {
            ...process.env,
            ENV: 'test'
        }
    })
};
