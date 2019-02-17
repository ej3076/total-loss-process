import * as Express from 'express';

declare global {
  namespace Express {
    interface Request {
      privateKey: string;
    }
  }
}
