import { color } from '@/config/tokens';
import type {
  CaseStudy,
  ClientLogo,
  FaqItem,
  Feature,
  LegalSection,
  NavLink,
  PricingPlan,
} from '@/types/content';

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */

export const brand = {
  name: 'The Ruff Agency',
  shortName: 'Ruff',
  legalName: 'The Ruff Agency',
  email: 'hi@theruff.agency',
  tagline: ['Brand & creative,', 'made to launch.'],
  copyright: '© 2026 The Ruff Agency. All rights reserved.',
  bookACallUrl: 'https://calendar.app.google/tU2SHfJjpBd56rmx7',
  /** TODO: confirm which platform this should point at. */
  socialUrl: '',
  socialLabel: 'LinkedIn',
  basedIn: ['Lagos, Nigeria', 'Working remotely with clients worldwide'],
} as const;

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const sectionLinks: readonly NavLink[] = [
  { label: 'Services', targetId: 'services' },
  { label: 'Work', targetId: 'work' },
  { label: 'Pricing', targetId: 'pricing' },
];

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const hero = {
  /** One entry per rendered line. The break is deliberate, not a wrap. */
  headline: ['Skip the', 'guessing.', 'Build a brand.'],
  /** The single word set in the Didone italic, wherever it appears above. */
  headlineAccent: 'brand.',
  rotatingWords: [
    'Brand',
    'Campaign',
    'Identity',
    'Content',
    'Launch',
    'Strategy',
    'Story',
    'Motion',
  ],
  /**
   * Wraps the rotating word. On desktop the whole line is forced onto one
   * unbroken row, so before + longest word + after must stay under ~65
   * characters.
   */
  subheadBefore: 'We turn your ',
  subheadAfter: ' into a brand people remember.',
  notification: {
    eyebrow: 'Consider it handled',
    title: 'Your next campaign, delivered.',
  },
} as const;

/* ------------------------------------------------------------------ */
/* Logo strip                                                          */
/* ------------------------------------------------------------------ */

/**
 * Only clients cleared for public use appear here.
 *
 * No `src` yet, so each renders as a wordmark rather than borrowing another
 * company's mark. Drop in a logo file and the strip picks it up.
 */
export const logoStrip = {
  label: "Some of the teams we've worked with.",
  logos: [
    { name: 'Teemplot' },
    { name: 'IPC Africa' },
    { name: 'Zero to 16' },
  ] as readonly ClientLogo[],
};

/* ------------------------------------------------------------------ */
/* Scroll-scrubbed statement                                           */
/* ------------------------------------------------------------------ */

export const statementWords: readonly string[] = [
  'Building',
  'a',
  'brand',
  'takes',
  'strategy.',
  'Earning',
  'trust',
  'takes',
  'proof.',
  'Ruff',
  'brings',
  'both.',
  'Thirty',
  'plus',
  'campaigns.',
  'Real',
  'sectors.',
  'Real',
  'results.',
];

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */

export const services = {
  navLabel: 'Services',
  items: [
    {
      title: 'We start with strategy',
      description:
        'Before a single visual, we map your market, your audience, and what makes you worth choosing.',
      icon: '/assets/83f5508eeeebc94fff7e8755d7f494e548438dfb.svg',
      video: '/card1-designer.mp4',
    },
    {
      title: 'Creative direction that fits',
      description:
        'Every idea is built around your brand, not a template. Concepts you can actually ship.',
      icon: '/assets/designrequest.svg',
      video: '/card2.mp4',
    },
    {
      title: 'Design, motion, and content',
      description:
        'From identity systems to short-form video, one team builds it, so nothing gets lost in handoff.',
      icon: '/assets/delivery.svg',
    },
    {
      title: 'Built into your workflow',
      description:
        'Slack, Notion, Figma, whatever you run on. We work inside it, not around it.',
      icon: '/assets/embedded.svg',
    },
    {
      title: 'Delivered, ready to launch',
      description: 'Every project comes with a plan for how to launch it.',
      icon: '/assets/budget.svg',
    },
  ] satisfies readonly Feature[],
} as const;

