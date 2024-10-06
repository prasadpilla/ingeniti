import dotenv from 'dotenv';

dotenv.config();

export const APP_PORT = Number(process.env.PORT) || 8080;
export const TASK_WORKER_PORT = Number(process.env.TASK_WORKER_PORT) || 8082;
export const WEB_APP_URL = process.env.WEB_APP_URL || 'http://localhost:5173';
export const MOBILE_APP_URL = process.env.MOBILE_APP_URL || 'http://localhost:8082';
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = Number(process.env.DB_PORT) || 5436;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_DATABASE = process.env.DB_DATABASE;
export const RATE_LIMIT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100;
export const RATE_LIMIT_WINDOW_SEC = Number(process.env.RATE_LIMIT_WINDOW_SEC) || 10;
export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const TASK_WORKER_URL = process.env.TASK_WORKER_URL;
export const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
export const GCP_LOCATION = process.env.GCP_LOCATION;
export const GCP_TASK_QUEUE_ID = process.env.GCP_TASK_QUEUE_ID;
export const IS_LIVE_PREVIEW_ENABLED = process.env.IS_LIVE_PREVIEW_ENABLED === 'true';
