import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS } = process.env;

const DATABASE_URL = `mysql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export default defineConfig({
   schema: 'src/prisma/schema.prisma',
   migrations: {
      path: 'src/prisma/migrations',
   },
   datasource: {
      url: DATABASE_URL,
   },
});
