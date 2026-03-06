import jwt from 'jsonwebtoken';
import { User } from '../src/types';

export function verifyToken(req: any): User | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '123') as unknown;
    return decoded as User; 
    return null;
  } catch (err) {
    return null;
  }
}