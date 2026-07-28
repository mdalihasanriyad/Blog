import { MDXRemote } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div id="article-body" className="prose prose-lg max-w-none dark:prose-invert">
      <MDXRemote
        source={content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: 'wrap' }],
              rehypeHighlight,
            ],
          },
        }}
      />
    </div>
  );
}
