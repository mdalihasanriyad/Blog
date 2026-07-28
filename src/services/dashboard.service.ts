import 'server-only';
import { connectDB } from '@/lib/db';
import Post from '@/models/Post';
import Comment from '@/models/Comment';
import Subscriber from '@/models/Subscriber';
import Contact from '@/models/Contact';

export async function getDashboardStats() {
  await connectDB();

  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    totalViewsAgg,
    pendingComments,
    totalSubscribers,
    newContacts,
    topPosts,
  ] = await Promise.all([
    Post.countDocuments(),
    Post.countDocuments({ status: 'published' }),
    Post.countDocuments({ status: 'draft' }),
    Post.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
    Comment.countDocuments({ status: 'pending' }),
    Subscriber.countDocuments({ status: { $ne: 'unsubscribed' } }),
    Contact.countDocuments({ status: 'new' }),
    Post.find({ status: 'published' }).sort({ views: -1 }).limit(5).select('title slug views').lean(),
  ]);

  return {
    totalPosts,
    publishedPosts,
    draftPosts,
    totalViews: totalViewsAgg[0]?.total ?? 0,
    pendingComments,
    totalSubscribers,
    newContacts,
    topPosts: topPosts.map((p) => ({ title: p.title, slug: p.slug, views: p.views })),
  };
}
