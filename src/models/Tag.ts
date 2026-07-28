import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface ITag extends Document {
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const TagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, trim: true, maxlength: 40 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  },
  { timestamps: true },
);

const Tag: Model<ITag> = models.Tag || model<ITag>('Tag', TagSchema);
export default Tag;
