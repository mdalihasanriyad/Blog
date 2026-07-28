export default function PostCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-4 aspect-[16/10] rounded-lg bg-ink-100 dark:bg-ink-800" />
      <div className="mb-2 h-4 w-20 rounded bg-ink-100 dark:bg-ink-800" />
      <div className="mb-2 h-6 w-full rounded bg-ink-100 dark:bg-ink-800" />
      <div className="h-4 w-3/4 rounded bg-ink-100 dark:bg-ink-800" />
    </div>
  );
}
