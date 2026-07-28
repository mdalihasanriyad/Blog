import { Schema, model, models, type Document, type Model } from 'mongoose';

export interface ISubscriber extends Document {
  email: string;
  status: 'pending' | 'confirmed' | 'unsubscribed';
  confirmToken?: string;
  subscribedAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  status: { type: String, enum: ['pending', 'confirmed', 'unsubscribed'], default: 'pending' },
  confirmToken: { type: String, select: false },
  subscribedAt: { type: Date, default: Date.now },
});

const Subscriber: Model<ISubscriber> =
  models.Subscriber || model<ISubscriber>('Subscriber', SubscriberSchema);
export default Subscriber;
