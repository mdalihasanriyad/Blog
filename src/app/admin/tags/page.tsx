import { connectDB } from '@/lib/db';
import Tag from '@/models/Tag';
import TagForm from '@/components/admin/TagForm';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteTag } from '@/actions/taxonomy.actions';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminTagsPage() {
  await connectDB();
  const tags = await Tag.find().sort({ name: 1 }).lean();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink-800 dark:text-paper">Tags</h1>
      <TagForm />

      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag._id.toString()}
            className="flex items-center gap-2 rounded-full border border-ink-100 px-3 py-1.5
              font-body text-sm text-ink-700 dark:border-ink-700 dark:text-ink-100"
          >
            #{tag.name}
            <DeleteButton id={tag._id.toString()} label={tag.name} action={deleteTag} />
          </span>
        ))}
        {tags.length === 0 && <p className="font-body text-sm text-slate">No tags yet.</p>}
      </div>
    </div>
  );
}
