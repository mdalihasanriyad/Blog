import { Schema, model, models, type Document, type Model } from 'mongoose';

export type CommentStatus = 'pending' | 'approved' | 'spam' | 'trash';

export interface IComment extends Document {
  post: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId | null;
  guestName?: string;
  guestEmail?: string;
  content: string;
  parent?: Schema.Types.ObjectId | null;
  status: CommentStatus;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true, index: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    guestName: { type: String, maxlength: 80 },
    guestEmail: { type: String, maxlength: 120 },
    content: { type: String, required: true, maxlength: 2000 },
    parent: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
    status: {
      type: String,
      enum: ['pending', 'approved', 'spam', 'trash'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true },
);

const Comment: Model<IComment> = models.Comment || model<IComment>('Comment', CommentSchema);
export default Comment;
