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

/** How many posts fill one page of the archive. */
export const POSTS_PER_PAGE = 7;

/** The shape a card takes on the shelf. */
export type TileRole = 'lead' | 'stack' | 'wide' | 'leadRight' | 'stackLeft' | 'half';

/**
 * The shape of every card on one page, in order.
 *
 * A full page is seven: the opening block — a tall card beside two stacked —
 * then one running the full width, then the same block flipped, so the tall
 * card lands on the other side and the page reads as a pair of blocks rather
 * than a list.
 *
 * Shorter pages take the part of that arrangement which still balances. The
 * rule is that nothing is left stranded: a lone card takes the full width
 * rather than sitting in a half column with a gap beside it.
 */
const PAGE_SHAPES: readonly (readonly TileRole[])[] = [
  ['wide'],
  ['half', 'half'],
  ['lead', 'stack', 'stack'],
  ['lead', 'stack', 'stack', 'wide'],
  ['lead', 'stack', 'stack', 'half', 'half'],
  ['lead', 'stack', 'stack', 'wide', 'half', 'half'],
  ['lead', 'stack', 'stack', 'wide', 'leadRight', 'stackLeft', 'stackLeft'],
];

export function tileRoles(total: number): readonly TileRole[] {
  if (total <= 0) return [];
  return PAGE_SHAPES[Math.min(total, PAGE_SHAPES.length) - 1] ?? [];
}

/**
 * Where each tile lands on the two-column grid, mirroring what the CSS does.
 *
 * Needed because the ground a card gets depends on what ends up beside it, and
 * that cannot be known from its index alone — a tall opener sits next to the
 * card four places after it, not the one after it.
 */
function tilePlacements(roles: readonly TileRole[]): readonly { row: number; col: number }[][] {
  const taken = new Set<string>();
  const at = (row: number, col: number) => `${row}:${col}`;
  const free = (row: number, col: number) => !taken.has(at(row, col));

  return roles.map((role) => {
    let row = 0;

    if (role === 'lead') {
      while (!(free(row, 0) && free(row + 1, 0))) row += 1;
      taken.add(at(row, 0));
      taken.add(at(row + 1, 0));
      return [
        { row, col: 0 },
        { row: row + 1, col: 0 },
      ];
    }

    if (role === 'leadRight') {
      while (!(free(row, 1) && free(row + 1, 1))) row += 1;
      taken.add(at(row, 1));
      taken.add(at(row + 1, 1));
      return [
        { row, col: 1 },
        { row: row + 1, col: 1 },
      ];
    }

    if (role === 'stack') {
      while (!free(row, 1)) row += 1;
      taken.add(at(row, 1));
      return [{ row, col: 1 }];
    }

    if (role === 'stackLeft') {
      while (!free(row, 0)) row += 1;
      taken.add(at(row, 0));
      return [{ row, col: 0 }];
    }

    if (role === 'wide') {
      while (!(free(row, 0) && free(row, 1))) row += 1;
      taken.add(at(row, 0));
      taken.add(at(row, 1));
      return [
        { row, col: 0 },
        { row, col: 1 },
      ];
    }

    // half: the first free cell, reading left to right.
    for (;;) {
      if (free(row, 0)) {
        taken.add(at(row, 0));
        return [{ row, col: 0 }];
      }
      if (free(row, 1)) {
        taken.add(at(row, 1));
        return [{ row, col: 1 }];
      }
      row += 1;
    }
  });
}

/**
 * A ground for every tile on a page, such that no two that touch share one.
 *
 * Greedy, in reading order: each card takes the first accent none of its
 * already-placed neighbours has. Neighbours include diagonals, because a
 * corner-to-corner match still reads as a repeat, and the card immediately
 * before it, which is what a phone shows directly above it in one column.
 *
 * With four accents and at most a handful of neighbours there is always one
 * free; the modulo is a backstop that should never be reached.
 */
export function shelfAccents(roles: readonly TileRole[], palette: number): readonly number[] {
  const placements = tilePlacements(roles);
  const chosen: number[] = [];

  const touching = (a: readonly { row: number; col: number }[], b: typeof a): boolean =>
    a.some((one) => b.some((two) => Math.abs(one.row - two.row) <= 1 && Math.abs(one.col - two.col) <= 1));

  placements.forEach((cells, index) => {
    const blocked = new Set<number>();

    for (let other = 0; other < index; other += 1) {
      const neighbour = other === index - 1 || touching(cells, placements[other] ?? []);
      if (neighbour) blocked.add(chosen[other] as number);
    }

    const free = Array.from({ length: palette }, (_, i) => i).find((i) => !blocked.has(i));
    chosen.push(free ?? index % palette);
  });

  return chosen;
}

/** The posts on `page`, counting from one. */
export function pageOfPosts<T>(posts: readonly T[], page: number): readonly T[] {
  const start = (page - 1) * POSTS_PER_PAGE;
  return posts.slice(start, start + POSTS_PER_PAGE);
}

/** How many pages the archive runs to. Always at least one. */
export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
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
