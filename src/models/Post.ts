import { Schema, model, models, type Document, type Model } from 'mongoose';

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export interface IPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown/MDX source
  coverImage: string;
  coverImageAlt: string;
  author: Schema.Types.ObjectId;
  category: Schema.Types.ObjectId;
  tags: Schema.Types.ObjectId[];
  status: PostStatus;
  isFeatured: boolean;
  publishedAt?: Date | null;
  scheduledAt?: Date | null;
  readingTimeMinutes: number;
  views: number;
  viewsLast7Days: number;
  likes: number;
  // SEO
  metaTitle: string;
  metaDescription: string;
  canonicalUrl?: string;
  ogImage?: string;
  keywords: string[];
  faq: { question: string; answer: string }[];
  // Internal linking / related content hints
  relatedPosts: Schema.Types.ObjectId[];
  noIndex: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FaqSchema = new Schema(
  {
    question: { type: String, required: true, maxlength: 200 },
    answer: { type: String, required: true, maxlength: 1000 },
  },
  { _id: false },
);

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    excerpt: { type: String, required: true, maxlength: 300 },
    content: { type: String, required: true },
    coverImage: { type: String, default: '' },
    coverImageAlt: { type: String, default: '' },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    isFeatured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: null, index: true },
    scheduledAt: { type: Date, default: null },
    readingTimeMinutes: { type: Number, default: 1 },
    views: { type: Number, default: 0 },
    viewsLast7Days: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    metaTitle: { type: String, default: '', maxlength: 70 },
    metaDescription: { type: String, default: '', maxlength: 160 },
    canonicalUrl: { type: String, default: '' },
    ogImage: { type: String, default: '' },
    keywords: [{ type: String }],
    faq: [FaqSchema],
    relatedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    noIndex: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Compound indexes for common query patterns (listing, trending, search)
PostSchema.index({ status: 1, publishedAt: -1 });
PostSchema.index({ status: 1, isFeatured: 1, publishedAt: -1 });
PostSchema.index({ status: 1, views: -1 });
PostSchema.index({ title: 'text', excerpt: 'text', content: 'text' });

const Post: Model<IPost> = models.Post || model<IPost>('Post', PostSchema);
export default Post;
