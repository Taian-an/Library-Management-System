import jwt from 'jsonwebtoken';
import type { User } from '../src/types';

export function verifyToken(req: unknown): User | null {
  const r = req as { headers: { authorization?: string } };
  const authHeader = r.headers.authorization;
  
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  try {
    const jwtTool = jwt as unknown as { verify: (t: string, s: string) => User };
    return jwtTool.verify(token, process.env.JWT_SECRET || '123');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return null;
  }
}