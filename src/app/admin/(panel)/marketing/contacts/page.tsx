import { ContactsManager } from '@/components/features/admin/ContactsManager';
import { PageHeader } from '@/components/features/admin/ui';
import { requireAdmin } from '@/services/admin/auth';
import { listContacts, listSuppressions } from '@/repositories/contacts';

export default async function ContactsPage({ searchParams }: PageProps<'/admin/marketing/contacts'>) {
  const { q } = await searchParams;
  const search = typeof q === 'string' ? q : undefined;

  const { client } = await requireAdmin();
  const [{ rows, total }, suppressed] = await Promise.all([
    listContacts(client, { ...(search ? { search } : {}), limit: 200 }),
    listSuppressions(client),
  ]);

  return (
    <>
      <PageHeader
        title="Audience"
        description="Everyone the studio may write to, and everyone it may not. Anyone who sends an enquiry is added here automatically; imported lists have to say where they came from."
      />
      <ContactsManager
        contacts={[...rows]}
        total={total}
        suppressed={[...suppressed]}
        search={search ?? ''}
      />
    </>
  );
}
