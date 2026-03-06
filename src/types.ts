export interface Book {
  _id: string;
  title: string;
  author: string;
  quantity: number;
  location: string;
  status: 'active' | 'deleted';
}

export interface BorrowRequest {
  _id: string;
  userId: string;
  bookId: Book;
  targetDate: string;
  status: 'INIT' | 'CLOSE-NO-AVAILABLE-BOOK' | 'ACCEPTED' | 'CANCEL-ADMIN' | 'CANCEL-USER';
}

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
}