import type Mongoose from 'mongoose';

import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

interface IBorrow {
  userId: string;
  bookId: Mongoose.Types.ObjectId;
  createdAt: Date;
  targetDate: Date;
  status: 'INIT' | 'CLOSE-NO-AVAILABLE-BOOK' | 'ACCEPTED' | 'CANCEL-ADMIN' | 'CANCEL-USER';
}

const BorrowSchema = new Schema<IBorrow>({
  userId: { type: String, required: true },
  bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  createdAt: { type: Date, default: Date.now },
  targetDate: { type: Date, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['INIT', 'CLOSE-NO-AVAILABLE-BOOK', 'ACCEPTED', 'CANCEL-ADMIN', 'CANCEL-USER'],
    default: 'INIT' 
  }
}, { timestamps: true });

const BorrowModel = (models.Borrow as unknown as Mongoose.Model<IBorrow>) || model<IBorrow>('Borrow', BorrowSchema);

export default BorrowModel;