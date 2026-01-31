import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const {
    DB_HOST = "localhost",
    DB_PORT = 3306,
    DB_USER = "root",
    DB_PASS = "",
    DB_NAME = "school_management_dev"
} = process.env;

const adapter = new PrismaMariaDb({
    host: DB_HOST,
    port: +DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
});

const prisma = new PrismaClient({ adapter });

export default prisma;