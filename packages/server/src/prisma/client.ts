import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import { dbOptions } from '../utils/config';

const adapter = new PrismaMariaDb(dbOptions);
const prisma = new PrismaClient({ adapter });

export default prisma;
