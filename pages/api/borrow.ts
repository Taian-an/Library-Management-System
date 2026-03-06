import dbConnect from '../../lib/dbConnect';
import BorrowModel from '../../models/Borrow';
import BookModel from '../../models/Book'; 
import { verifyToken } from '../../lib/auth';

interface CustomApiRequest {
  method?: string;
  body: {
    bookId?: string;
    targetDate?: string;
    requestId?: string;
    status?: string;
  };
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
    
    const { bookId, targetDate } = r.body;

    try {
      const book = await BookModel.findById(bookId);
      if (!book || book.quantity <= 0 || book.status === 'deleted') {
        return s.status(400).json({ message: 'Book out of stock or unavailable' });
      }

      await BookModel.findByIdAndUpdate(bookId, { 
        $inc: { quantity: -1 } 
      });

      const payload = { 
        userId: user.id, 
        bookId: bookId,
        targetDate: new Date(targetDate as string),
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
    
    const { requestId, status } = r.body;
    const updated = await BorrowModel.findByIdAndUpdate(
      requestId, 
      { status: status }, 
      { new: true }
    );
    
    if (!updated) {
      return s.status(404).json({ message: 'Request not found' });
    }
    
    return s.status(200).json(updated);
  }

  if (r.method === 'GET') {
    const filter = user.role === 'ADMIN' ? {} : { userId: user.id };
    const requests = await BorrowModel.find(filter).sort({ createdAt: -1 });
    return s.status(200).json(requests);
  }

  s.status(405).end();
}