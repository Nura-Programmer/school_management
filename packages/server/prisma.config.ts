import "dotenv/config";
import { defineConfig } from "prisma/config";
import { getDatabaseUrl } from "./src/prisma/database_url";

export default defineConfig({
    schema: "src/prisma/schema.prisma",
    migrations: {
        path: "src/prisma/migrations",
    },
    datasource: {
        url: getDatabaseUrl()
    },
});
