/**
 * Seeds the database with an initial admin user, a couple of categories/tags,
 * and one sample post so the app isn't empty on first run.
 *
 * Usage: npm run seed
 * Requires MONGODB_URI to be set in .env.local
 */
import { config } from 'dotenv';
config({ path: '.env.local' });
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User';
import Category from '../src/models/Category';
import Tag from '../src/models/Tag';
import Post from '../src/models/Post';

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set. Add it to .env.local first.');

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  // --- Admin user ---
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';

  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    admin = await User.create({
      name: 'Site Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    });
    console.log(`Created admin user: ${adminEmail} / ${adminPassword} (change this password!)`);
  } else {
    console.log('Admin user already exists, skipping.');
  }

  // --- Categories ---
  const categoryData = [
    { name: 'Technology', slug: 'technology', description: 'Software, hardware, and the tools shaping how we work.' },
    { name: 'Business', slug: 'business', description: 'Strategy, markets, and the economics of growing companies.' },
  ];
  const categories = [];
  for (const c of categoryData) {
    let cat = await Category.findOne({ slug: c.slug });
    if (!cat) cat = await Category.create(c);
    categories.push(cat);
  }

  // --- Tags ---
  const tagNames = ['startups', 'ai', 'productivity'];
  const tags = [];
  for (const name of tagNames) {
    let tag = await Tag.findOne({ slug: name });
    if (!tag) tag = await Tag.create({ name, slug: name });
    tags.push(tag);
  }

  // --- Sample post ---
  const existingPost = await Post.findOne({ slug: 'welcome-to-the-ledger' });
  if (!existingPost) {
    await Post.create({
      title: 'Welcome to The Ledger',
      slug: 'welcome-to-the-ledger',
      excerpt: 'A quick tour of what this publication is about and what to expect.',
      content: `## Why we started this\n\nThis is a starter post created by the seed script so your homepage isn't empty. Edit or delete it from the admin panel at /admin/posts.\n\n### What's next\n\n- Log in at /login with the seeded admin credentials\n- Head to /admin/posts to edit this post or create a new one\n- Update your site settings at /admin/settings\n`,
      coverImage: '',
      coverImageAlt: '',
      author: admin._id,
      category: categories[0]._id,
      tags: [tags[0]._id, tags[1]._id],
      status: 'published',
      isFeatured: true,
      publishedAt: new Date(),
      readingTimeMinutes: 2,
      metaTitle: 'Welcome to The Ledger',
      metaDescription: 'A quick tour of what this publication is about and what to expect.',
    });
    console.log('Created sample post: welcome-to-the-ledger');
  }

  console.log('Seed complete.');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