/** Tool logos tumbling inside the "Built into your workflow" card. */
export const toolStackLogos: readonly string[] = Array.from(
  { length: 12 },
  (_unused, index) => `/stack/tool-${index}.png`,
);

/* ------------------------------------------------------------------ */
/* Work                                                                */
/* ------------------------------------------------------------------ */

export const work = {
  headline: ['Real work,', 'real results.'],
  campaignCount: 30,
  subheadBefore: 'Our designers have worked on ',
  subheadAfter:
    ' campaigns across SaaS, food, fashion, startups, tech, and procurement.',
  cardCta: 'Read the story',
  statLabels: {
    duration: 'Duration',
    deliverables: 'Deliverables',
    impact: 'Impact',
  },
} as const;

/**
 * Client engagements.
 *
 * TODO — awaiting content from the clients themselves: quote, duration,
 * deliverables, impact, the four narrative sections, tickets and gallery.
 * A card stays a name-only tile until `sections` is filled in; nothing is
 * written on a client's behalf.
 */
/**
 * Placeholder narrative, shown so the case-study layout can be reviewed before
 * the real write-ups arrive. Every study carrying `placeholder: true` renders a
 * banner saying so — remove the flag once real copy replaces this.
 */
function placeholderStory(client: string) {
  return {
    placeholder: true,
    title: 'The outcome headline goes here',
    summary:
      'One sentence on what was delivered — the shape of the work, in the client’s language rather than ours. Around 140 characters.',
    quote:
      'A short testimonial from the client goes here. One or two sentences, in their own words, about what working together was actually like.',
    authorName: 'Name',
    authorRole: 'Role',
    duration: '12 weeks',
    deliverables: '30+ assets',
    impact: 'The headline outcome goes here — one measurable result.',
    credits: [{ name: 'Name', role: 'Creative Lead' }],
    sections: [
      {
        heading: 'The context',
        body: `Who ${client} are and what they were building when we came in. The market they operate in, who they are trying to reach, and the state of their brand at the start. Around 80–120 words.`,
      },
      {
        heading: 'The problem',
        body: 'What was actually getting in the way — not a list of missing features, but the underlying reason the brand was not landing. This is the section that earns the reader’s attention, so it should be specific and honest. Around 120–200 words.',
      },
      {
        heading: 'What we did',
        body: 'The work itself, in the order it happened: strategy, creative direction, then production. Name the deliverables and the decisions behind them rather than listing outputs. Around 150–200 words.',
      },
      {
        heading: 'The impact',
        body: 'What changed as a result, stated plainly. Numbers where they exist, and where they do not, the concrete difference the client can point to. Around 80–120 words.',
      },
    ],
    tickets: [
      {
        title: 'A representative brief goes here',
        request:
          'The request in the client’s own voice — what they asked for, what they were worried about, and what a good outcome looked like to them. Around 60 words.',
      },
      {
        title: 'A second brief, showing range',
        request:
          'Pick briefs that show different parts of the offer: one strategic, one craft-led, one that shows how a tricky constraint was handled.',
      },
      {
        title: 'A third brief, showing depth',
        request:
          'The point of this section is to show how Ruff works, not just what it produced. Keep the client’s framing intact.',
      },
    ],
  };
}

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: 'teemplot',
    client: 'Teemplot',
    accent: color.accentPink,
    collaboration: 'Ruff × Teemplot',
    video: '/card-alpa.mp4',
    ...placeholderStory('Teemplot'),
  },
  {
    slug: 'ipc-africa',
    client: 'IPC Africa',
    accent: color.accentPink,
    collaboration: 'Ruff × IPC Africa',
    video: '/card-alpin.mp4',
    ...placeholderStory('IPC Africa'),
  },
  {
    slug: 'zero-to-16',
    client: 'Zero to 16',
    accent: color.accentPink,
    collaboration: 'Ruff × Zero to 16',
    video: '/card-winter.mp4',
    ...placeholderStory('Zero to 16'),
  },
];

/** Position of each fanned card inside the pinned work section. */
export const storyCardLayouts = [
  { x: 18, y: 22, rotation: -12, from: 'left', enterAt: 0 },
  { x: 62, y: 20, rotation: 10, from: 'right', enterAt: 0.3 },
  { x: 38, y: 42, rotation: 2, from: 'left', enterAt: 0.6 },
] as const;

