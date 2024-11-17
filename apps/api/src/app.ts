import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import { HttpStatusCode } from '@ingeniti/shared';
import cors from 'cors';
import express, { Express } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import { WEB_APP_URL } from './config';
import devicesController from './controllers/devices.controller';
import tasksController from './controllers/tasks.controller';
import schedulesController from './controllers/schedules.controller';
import errorHandler from './middlewares/errorHandler';
import rateLimiter from './middlewares/rateLimiter';
import prodRequestLogger from './middlewares/requestLogger';

const app: Express = express();

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    console.log('CORS Origin:', WEB_APP_URL);
    if (!origin || origin === WEB_APP_URL) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());
app.use(rateLimiter);
app.use(prodRequestLogger);

// Health check route (no auth required)
app.get('/', (_, res) => {
  res.status(HttpStatusCode.OK_200).send({ healthy: true, version: '0.0.3', service: 'api' });
});

// Auth middleware
app.use(ClerkExpressRequireAuth());

// Routes
app.use('/devices', devicesController);
app.use('/tasks', tasksController);
app.use('/schedules', schedulesController);

// !IMPORTANT: This must be the last middleware in the stack.
// We're using it to handle 404s and 500s
app.use(errorHandler());

export { app };
