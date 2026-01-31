import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASS,
    DB_NAME
} = process.env;

const adapter = new PrismaMariaDb({
    host: DB_HOST,
    port: DB_PORT ? +DB_PORT : 3306,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
});

const prisma = new PrismaClient({ adapter });

export default prisma;