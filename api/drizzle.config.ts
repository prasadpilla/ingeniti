import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from './src/config';

export default {
  schema: './src/models',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: DB_PORT,
    database: DB_DATABASE,
  },
};
