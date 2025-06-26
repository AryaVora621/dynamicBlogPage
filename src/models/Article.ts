import { Schema, models, model } from 'mongoose';

const ArticleSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: Array, required: true }, // Array of content blocks
  author: { type: String, required: true },
  date: { type: Date, required: true },
  category: { type: String, required: true },
  heroImage: { type: String, required: true },
  related: [{ type: String }], // Array of related article slugs or IDs
});

export default models.Article || model('Article', ArticleSchema); 