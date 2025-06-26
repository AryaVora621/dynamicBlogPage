import mongoose, { Schema, models, model } from 'mongoose';

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  color: { type: String, required: true },
  description: { type: String, required: true },
});

export default models.Category || model('Category', CategorySchema); 