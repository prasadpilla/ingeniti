import { Request } from 'express';
import { rateLimit } from 'express-rate-limit';
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_SEC } from '../config';

const rateLimiter = rateLimit({
  legacyHeaders: true,
  limit: RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  windowMs: RATE_LIMIT_WINDOW_SEC * 1000,
  keyGenerator: (req: Request) => req.ip as string,
});

export default rateLimiter;
