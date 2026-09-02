import Link from 'next/link';
import { Badge, Card, PageHeader } from '@/components/features/admin/ui';
import { CONTENT_SECTIONS } from '@/components/features/admin/contentGroups';
import { getContentOverrides } from '@/lib/content/resolve';

export default async function ContentIndexPage() {
  const overrides = await getContentOverrides();

  return (
    <>
      <PageHeader
        title="Content"
        description="Every word on the public site. Anything you change here is stored as an override — the version in the repository stays untouched underneath, and you can put any section back to it in one click."
      />

      <div className="space-y-6">
        {CONTENT_SECTIONS.map((section) => (
          <Card key={section.id} title={section.title} description={section.description}>
            <ul className="divide-y divide-black/10">
              {section.entries.map((entry) => (
                <li key={entry.key}>
                  <Link
                    href={`/admin/content/${entry.key}`}
                    className="flex min-h-14 items-center justify-between gap-4 py-3 hover:opacity-70"
                  >
                    <span className="min-w-0">
                      <span className="block text-sm font-bold">{entry.label}</span>
                      {entry.description ? (
                        <span className="block text-xs text-[#6b5a55]">{entry.description}</span>
                      ) : null}
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      {entry.key in overrides ? <Badge>Edited</Badge> : null}
                      <span aria-hidden="true" className="text-[#6b5a55]">→</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
