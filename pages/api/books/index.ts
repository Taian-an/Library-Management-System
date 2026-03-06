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
  if (!user) {
    return s.status(401).json({ message: 'Unauthorized' });
  }

  if (r.method === 'GET') {
    const filter: Record<string, unknown> = {};

    if (user.role !== 'ADMIN') {
      filter.status = 'active';
    }

    if (r.query.title) {
      filter.title = { $regex: String(r.query.title), $options: 'i' };
    }
    if (r.query.author) {
      filter.author = { $regex: String(r.query.author), $options: 'i' };
    }

    const books = await BookModel.find(filter);
    return s.status(200).json(books);
  }

  if (r.method === 'POST') {
    if (user.role !== 'ADMIN') {
      return s.status(403).json({ message: 'Forbidden: Admin only' });
    }
    
    try {
      const bookData = r.body as Record<string, unknown>;
      const newBook = await BookModel.create({
        ...bookData,
        status: 'active' 
      });
      return s.status(201).json(newBook);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return s.status(400).json({ message: 'Failed to create book' });
    }
  }

  // 處理不支援的 HTTP 方法
  return s.status(405).end();
}