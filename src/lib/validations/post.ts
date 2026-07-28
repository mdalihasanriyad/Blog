import { z } from 'zod';

export const faqItemSchema = z.object({
  question: z.string().min(3).max(200),
  answer: z.string().min(3).max(1000),
});

export const postSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(160),
  slug: z
    .string()
    .min(3)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase, hyphen-separated'),
  excerpt: z.string().min(20, 'Excerpt must be at least 20 characters').max(300),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  coverImage: z.string().url().or(z.literal('')),
  coverImageAlt: z.string().max(150),
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'scheduled', 'published', 'archived']).default('draft'),
  isFeatured: z.boolean().default(false),
  scheduledAt: z.string().datetime().optional().nullable(),
  metaTitle: z.string().max(70).optional().default(''),
  metaDescription: z.string().max(160).optional().default(''),
  canonicalUrl: z.string().url().or(z.literal('')).optional(),
  ogImage: z.string().url().or(z.literal('')).optional(),
  keywords: z.array(z.string()).default([]),
  faq: z.array(faqItemSchema).default([]),
  noIndex: z.boolean().default(false),
});

export type PostFormValues = z.infer<typeof postSchema>;

export const commentSchema = z.object({
  postId: z.string().min(1),
  content: z.string().min(2, 'Comment is too short').max(2000),
  guestName: z.string().max(80).optional(),
  guestEmail: z.string().email().optional().or(z.literal('')),
  parent: z.string().optional().nullable(),
});

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
});

export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export const categorySchema = z.object({
  name: z.string().min(2).max(60),
  slug: z
    .string()
    .min(2)
    .max(60)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().max(300).optional().default(''),
  parent: z.string().optional().nullable(),
  metaTitle: z.string().max(70).optional().default(''),
  metaDescription: z.string().max(160).optional().default(''),
});
