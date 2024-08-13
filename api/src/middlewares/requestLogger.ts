import { RequestHandler } from 'express';
import { Options } from 'pino-http';
import { createLoggerOptions, pinoHttp } from '../utils/logger';

const requestLogger = (options?: Options): RequestHandler[] => {
  const pinoOptions = createLoggerOptions(options);
  return [pinoHttp(pinoOptions)];
};

export default requestLogger();
