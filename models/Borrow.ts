import mongoose, { Schema, model, models, Model } from 'mongoose';

const BorrowSchema = new Schema({
  userId: { type: String, required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  createdAt: { type: Date, default: Date.now },
  targetDate: { type: Date, required: true },
  status: { 
    type: String, 
    required: true,
    enum: ['INIT', 'CLOSE-NO-AVAILABLE-BOOK', 'ACCEPTED', 'CANCEL-ADMIN', 'CANCEL-USER'],
    default: 'INIT' 
  }
}, { timestamps: true });

const BorrowModel = (models.Borrow as unknown as Model<unknown>) || model('Borrow', BorrowSchema);

export default BorrowModel;