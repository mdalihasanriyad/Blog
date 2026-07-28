'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import { Plus, Trash2, UploadCloud } from 'lucide-react';
import { postSchema, type PostFormValues } from '@/lib/validations/post';
import { createPost, updatePost } from '@/actions/post.actions';
import { toSlug } from '@/lib/utils';

interface Option {
  id: string;
  name: string;
}

interface PostFormProps {
  categories: Option[];
  tags: Option[];
  initialData?: (Partial<PostFormValues> & { _id?: string }) | null;
}

const inputClass =
  'w-full rounded-md border border-ink-200 bg-paper px-3 py-2 font-body text-sm text-ink-800 focus:border-amber dark:border-ink-600 dark:bg-ink-800 dark:text-paper';
const labelClass = 'mb-1 block font-body text-sm font-medium text-ink-700 dark:text-ink-100';

export default function PostForm({ categories, tags, initialData }: PostFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData?._id);
  const [uploading, setUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(isEditing);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: '',
      coverImageAlt: '',
      category: categories[0]?.id ?? '',
      tags: [],
      status: 'draft',
      isFeatured: false,
      metaTitle: '',
      metaDescription: '',
      canonicalUrl: '',
      ogImage: '',
      keywords: [],
      faq: [],
      noIndex: false,
      ...initialData,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'faq' });
  const coverImage = watch('coverImage');
  const status = watch('status');
  const title = watch('title');

  const onTitleChange = (value: string) => {
    setValue('title', value);
    if (!slugTouched) setValue('slug', toSlug(value));
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      setValue('coverImage', data.url);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: PostFormValues) => {
    const result = isEditing
      ? await updatePost(initialData!._id!, values)
      : await createPost(values);

    if (result.success) {
      toast.success(isEditing ? 'Post updated' : 'Post created');
      router.push('/admin/posts');
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-8 lg:grid-cols-[1fr_340px]">
      {/* Main content column */}
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className={labelClass}>Title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className={inputClass}
          />
          {errors.title && <p className="mt-1 font-mono text-xs text-brick">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="slug" className={labelClass}>Slug</label>
          <input
            id="slug"
            {...register('slug')}
            onChange={(e) => {
              setSlugTouched(true);
              setValue('slug', e.target.value);
            }}
            className={inputClass}
          />
          {errors.slug && <p className="mt-1 font-mono text-xs text-brick">{errors.slug.message}</p>}
        </div>

        <div>
          <label htmlFor="excerpt" className={labelClass}>Excerpt</label>
          <textarea id="excerpt" rows={2} {...register('excerpt')} className={inputClass} />
          {errors.excerpt && <p className="mt-1 font-mono text-xs text-brick">{errors.excerpt.message}</p>}
        </div>

        <div>
          <label htmlFor="content" className={labelClass}>Content (Markdown)</label>
          <textarea
            id="content"
            rows={20}
            {...register('content')}
            className={`${inputClass} font-mono text-[13px] leading-relaxed`}
            placeholder={'## Introduction\n\nWrite in Markdown — headings, code blocks, lists, and images are all supported.'}
          />
          {errors.content && <p className="mt-1 font-mono text-xs text-brick">{errors.content.message}</p>}
        </div>

        {/* SEO section */}
        <fieldset className="rounded-lg border border-ink-100 p-4 dark:border-ink-700">
          <legend className="px-1 font-mono text-xs uppercase tracking-widest text-ink-400">SEO</legend>
          <div className="space-y-4">
            <div>
              <label htmlFor="metaTitle" className={labelClass}>Meta title</label>
              <input id="metaTitle" {...register('metaTitle')} className={inputClass} maxLength={70} />
            </div>
            <div>
              <label htmlFor="metaDescription" className={labelClass}>Meta description</label>
              <textarea id="metaDescription" rows={2} {...register('metaDescription')} className={inputClass} maxLength={160} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="canonicalUrl" className={labelClass}>Canonical URL</label>
                <input id="canonicalUrl" {...register('canonicalUrl')} className={inputClass} placeholder="https://…" />
              </div>
              <div>
                <label htmlFor="ogImage" className={labelClass}>OG image URL</label>
                <input id="ogImage" {...register('ogImage')} className={inputClass} placeholder="https://…" />
              </div>
            </div>
            <label className="flex items-center gap-2 font-body text-sm text-ink-700 dark:text-ink-100">
              <input type="checkbox" {...register('noIndex')} className="rounded border-ink-300" />
              Exclude from search engines (noindex)
            </label>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-ink-400">FAQ schema</span>
              <button
                type="button"
                onClick={() => append({ question: '', answer: '' })}
                className="flex items-center gap-1 font-mono text-xs text-amber-dark hover:underline"
              >
                <Plus size={12} /> Add question
              </button>
            </div>
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="rounded-md border border-ink-100 p-3 dark:border-ink-700">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-xs text-ink-400">Q{index + 1}</span>
                    <button type="button" onClick={() => remove(index)} className="text-ink-400 hover:text-brick">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input
                    placeholder="Question"
                    {...register(`faq.${index}.question` as const)}
                    className={`${inputClass} mb-2`}
                  />
                  <textarea
                    placeholder="Answer"
                    rows={2}
                    {...register(`faq.${index}.answer` as const)}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </div>
        </fieldset>
      </div>

      {/* Sidebar column */}
      <div className="space-y-6">
        <div className="rounded-lg border border-ink-100 p-4 dark:border-ink-700">
          <label htmlFor="status" className={labelClass}>Status</label>
          <select id="status" {...register('status')} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>

          {status === 'scheduled' && (
            <div className="mt-3">
              <label htmlFor="scheduledAt" className={labelClass}>Publish at</label>
              <input id="scheduledAt" type="datetime-local" {...register('scheduledAt')} className={inputClass} />
            </div>
          )}

          <label className="mt-3 flex items-center gap-2 font-body text-sm text-ink-700 dark:text-ink-100">
            <input type="checkbox" {...register('isFeatured')} className="rounded border-ink-300" />
            Featured post
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full rounded-md bg-ink-800 py-2.5 font-body text-sm font-medium text-paper
              transition-colors hover:bg-ink-700 disabled:opacity-60 dark:bg-amber dark:text-ink-900"
          >
            {isSubmitting ? 'Saving…' : isEditing ? 'Save changes' : 'Create post'}
          </button>
        </div>

        <div className="rounded-lg border border-ink-100 p-4 dark:border-ink-700">
          <label className={labelClass}>Cover image</label>
          {coverImage && (
            <div className="relative mb-3 aspect-video overflow-hidden rounded-md">
              <Image src={coverImage} alt="Cover preview" fill className="object-cover" />
            </div>
          )}
          <label
            htmlFor="cover-upload"
            className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed
              border-ink-200 py-3 font-body text-sm text-ink-500 hover:border-amber dark:border-ink-600"
          >
            <UploadCloud size={16} />
            {uploading ? 'Uploading…' : 'Upload image'}
          </label>
          <input
            id="cover-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
          />
          <input
            {...register('coverImageAlt')}
            placeholder="Alt text (for SEO & accessibility)"
            className={`${inputClass} mt-3`}
          />
        </div>

        <div className="rounded-lg border border-ink-100 p-4 dark:border-ink-700">
          <label htmlFor="category" className={labelClass}>Category</label>
          <select id="category" {...register('category')} className={inputClass}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.category && <p className="mt-1 font-mono text-xs text-brick">{errors.category.message}</p>}

          <label className={`${labelClass} mt-4`}>Tags</label>
          <div className="flex max-h-40 flex-col gap-1 overflow-y-auto">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center gap-2 font-body text-sm text-ink-700 dark:text-ink-100">
                <input type="checkbox" value={tag.id} {...register('tags')} className="rounded border-ink-300" />
                {tag.name}
              </label>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
