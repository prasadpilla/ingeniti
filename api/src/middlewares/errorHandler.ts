import { ErrorRequestHandler, Request, RequestHandler, Response } from 'express';
import { HttpStatusCode } from 'shared';
import { IS_PRODUCTION } from '../config';

const unexpectedRequest: RequestHandler = (_req: Request, res: Response) => {
  res.sendStatus(HttpStatusCode.NOT_FOUND_404);
};

const addErrorToRequestLog: ErrorRequestHandler = (err: Error, req: Request, res: Response) => {
  req.log.error(err);
  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR_500).json({
    error: 'Internal Server Error',
    ...(!IS_PRODUCTION ? { stack: err.stack } : {}),
  });
};

export default () => [unexpectedRequest, addErrorToRequestLog];
