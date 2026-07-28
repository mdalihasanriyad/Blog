import { connectDB } from '@/lib/db';
import Category from '@/models/Category';
import CategoryForm from '@/components/admin/CategoryForm';
import DeleteButton from '@/components/admin/DeleteButton';
import { deleteCategory } from '@/actions/taxonomy.actions';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminCategoriesPage() {
  await connectDB();
  const categories = await Category.find().sort({ name: 1 }).lean();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink-800 dark:text-paper">Categories</h1>

      <CategoryForm
        parentOptions={categories.map((c) => ({ id: c._id.toString(), name: c.name }))}
      />

      <div className="mt-6 overflow-hidden rounded-lg border border-ink-100 dark:border-ink-700">
        <table className="w-full text-left">
          <thead className="bg-paper-dim dark:bg-ink-800">
            <tr className="font-mono text-xs uppercase tracking-widest text-ink-400">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 bg-paper dark:divide-ink-700 dark:bg-ink-900">
            {categories.map((c) => (
              <tr key={c._id.toString()}>
                <td className="px-4 py-3 font-body text-sm text-ink-800 dark:text-paper">{c.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-400">/{c.slug}</td>
                <td className="px-4 py-3 text-right">
                  <DeleteButton id={c._id.toString()} label={c.name} action={deleteCategory} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <p className="p-6 text-center font-body text-sm text-slate">No categories yet.</p>
        )}
      </div>
    </div>
  );
}
