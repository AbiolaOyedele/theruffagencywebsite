/** Shared content shapes. All site copy is typed against these. */

export interface NavLink {
  readonly label: string;
  readonly targetId: string;
}

export interface ClientLogo {
  readonly name: string;
  readonly src: string;
  readonly width: number;
  readonly height: number;
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

export interface CaseStudyDesigner {
  readonly name: string;
  readonly role: string;
  readonly avatar: string;
}

export interface CaseStudyGalleryItem {
  readonly src: string;
  readonly caption: string;
}

export interface CaseStudy {
  readonly slug: string;
  readonly collaboration: string;
  readonly title: string;
  readonly summary: string;
  readonly quote: string;
  readonly authorName: string;
  readonly authorRole: string;
  readonly video: string;
  readonly logo: string;
  readonly logoHeight: number;
  readonly months: number;
  readonly tasks: number;
  readonly impact: string;
  readonly designers: readonly CaseStudyDesigner[];
  readonly sections: readonly CaseStudySection[];
  readonly tickets: readonly CaseStudyTicket[];
  readonly gallery: readonly CaseStudyGalleryItem[];
}

export interface LegalSection {
  readonly heading: string;
  readonly body: string;
}

/** Which overlay panel is open, if any. */
export type OverlayKey = 'contact' | 'privacy' | 'terms';

/** Which top-level view is rendered. */
export type SiteView = 'studio' | 'academy';
