import mongoose, { Schema, model, models } from 'mongoose';

const BookSchema = new Schema({
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


export default models.Book || model('Book', BookSchema);

