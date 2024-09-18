import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db, pool } from './client';

async function migrateDatabase() {
  console.log('Migrating database...');
  await migrate(db, { migrationsFolder: './drizzle' });
  await pool.end();
  console.log('Database migration successful!');
}

migrateDatabase();
