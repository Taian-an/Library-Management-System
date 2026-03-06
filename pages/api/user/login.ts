import jwt from 'jsonwebtoken';

interface CustomApiRequest {
  method?: string;
  body: Record<string, unknown>;
}

interface CustomApiResponse {
  status: (code: number) => CustomApiResponse;
  json: (data: unknown) => void;
  end: () => void;
}

export default async function handler(req: unknown, res: unknown): Promise<void> {
  const r = req as CustomApiRequest;
  const s = res as CustomApiResponse;

  if (r.method !== 'POST') return s.status(405).end();

  const body = r.body as Record<string, string>;
  const { email, password } = body;

  let userData: Record<string, string> | null = null;

  if (email === 'admin@test.com' && password === 'admin123') {
    userData = { id: 'admin_1', email: 'admin@test.com', role: 'ADMIN' };
  } else if (email === 'user@test.com' && password === 'user123') {
    userData = { id: 'user_1', email: 'user@test.com', role: 'USER' };
  }

  if (!userData) {
    return s.status(401).json({ message: 'Unauthorized' }); 
  }

  const sign = (jwt as unknown as { sign: (data: unknown, secret: string, options: { expiresIn: string }) => string }).sign;
  const token = sign(userData, process.env.JWT_SECRET || '123', { expiresIn: '1d' });

  s.status(200).json({ token, user: userData });
}