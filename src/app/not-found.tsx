import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container-editorial flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-amber-dark dark:text-amber-light">
        404
      </p>
      <h1 className="mt-3 font-display text-display-lg font-semibold text-ink-800 dark:text-paper">
        This page wandered off.
      </h1>
      <p className="mt-3 max-w-md font-body text-slate dark:text-ink-200">
        The article or page you're looking for doesn't exist, or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-ink-800 px-5 py-2.5 font-body text-sm font-medium text-paper
          hover:bg-ink-700 dark:bg-amber dark:text-ink-900"
      >
        Back to homepage
      </Link>
    </div>
  );
}
