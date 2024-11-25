import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import { LevelWithSilent } from 'pino';
import { CustomAttributeKeys, Options, pinoHttp } from 'pino-http';
import { HttpStatusCode } from 'shared';
import { IS_PRODUCTION } from '../config';

enum LogLevel {
  Fatal = 'fatal',
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
  Trace = 'trace',
  Silent = 'silent',
}

type PinoCustomProps = {
  request: Request;
  response: Response;
  error: Error;
};

const customAttributeKeys: CustomAttributeKeys = {
  req: 'request',
  res: 'response',
  err: 'error',
  responseTime: 'timeTaken',
};

const customProps = (req: Request, res: Response): PinoCustomProps => ({
  request: req,
  response: res,
  error: res.locals.err,
});

const customLogLevel = (_req: IncomingMessage, res: ServerResponse<IncomingMessage>, err?: Error): LevelWithSilent => {
  if (err || res.statusCode >= HttpStatusCode.INTERNAL_SERVER_ERROR_500) return LogLevel.Error;
  if (res.statusCode >= HttpStatusCode.BAD_REQUEST_400) return LogLevel.Warn;
  if (res.statusCode >= HttpStatusCode.MULTIPLE_CHOICES_300) return LogLevel.Silent;
  return LogLevel.Info;
};

const customSuccessMessage = (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  if (res.statusCode === HttpStatusCode.NOT_FOUND_404) return 'Not Found';
  return `${req.method} completed`;
};

const genReqId = (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
  const existingID = req.id ?? req.headers['x-request-id'];
  if (existingID) return existingID;
  const id = randomUUID();
  res.setHeader('X-Request-Id', id);
  return id;
};

const createLoggerOptions = (options?: Options): Options => ({
  customProps: customProps as unknown as Options['customProps'],
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
    err: (err) => ({
      type: err.type,
      message: err.message,
      stack: err.stack,
    }),
  },
  genReqId,
  customLogLevel,
  customSuccessMessage,
  customReceivedMessage: (req) => `request received: ${req.method}`,
  customErrorMessage: (_req, res) => `request errored with status code: ${res.statusCode}`,
  customAttributeKeys,
  ...options,
  ...(IS_PRODUCTION ? {} : { transport: { target: 'pino-pretty' } }),
});

function logInfo(message: string) {
  console.log(message);
}

function logError(error: Error, message?: string) {
  console.error(error, message);
}

export { createLoggerOptions, logError, logInfo, pinoHttp };
