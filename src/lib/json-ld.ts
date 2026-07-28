const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'The Ledger';

interface ArticleSchemaInput {
  title: string;
  description: string;
  slug: string;
  coverImage: string;
  authorName: string;
  publishedAt: string;
  updatedAt: string;
  categoryName: string;
}

export function articleJsonLd(input: ArticleSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    image: input.coverImage ? [input.coverImage] : undefined,
    datePublished: input.publishedAt,
    dateModified: input.updatedAt,
    author: { '@type': 'Person', name: input.authorName },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${input.slug}` },
    articleSection: input.categoryName,
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqJsonLd(faq: { question: string; answer: string }[]) {
  if (!faq.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
