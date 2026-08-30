import { redirect } from 'next/navigation';

/**
 * `/careers` is a real, linkable URL, but the openings notice and the talent
 * form live in the panel that opens over the page, so this hands straight over.
 */
export default function CareersPage(): never {
  redirect('/#careers');
}
