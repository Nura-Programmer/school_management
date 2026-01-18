import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '@prisma/client';

const { ENV, DATABASE_URL, TEST_DATABASE_URL } = process.env;

const databaseUrl = ENV === 'test'
    ? TEST_DATABASE_URL ?? ""
    : DATABASE_URL ?? "";


const adapter = new PrismaLibSql({
    url: databaseUrl,
});

const prisma = new PrismaClient({
    adapter,
});

export default prisma;