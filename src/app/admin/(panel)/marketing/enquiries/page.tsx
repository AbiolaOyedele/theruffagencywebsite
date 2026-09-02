import { EnquiryList } from '@/components/features/admin/EnquiryList';
import { PageHeader } from '@/components/features/admin/ui';
import { requireAdmin } from '@/services/admin/auth';
import { listEnquiries } from '@/repositories/enquiries';

/**
 * The inbox.
 *
 * The forms still email the studio — that has not changed and is still the
 * thing that wakes someone up. This is the copy, so an enquiry can be found
 * again, marked as read, and answered from the same place the audience lives.
 */
export default async function EnquiriesPage() {
  const { client } = await requireAdmin();
  const enquiries = await listEnquiries(client, { limit: 200 });

  return (
    <>
      <PageHeader
        title="Enquiries"
        description="Briefs from the contact form and applications from the careers panel. Every one was also emailed to the studio when it arrived."
      />
      <EnquiryList enquiries={[...enquiries]} />
    </>
  );
}
