import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  replyMessage?: string;
  repliedAt?: Date | null;
  createdAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, maxlength: 150 },
    subject: { type: String, required: true, maxlength: 200 },
    message: { type: String, required: true, maxlength: 5000 },
    status: { type: String, enum: ['new', 'read', 'replied', 'archived'], default: 'new' },
    replyMessage: { type: String, maxlength: 5000 },
    repliedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const Contact: Model<IContact> = models.Contact || model<IContact>('Contact', ContactSchema);
export default Contact;
