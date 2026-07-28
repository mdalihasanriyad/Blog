'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

export default function MediaUploader() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      toast.success('Image uploaded');
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <label
      htmlFor="media-upload"
      className="flex w-fit cursor-pointer items-center gap-2 rounded-md bg-ink-800 px-4 py-2
        font-body text-sm font-medium text-paper hover:bg-ink-700 dark:bg-amber dark:text-ink-900"
    >
      <UploadCloud size={16} />
      {uploading ? 'Uploading…' : 'Upload image'}
      <input
        id="media-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />
    </label>
  );
}
