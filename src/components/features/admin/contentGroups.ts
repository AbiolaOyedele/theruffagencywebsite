import * as defaults from '@/content/site';

/**
 * The site's copy, arranged the way someone thinks about the site.
 *
 * `content/site.ts` is organised for the code — one export per thing a
 * component imports. That is the wrong order for a person, who wants "the home
 * page" rather than six exports that happen to render on it. This is the
 * translation, and it is exhaustive on purpose: a check below fails the build
 * if a content export is missing here, so a new section cannot quietly become
 * uneditable.
 */

export interface ContentEntry {
  readonly key: keyof typeof defaults;
  readonly label: string;
  readonly description: string;
}

export interface ContentSection {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly entries: readonly ContentEntry[];
}

export const CONTENT_SECTIONS: readonly ContentSection[] = [
  {
    id: 'identity',
    title: 'Brand and search',
    description: 'The studio’s own details, and what a search result or a shared link says.',
    entries: [
      { key: 'brand', label: 'Brand', description: 'Name, addresses, the one call to action' },
      { key: 'seo', label: 'Search and previews', description: 'Page title, description, keywords' },
    ],
  },
  {
    id: 'home',
    title: 'Home page',
    description: 'Each block of the page, in the order a visitor meets it.',
    entries: [
      { key: 'hero', label: 'Hero', description: 'The headline, rotating words and phone card' },
      { key: 'logoStrip', label: 'Client strip', description: 'The marquee under the hero' },
      { key: 'statementWords', label: 'Scroll statement', description: 'The line that fills as you scroll' },
      { key: 'services', label: 'Services', description: 'The pinned cards' },
      { key: 'work', label: 'Work', description: 'Headings around the client stories' },
      { key: 'blogSection', label: 'Writing', description: 'Headings around the archive' },
      { key: 'pricing', label: 'Pricing', description: 'Plans and what each includes' },
      { key: 'faq', label: 'FAQ', description: 'Questions and answers, also used for search markup' },
    ],
  },
  {
    id: 'chrome',
    title: 'Navigation and footer',
    description: 'The links that appear on every screen.',
    entries: [
      { key: 'sectionLinks', label: 'Nav links', description: 'The pill at the top' },
      { key: 'footerLinks', label: 'Footer links', description: 'Company and section columns' },
      { key: 'socialLinks', label: 'Social accounts', description: 'An empty address hides the icon' },
    ],
  },
  {
    id: 'stories',
    title: 'Client stories',
    description: 'The case studies and the furniture around them.',
    entries: [
      { key: 'caseStudies', label: 'Case studies', description: 'Every client engagement' },
      { key: 'caseStudyChrome', label: 'Story chrome', description: 'Copy shared by every story page' },
      { key: 'storyCardLayouts', label: 'Card layout', description: 'Where each fanned card sits' },
    ],
  },
  {
    id: 'writing',
    title: 'Writing',
    description: 'The posts themselves.',
    entries: [
      { key: 'blogPosts', label: 'Posts', description: 'Newest first. Drafts are held back by their flag' },
    ],
  },
  {
    id: 'panels',
    title: 'Panels',
    description: 'The surfaces that open over the page, and are also pages of their own.',
    entries: [
      { key: 'contactPage', label: 'Enquiry', description: 'The wizard, its questions and the agent card' },
      { key: 'careersPage', label: 'Careers', description: 'Openings notice and the talent form' },
      { key: 'cookieBanner', label: 'Cookie banner', description: 'The notice at the foot' },
    ],
  },
  {
    id: 'legal',
    title: 'Legal',
    description: 'Both carry a date that has to be updated when the text changes.',
    entries: [
      { key: 'privacyPolicy', label: 'Privacy policy', description: '' },
      { key: 'termsOfService', label: 'Terms of service', description: '' },
    ],
  },
  {
    id: 'other',
    title: 'Everything else',
    description: 'Smaller lists the site reads but no section owns.',
    entries: [
      { key: 'toolStackLogos', label: 'Tool logos', description: 'The marks tumbling in the workflow card' },
    ],
  },
];

export const ALL_ENTRIES: readonly ContentEntry[] = CONTENT_SECTIONS.flatMap((s) => s.entries);

export function findEntry(key: string): ContentEntry | undefined {
  return ALL_ENTRIES.find((entry) => entry.key === key);
}

/**
 * Every export of `content/site.ts` must appear above.
 *
 * A compile-time check rather than a comment asking someone to remember: if a
 * new content export is added and not placed in a section, this stops being
 * assignable and the build says so.
 */
type Mapped = (typeof ALL_ENTRIES)[number]['key'];
type Unmapped = Exclude<keyof typeof defaults, Mapped>;
export const UNMAPPED_CONTENT_KEYS: readonly Unmapped[] = [];
