import type { Test } from 'supertest';
import { getTestPrisma } from './testPrisma';

export async function withTestPrisma(app: Test): Promise<Test> {
    const prisma = await getTestPrisma();

    return app.use((req: any) => {
        req.prisma = prisma;
    });
}
