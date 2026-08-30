import { redirect } from 'next/navigation';

/**
 * `/contact` is a real, linkable URL — the agent instructions send people here
 * — but the contact form itself lives in the panel that opens over the page,
 * so this hands straight over to it.
 */
export default function ContactPage(): never {
  redirect('/#contact');
}
