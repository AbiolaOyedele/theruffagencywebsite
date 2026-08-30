import { redirect } from 'next/navigation';

/**
 * `/blog` is a real, linkable URL — it is where "Writing" has always pointed —
 * but the archive itself is one of the panels that opens over the page, the
 * same as contact and careers. This hands straight over to it.
 *
 * Individual posts are still pages of their own at `/blog/<slug>`, so anyone
 * arriving from a search reads the writing without needing the panel.
 */
export default function BlogIndexPage(): never {
  redirect('/#blog');
}
