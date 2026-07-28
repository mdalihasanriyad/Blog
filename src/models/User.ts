import { Schema, model, models, type Document, type Model } from 'mongoose';

export type UserRole = 'admin' | 'editor' | 'author' | 'reader';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  bio?: string;
  role: UserRole;
  emailVerified?: Date | null;
  bookmarks: Schema.Types.ObjectId[];
  readingHistory: { post: Schema.Types.ObjectId; viewedAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    image: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 500 },
    role: { type: String, enum: ['admin', 'editor', 'author', 'reader'], default: 'reader' },
    emailVerified: { type: Date, default: null },
    bookmarks: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    readingHistory: [
      {
        post: { type: Schema.Types.ObjectId, ref: 'Post' },
        viewedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

// UserSchema.index({ email: 1 });

const User: Model<IUser> = models.User || model<IUser>('User', UserSchema);
export default User;
