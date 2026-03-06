import dbConnect from '../../lib/dbConnect';
import BorrowModel from '../../models/Borrow';
import { verifyToken } from '../../lib/auth';

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

  await dbConnect();
  const user = verifyToken(req);

  if (!user) {
    return s.status(401).json({ message: 'Unauthorized' });
  }

  if (r.method === 'POST') {
    if (user.role !== 'USER') {
      return s.status(403).json({ message: 'Forbidden' });
    }
    
    try {
      const payload = { 
        ...r.body, 
        userId: user.id, 
        status: 'INIT', 
        createdAt: new Date() 
      };
      const request = await BorrowModel.create(payload);
      return s.status(201).json(request);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return s.status(400).json({ message: 'Invalid data' });
    }
  }

  if (r.method === 'PATCH') {
    if (user.role !== 'ADMIN') {
      return s.status(403).json({ message: 'Forbidden' });
    }
    
    const body = r.body as Record<string, string>;
    const updated = await BorrowModel.findByIdAndUpdate(
      body.requestId, 
      { status: body.status }, 
      { new: true }
    );
    return s.status(200).json(updated);
  }

  s.status(405).end();
}