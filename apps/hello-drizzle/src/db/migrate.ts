import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

import {config} from "dotenv";

config({ path: ".env" })

const run = async () => {    try {
    const db = drizzle(process.env.DATABASE_URL);
    console.info('Running DB Migration');
    await migrate(db, {
        migrationsFolder: './migrations'
    });
    console.info('✅ Done');
} catch (error) {
    console.error('❌ Migration failed:', error);
}
}
run()
