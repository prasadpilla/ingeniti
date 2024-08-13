import express, { Express } from 'express';
import 'express-async-errors';
import helmet from 'helmet';
import { HttpStatusCode } from 'shared';
import devicesController from './controllers/devices.controller';
import tasksController from './controllers/tasks.controller';
import errorHandler from './middlewares/errorHandler';
import rateLimiter from './middlewares/rateLimiter';
import requestLogger from './middlewares/requestLogger';

const taskApp: Express = express();

// Middlewares
taskApp.use(express.json());
taskApp.use(helmet());
taskApp.use(rateLimiter);
taskApp.use(requestLogger);

// Routes
taskApp.use('/tasks', tasksController);
taskApp.use('/devices', devicesController);

taskApp.get('/', (_, res) => {
  res.status(HttpStatusCode.OK_200).send({ healthy: true, version: '0.0.1', service: 'task-worker' });
});

// !IMPORTANT: This must be the last middleware in the stack.
// We're using it to handle 404s and 500s
taskApp.use(errorHandler());

export { taskApp };
