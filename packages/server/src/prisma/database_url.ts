export const getDatabaseUrl = (): string => {
    const {
        DATABASE_PROVIDER,
        MYSQL_USER,
        MYSQL_PASSWORD,
        MYSQL_HOST,
        MYSQL_PORT,
        MYSQL_DB,
        DATABASE_URL
    } = process.env;

    if (DATABASE_PROVIDER === "mysql") {
        return `mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@${MYSQL_HOST}:${MYSQL_PORT}/${MYSQL_DB}`;
    }

    return DATABASE_URL ?? "";
}