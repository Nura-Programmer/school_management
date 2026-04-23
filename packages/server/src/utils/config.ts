import 'dotenv/config';

export const {
    DB_HOST = 'localhost',
    DB_PORT = 3306,
    DB_USER = 'root',
    DB_PASS = '',
    DB_NAME = 'school_management_dev',
} = process.env;

export const dbOptions = {
    host: DB_HOST,
    port: +DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
};