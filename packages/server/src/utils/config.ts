import 'dotenv/config';

export const {
    DB_HOST = 'localhost',
    DB_PORT = 3306,
    DB_USER = 'root',
    DB_PASS = '',
    DB_NAME = 'school_management_dev',

    ENV: ENV_NAME,

    SESS_NAME = 'sid',
    SESS_PASS = 'ssh!quiet,it\'ascret!',
} = process.env;

export const IN_PROD = ENV_NAME === 'production';

export const dbOptions = {
    host: DB_HOST,
    port: +DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
};