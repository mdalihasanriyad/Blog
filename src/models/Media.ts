import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface IMedia extends Document {
  url: string;
  publicId: string;
  alt: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  uploadedBy: Schema.Types.ObjectId;
  createdAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true, unique: true },
    alt: { type: String, default: '' },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    format: { type: String, default: '' },
    bytes: { type: Number, default: 0 },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const Media: Model<IMedia> = models.Media || model<IMedia>('Media', MediaSchema);
export default Media;
