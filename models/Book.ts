import mongoose, { Model } from 'mongoose';

interface IBook {
  title: string;
  author: string;
  quantity: number;
  location: string;
  status: 'active' | 'deleted';
}

const BookSchema = new mongoose.Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  quantity: { type: Number, required: true },
  location: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    default: 'active', 
    enum: ['active', 'deleted'] 
  },
}, { timestamps: true });

const BookModel = (mongoose.models.Book as Model<IBook>) || mongoose.model<IBook>('Book', BookSchema);

export default BookModel;