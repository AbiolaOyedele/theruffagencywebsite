import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContentEditor } from '@/components/features/admin/ContentEditor';
import { PageHeader } from '@/components/features/admin/ui';
import { findEntry } from '@/components/features/admin/contentGroups';
import { contentDefaults, getContent, getContentOverrides } from '@/lib/content/resolve';

export default async function ContentGroupPage({ params }: PageProps<'/admin/content/[group]'>) {
  const { group } = await params;
  const entry = findEntry(group);
  if (!entry) notFound();

  const [content, overrides] = await Promise.all([getContent(), getContentOverrides()]);

  const current = (content as Record<string, unknown>)[group];
  const original = (contentDefaults as Record<string, unknown>)[group];

  return (
    <>
      <p className="mb-3 text-sm">
        <Link href="/admin/content" className="text-[#6b5a55] underline">
          ← Content
        </Link>
      </p>

      <PageHeader title={entry.label} description={entry.description} />

      <ContentEditor
        contentKey={group}
        initial={JSON.parse(JSON.stringify(current)) as unknown}
        original={JSON.parse(JSON.stringify(original)) as unknown}
        isOverridden={group in overrides}
      />
    </>
  );
}