/** Copy that is the same on every case-study page. */
export const caseStudyChrome = {
  back: '← Back',
  workHeading: 'Selected work',
  ticketsHeading: 'Selected briefs',
  ctaHeading: 'Want results like these?',
  ctaBody: "Book a call and we'll match you with the right creative lead.",
  ctaButton: 'Book a call',
} as const;

/* ------------------------------------------------------------------ */
/* Pricing                                                             */
/* ------------------------------------------------------------------ */

export const pricing = {
  headline: 'Simple, honest pricing.',
  plans: [
    {
      name: 'Project',
      /** TODO: replace with the detailed pricing structure. */
      price: 'From ₦150,000',
      description:
        'A single, well-scoped project, from brand strategy to launch-ready creative.',
      features: [
        { icon: '/assets/designrequest.svg', label: 'Defined scope & timeline' },
        { icon: '/assets/face-content.svg', label: 'Dedicated creative lead' },
        { icon: '/assets/budget.svg', label: 'Fixed project price' },
        { icon: '/assets/webcam-02.svg', label: 'Milestone check-ins' },
        { icon: '/assets/delivery.svg', label: 'Built-in revisions' },
        { icon: '/assets/full design ownership.svg', label: 'Launch-ready files' },
      ],
    },
    {
      name: 'Retainer',
      price: 'Custom',
      description:
        'Ongoing brand, content, and creative support for teams that need a steady hand.',
      features: [
        { icon: '/assets/designrequest.svg', label: 'Ongoing scope, monthly' },
        { icon: '/assets/face-content.svg', label: 'Dedicated creative lead' },
        { icon: '/assets/budget.svg', label: 'Predictable monthly rate' },
        { icon: '/assets/webcam-02.svg', label: 'Weekly check-ins' },
        { icon: '/assets/delivery.svg', label: 'Ongoing creative support' },
        { icon: '/assets/pause-circle.svg', label: 'Pause or end anytime' },
      ],
    },
  ] satisfies readonly PricingPlan[],
} as const;

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export const faq = {
  headline: 'Frequently asked questions',
  subhead: 'Everything you need to know before getting started.',
  items: [
    {
      question: 'How much does a project cost?',
      answer:
        "Projects start from ₦150,000, depending on scope. Book a call and we'll send a clear quote before any work begins.",
    },
    {
      question: 'We already have a design team. Can you still help?',
      answer:
        'Yes. We plug into your existing workflow and tools, working as an extension of your team rather than a replacement.',
    },
    {
      question: 'Who will work on my project?',
      answer:
        'A dedicated creative lead who owns your project from strategy through delivery, backed by our full team for design, motion, and content.',
    },
    {
      question: 'What can you help with?',
      answer:
        'Brand strategy, creative direction, social content, and motion and video, from a single campaign to an ongoing retainer.',
    },
    {
      question: 'How fast can we start?',
      answer:
        "Most projects kick off within a week of your first call. Tell us what you need and we'll scope it from there.",
    },
  ] satisfies readonly FaqItem[],
} as const;

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export const footerLinks = {
  links: [
    { label: 'Services', targetId: 'services' },
    { label: 'Work', targetId: 'work' },
    { label: 'FAQ', targetId: 'faq' },
  ] satisfies readonly NavLink[],
  company: [
    { label: 'Contact', overlay: 'contact' },
    { label: 'Privacy Policy', overlay: 'privacy' },
    { label: 'Terms', overlay: 'terms' },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Cookie consent                                                      */
/* ------------------------------------------------------------------ */

export const cookieBanner = {
  title: 'Good work starts with understanding.',
  body: 'We use analytics cookies to understand how you use this site. Nothing more.',
  reject: 'Reject',
  accept: 'Accept',
} as const;

/* ------------------------------------------------------------------ */
/* Overlays: Contact / Privacy / Terms                                 */
/* ------------------------------------------------------------------ */

export const contact = {
  title: 'Contact',
  intro:
    "We'd love to hear about your project. Whether you have a brand to build, a campaign to launch, or just a question, reach out anytime.",
  bookACallLabel: 'Schedule an intro call',
} as const;

export const privacyPolicy = {
  title: 'Privacy Policy',
  updated: 'Last updated: April 2026',
  sections: [
    {
      heading: '1. Introduction',
      body: 'The Ruff Agency ("we", "us", "our") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website or use our services.',
    },
    {
      heading: '2. Information we collect',
      body: 'We may collect the following types of information: contact information (name, email address) when you fill out a form or contact us; usage data such as pages visited, time spent, and browser type collected through analytics tools; cookies and similar tracking technologies to improve your experience on our website.',
    },
    {
      heading: '3. How we use your information',
      body: 'We use your information to respond to your inquiries and provide our services; improve our website and user experience; send you relevant communications (only with your consent); comply with legal obligations.',
    },
    {
      heading: '4. Cookies',
      body: 'Our website uses cookies to analyze traffic. You can choose to accept or reject cookies when first visiting our site. You can also manage cookie preferences in your browser settings at any time.',
    },
    {
      heading: '5. Data sharing',
      body: 'We do not sell, trade, or rent your personal data. We may share information with trusted third-party services (such as analytics or email providers) that help us operate our business, subject to confidentiality agreements.',
    },
    {
      heading: '6. Data retention',
      body: 'We retain personal data only for as long as necessary to fulfill the purposes for which it was collected, or as required by law.',
    },
    {
      heading: '7. Your rights',
      body: 'Under applicable data protection laws, including the Nigeria Data Protection Act, you have the right to access, correct, or delete your personal data; withdraw consent at any time; request data portability; lodge a complaint with a supervisory authority. To exercise any of these rights, contact us at hi@theruff.agency.',
    },
    {
      heading: '8. Security',
      body: 'We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, or destruction.',
    },
    {
      heading: '9. Changes to this policy',
      body: 'We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date.',
    },
  ] satisfies readonly LegalSection[],
} as const;

export const termsOfService = {
  title: 'Terms of Service',
  updated: 'Last updated: April 2026',
  sections: [
    {
      heading: '1. Overview',
      body: 'These terms of service ("Terms") govern your use of The Ruff Agency website and services. By accessing or using our services, you agree to be bound by these Terms.',
    },
    {
      heading: '2. Services',
      body: 'The Ruff Agency provides brand strategy, creative direction, design, motion, and content services on a project or retainer basis. The scope, deliverables, and timeline for each engagement are agreed upon between both parties before work begins.',
    },
    {
      heading: '3. Projects and retainers',
      body: 'Project work is scoped and priced before it starts. Retainers are billed on a recurring monthly basis and may be paused or ended with notice as agreed in your engagement letter.',
    },
    {
      heading: '4. Intellectual property',
      body: 'Upon full payment, all deliverables created during an engagement are transferred to the client. Until payment is received, The Ruff Agency retains ownership of all work produced. We reserve the right to showcase completed work in our portfolio unless otherwise agreed in writing.',
    },
    {
      heading: '5. Confidentiality',
      body: 'We treat all client information, business data, and project details as confidential. We will not disclose any confidential information to third parties without your prior written consent, except as required by law.',
    },
    {
      heading: '6. Payment terms',
      body: 'Invoices are issued as agreed at the start of each engagement or billing cycle. Payment is due within 14 days of invoice date unless otherwise specified. Late payments may result in suspension of services.',
    },
    {
      heading: '7. Limitation of liability',
      body: 'The Ruff Agency shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid by the client in the 3 months preceding the claim.',
    },
    {
      heading: '8. Termination',
      body: 'Either party may terminate an engagement with 14 days written notice. Upon termination, the client is responsible for payment of all work completed up to the termination date.',
    },
    {
      heading: '9. Governing law',
      body: 'These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Lagos, Nigeria.',
    },
    {
      heading: '10. Changes',
      body: 'We reserve the right to modify these Terms at any time. Updated Terms will be posted on our website. Continued use of our services after changes constitutes acceptance of the revised Terms.',
    },
  ] satisfies readonly LegalSection[],
} as const;
