import mongoose, { Schema, model, models } from 'mongoose';

const BorrowSchema = new Schema({
  userId: { 
    type: String, 
    required: true 
  },
  bookId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Book', 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  targetDate: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    required: true,
    enum: ['INIT', 'CLOSE-NO-AVAILABLE-BOOK', 'ACCEPTED', 'CANCEL-ADMIN', 'CANCEL-USER'], 
    default: 'INIT' 
  }
}, { timestamps: true });

export default models.Borrow || model('Borrow', BorrowSchema); 

