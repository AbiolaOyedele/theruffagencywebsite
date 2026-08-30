/** Shared content shapes. All site copy is typed against these. */

export interface NavLink {
  readonly label: string;
  readonly targetId: string;
}

export interface ClientLogo {
  readonly name: string;
  /**
   * Path to the client's logo file. Until one is supplied the name is set as a
   * wordmark instead, so the strip never borrows another company's mark.
   */
  readonly src?: string;
  readonly width?: number;
  readonly height?: number;
}

export interface Feature {
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  /** Looping video shown inside the card's media area, when the card has one. */
  readonly video?: string;
}

export interface PricingFeature {
  readonly icon: string;
  readonly label: string;
}

export interface PricingPlan {
  readonly name: string;
  readonly price: string;
  readonly description: string;
  readonly features: readonly PricingFeature[];
}

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export interface CaseStudySection {
  readonly heading: string;
  readonly body: string;
}

export interface CaseStudyTicket {
  readonly title: string;
  readonly request: string;
}

export interface CaseStudyCredit {
  readonly name: string;
  readonly role: string;
  readonly avatar?: string;
}

export interface CaseStudyGalleryItem {
  readonly src: string;
  readonly caption: string;
}

/**
 * A client engagement.
 *
 * Everything past `client` is optional on purpose: a card can sit on the page
 * with nothing but the client's name while its write-up is still being
 * gathered. `sections` is what decides whether the card opens a full page —
 * see `hasStory` below.
 */
export interface CaseStudy {
  readonly slug: string;
  /** The client, as they want to be named publicly. */
  readonly client: string;
  /** Palette colour this client's card takes in the fanned gallery. */
  readonly accent: string;
  /** Marks the write-up as placeholder so the page can say so. */
  readonly placeholder?: boolean;
  readonly collaboration?: string;
  readonly title?: string;
  readonly summary?: string;
  readonly quote?: string;
  readonly authorName?: string;
  readonly authorRole?: string;
  /** Looping footage for the card, once the client supplies it. */
  readonly video?: string;
  readonly logo?: string;
  readonly logoHeight?: number;
  /** Free text — "3 months", "6 weeks" — rather than a bare number. */
  readonly duration?: string;
  readonly deliverables?: string;
  readonly impact?: string;
  readonly credits?: readonly CaseStudyCredit[];
  readonly sections?: readonly CaseStudySection[];
  readonly tickets?: readonly CaseStudyTicket[];
  readonly gallery?: readonly CaseStudyGalleryItem[];
}

/** A case study only opens a page once there is a narrative to show. */
export function hasStory(study: CaseStudy): boolean {
  return (study.sections?.length ?? 0) > 0;
}

/* ------------------------------------------------------------------ */
/* Writing                                                             */
/* ------------------------------------------------------------------ */

/**
 * A blog post.
 *
 * Deliberately shaped like a case study: a post opens in the same panel, with
 * the same contents rail, narrative column and gallery, so the site has one
 * reading layout rather than two that drift apart.
 */
export interface BlogPost {
  readonly slug: string;
  readonly title: string;
  /** One sentence for the card, the meta description and link previews. */
  readonly excerpt: string;
  /** Grouping shown on the card — "Brand strategy", "Creative direction". */
  readonly category: string;
  /** ISO date, so it can be published as-is in metadata and JSON-LD. */
  readonly publishedAt: string;
  readonly author: { readonly name: string; readonly role: string };
  /** Card ground, taken from the accent palette. */
  readonly accent: string;
  /** Looping footage behind the panel's title, when the post has some. */
  readonly video?: string;
  readonly sections: readonly CaseStudySection[];
  readonly gallery?: readonly CaseStudyGalleryItem[];
  /**
   * Lines lifted out of the writing, pinned to the gallery on cards — the
   * same furniture a client story hangs its briefs on.
   */
  readonly pullQuotes?: readonly CaseStudyTicket[];
  /** Marks the writing as a draft the studio has not signed off yet. */
  readonly draft?: boolean;
}

/** Words a minute, for the reading estimate on a card. */
const READING_SPEED = 220;

/** Reading time for a post, to the nearest minute and never less than one. */
export function readingMinutes(post: BlogPost): number {
  const words = post.sections.reduce(
    (total, section) => total + section.body.trim().split(/\s+/).length,
    0,
  );
  return Math.max(1, Math.round(words / READING_SPEED));
}

/* ------------------------------------------------------------------ */
/* The reading panel                                                   */
/* ------------------------------------------------------------------ */

/**
 * What the expanding panel renders, whichever kind of thing opened it.
 *
 * Case studies and blog posts are different content with the same reading
 * shape, so both are mapped onto this rather than the panel learning about
 * either of them.
 */
export interface Story {
  /** Identifies the open panel; also the hash the URL carries. */
  readonly hash: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly ariaLabel: string;
  readonly video?: string;
  /** Heading above the people listed in the rail. */
  readonly bylineHeading: string;
  readonly credits: readonly CaseStudyCredit[];
  readonly sections: readonly CaseStudySection[];
  readonly tickets: readonly CaseStudyTicket[];
  /** Heading above the pinned cards, where they are listed rather than pinned. */
  readonly ticketsHeading: string;
  readonly gallery: readonly CaseStudyGalleryItem[];
  /** Where the gallery breaks the reading up, counted in sections. */
  readonly galleryAfterSection: number;
}

/** Maps a client engagement onto the reading panel. */
export function storyFromCaseStudy(study: CaseStudy): Story {
  return {
    hash: study.slug,
    eyebrow: study.collaboration ?? study.client,
    title: study.title ?? study.client,
    ariaLabel: `${study.client} story`,
    ...(study.video ? { video: study.video } : {}),
    bylineHeading: 'Team',
    credits: study.credits ?? [],
    sections: study.sections ?? [],
    tickets: study.tickets ?? [],
    ticketsHeading: 'Selected briefs',
    gallery: study.gallery ?? [],
    galleryAfterSection: 2,
  };
}

/** The hash a post's panel opens on. Namespaced so it cannot clash with a client. */
export function postHash(slug: string): string {
  return `writing/${slug}`;
}

/** Maps a post onto the reading panel. */
export function storyFromPost(post: BlogPost): Story {
  return {
    hash: postHash(post.slug),
    eyebrow: `${post.category} · ${formatPostDate(post.publishedAt)}`,
    title: post.title,
    ariaLabel: post.title,
    ...(post.video ? { video: post.video } : {}),
    bylineHeading: 'Written by',
    credits: [{ name: post.author.name, role: post.author.role }],
    sections: post.sections,
    tickets: post.pullQuotes ?? [],
    ticketsHeading: 'From the piece',
    gallery: post.gallery ?? [],
    galleryAfterSection: 1,
  };
}

/** A post's date, written the way the rest of the site writes dates. */
export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export interface LegalSection {
  readonly heading: string;
  readonly body: string;
}

/** One of the studio's social accounts. An empty `url` means "not live yet". */
export interface SocialLink {
  readonly platform: 'linkedin' | 'instagram' | 'tiktok' | 'threads' | 'x';
  readonly label: string;
  readonly url: string;
}

/** Which overlay panel is open, if any. */
export type OverlayKey = 'contact' | 'careers' | 'privacy' | 'terms';

/**
 * A footer link under "Company": either a route of its own, or one of the
 * reference panels that opens over the page.
 */
export type FooterCompanyLink =
  | { readonly label: string; readonly href: string }
  | { readonly label: string; readonly overlay: OverlayKey };
