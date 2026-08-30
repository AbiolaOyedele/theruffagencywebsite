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
