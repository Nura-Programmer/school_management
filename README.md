# school_management

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## MySQL Smoke Test (Optional)

To verify MySQL connectivity:
```bash
DATABASE_PROVIDER="mysql"
bun test mysql.smoke
```