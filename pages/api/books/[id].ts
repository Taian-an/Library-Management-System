import dbConnect from '../../../lib/dbConnect';
import BookModel from '../../../models/Book';
import { verifyToken } from '../../../lib/auth';

interface CustomApiRequest {
  method?: string;
  body: Record<string, unknown>;
  query: Record<string, string | string[] | undefined>;
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
  if (!user) return s.status(401).json({ message: 'Unauthorized' });

  const id = r.query?.id as string;

  if (r.method === 'PATCH') {
    if (user.role !== 'ADMIN') return s.status(403).json({ message: 'Forbidden' });
    const updated = await BookModel.findByIdAndUpdate(id, r.body, { new: true });
    s.status(200).json(updated);
    return;
  }

  if (r.method === 'DELETE') {
    if (user.role !== 'ADMIN') return s.status(403).json({ message: 'Forbidden' });
    await BookModel.findByIdAndUpdate(id, { status: 'deleted' });
    s.status(200).json({ message: 'Soft deleted successfully' });
    return;
  }
}