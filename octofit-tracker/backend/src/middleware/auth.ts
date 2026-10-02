import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      authUserId?: string;
    }
  }
}

const secret = process.env.JWT_SECRET ?? (process.env.NODE_ENV === 'production' ? '' : 'octofit-local-development-secret');

if (!secret) {
  throw new Error('JWT_SECRET must be set in production');
}

export function createToken(userId: string) {
  return jwt.sign({ sub: userId }, secret, { expiresIn: '7d' });
}

export function requireAuth(request: Request, response: Response, next: NextFunction) {
  const authorization = request.get('authorization');
  const [scheme, token] = authorization?.split(' ') ?? [];

  if (scheme !== 'Bearer' || !token) {
    response.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const payload = jwt.verify(token, secret) as JwtPayload;
    if (typeof payload.sub !== 'string') {
      response.status(401).json({ error: 'Invalid authentication token' });
      return;
    }
    request.authUserId = payload.sub;
    next();
  } catch {
    response.status(401).json({ error: 'Invalid or expired authentication token' });
  }
}
