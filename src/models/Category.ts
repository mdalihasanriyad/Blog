import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: Schema.Types.ObjectId | null;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, default: '', maxlength: 300 },
    image: { type: String, default: '' },
    parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    metaTitle: { type: String, default: '', maxlength: 70 },
    metaDescription: { type: String, default: '', maxlength: 160 },
  },
  { timestamps: true },
);

const Category: Model<ICategory> = models.Category || model<ICategory>('Category', CategorySchema);
export default Category;
