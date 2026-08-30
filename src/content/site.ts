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
  shortName: 'RUFF',
  legalName: 'THE RUFF AGENCY',
  email: 'hi@theruff.agency',
  tagline: ['Senior product design,', 'on demand.'],
  copyright: '© 2026 THE RUFF AGENCY. All rights reserved.',
  bookACallUrl: 'https://calendar.app.google/tU2SHfJjpBd56rmx7',
  linkedInUrl: 'https://www.linkedin.com/company/theruffagency/',
  basedIn: ['Annecy & Paris, France', 'Working remotely with clients worldwide'],
} as const;

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const viewTabs = ['Design Studio', 'Design Academy'] as const;

export const sectionLinks: readonly NavLink[] = [
  { label: 'How it works', targetId: 'how-it-works' },
  { label: 'Client stories', targetId: 'clientstories' },
  { label: 'Pricing', targetId: 'pricing' },
];

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export const hero = {
  headline: ['Pause hiring,', 'Start designing.'],
  rotatingWords: [
    'Mobile App',
    'SaaS',
    'Website',
    'Software',
    'Landing Pages',
    'Brand',
    'Product',
    'Flows',
  ],
  notification: {
    eyebrow: 'Get the job done',
    title: 'Your design has been delivered',
  },
} as const;

/* ------------------------------------------------------------------ */
/* Logo strip                                                          */
/* ------------------------------------------------------------------ */

export const logoStrip = {
  label: 'Our designers have been part of these teams.',
  logos: [
    {
      name: 'GoPro',
      src: '/assets/4749c967c7f8adfedb3d46b0d1431c47a4a6e817.webp',
      width: 124,
      height: 69,
    },
    {
      name: 'Gillette',
      src: '/assets/ea55a0a638beaab91dee0dbca6565714337197b1.webp',
      width: 124,
      height: 37,
    },
    {
      name: 'Revolut',
      src: '/assets/39949f69e900d50476534b8abec29b6bb7030c99.webp',
      width: 158,
      height: 105,
    },
    {
      name: 'Nespresso',
      src: '/assets/cf9789569f4d0ab00ff30680fc494f3416e9d992.webp',
      width: 163,
      height: 92,
    },
    {
      name: 'Alan',
      src: '/assets/f7e17e89fae89964272fc250d4fa15c376f4f99f.webp',
      width: 156,
      height: 69,
    },
  ] satisfies readonly ClientLogo[],
} as const;

/* ------------------------------------------------------------------ */
/* Scroll-scrubbed statement                                           */
/* ------------------------------------------------------------------ */

export const statementWords: readonly string[] = [
  'Finding',
  'a',
  'product',
  'designer',
  'takes',
  'months.',
  'Starting',
  'with',
  'RUFF',
  'takes',
  'minutes.',
  'Unlimited',
  'requests.',
  'Fixed',
  'monthly',
  'price.',
  'No',
  'commitment.',
];

/* ------------------------------------------------------------------ */
/* How it works                                                        */
/* ------------------------------------------------------------------ */

export const features: readonly Feature[] = [
  {
    title: 'Your designer, from day one',
    description:
      'A senior product designer fully dedicated to your company. Working like a founding designer, without the hiring process.',
    icon: '/assets/83f5508eeeebc94fff7e8755d7f494e548438dfb.svg',
    video: '/card1-designer.mp4',
  },
  {
    title: 'Unlimited design requests',
    description:
      'Submit as many tasks as you need. No per-task billing, no cap, no waiting list. Just continuous output.',
    icon: '/assets/designrequest.svg',
    video: '/card2.mp4',
  },
  {
    title: 'Delivered in 4 days or less',
    description:
      'Every task is delivered within 4 days. Your roadmap keeps moving, your product keeps shipping.',
    icon: '/assets/delivery.svg',
  },
  {
    title: 'Embedded in your workflow',
    description:
      'Slack, Jira, Notion, Figma, Linear. We plug into whatever you use and work like part of your team.',
    icon: '/assets/embedded.svg',
  },
  {
    title: 'Flexible and predictable',
    description:
      'One flat subscription. No surprises, no contracts. Pause or cancel anytime. Scale design up or down as you grow.',
    icon: '/assets/budget.svg',
  },
];

/** Tool logos tumbling inside the "Embedded in your workflow" card. */
export const toolStackLogos: readonly string[] = Array.from(
  { length: 12 },
  (_unused, index) => `/stack/tool-${index}.png`,
);

/* ------------------------------------------------------------------ */
/* Client stories                                                      */
/* ------------------------------------------------------------------ */

export const clientStories = {
  headline: ['Stories of', 'our clients.'],
  startupCount: 15,
  subheadBefore: "We've already helped ",
  subheadAfter:
    ' startups deliver products, features, and brands, to grow their business and raise money.',
} as const;

/**
 * Case studies.
 *
 * NOTE: these are placeholder engagements carried over from the reference
 * build. Replace the copy, logos, videos and screenshots with The Ruff
 * Agency's own work before this site goes live.
 */
export const caseStudies: readonly CaseStudy[] = [
  {
    slug: 'alpa',
    collaboration: 'RUFF x ALPA',
    title: 'From complex data to clear financial decisions',
    summary:
      'Rebuilt P&L and Cash Flow experiences, structured financial data into actionable layers, and redesigned onboarding flows.',
    quote:
      'They plugged straight into the team and started shipping. No ramp-up, no hand-holding, just senior design output from week one.',
    authorName: 'Mickael B.',
    authorRole: 'CEO',
    video: '/card-alpa.mp4',
    logo: '/assets/logo-alpa.png',
    logoHeight: 24,
    months: 3,
    tasks: 40,
    impact:
      'Structured and designed the product from MVP to commercial launch, supporting the company in raising $4M',
    designers: [
      { name: 'Samy', role: 'Product Designer', avatar: '/assets/avatar-samy.webp' },
    ],
    sections: [
      {
        heading: 'The context',
        body: 'Alpa is building a financial OS for the hospitality industry. They connect POS, banking, and supplier data to give restaurant operators a real-time understanding of their business. Ambitious product. Complex data. High expectations.',
      },
      {
        heading: 'The problem',
        body: "The product was powerful, but power without clarity doesn't scale. Financial data was dense and hard to read, key insights were buried in tables, multi-location logic was confusing, and onboarding created friction. Users weren't struggling because of missing features. They were struggling to understand what was already there. And when users don't understand, they don't trust. And when they don't trust, they don't act.",
      },
      {
        heading: 'What we did',
        body: 'We plugged into the team as a senior product design layer and started shipping immediately. No hiring. No onboarding time. No slowdown. Over 4 months, we rebuilt P&L and Cash Flow experiences from the ground up, structured financial data into readable and actionable layers, designed comparison systems for previous periods and budgets, simplified complex tables with hierarchy and grouping, redesigned POS & bank onboarding flows, clarified account and location attribution, introduced consistent UI patterns for financial data, designed notification and alert logic, and built first-time user guidance and contextual onboarding. Everything delivered ready-to-build, with clear rationale, async.',
      },
      {
        heading: 'The impact',
        body: "Users can read and understand their data instantly. Decisions are made faster, with more confidence. Onboarding friction was significantly reduced. Product consistency increased across the board. The team ships faster, without design bottlenecks. The product didn't just look better, it became usable at scale.",
      },
    ],
    tickets: [
      {
        title: 'Design the notification center and alert system',
        request:
          "We're adding notifications to the product, but we don't want to overwhelm users. We need a system that highlights what matters, prioritizes alerts, and fits naturally into the experience without cluttering the interface.",
      },
      {
        title: 'Redesign the P&L experience from the ground up',
        request:
          "Our current P&L isn't working. It's hard to read, hard to navigate, and users don't trust it. We need to rethink it entirely, structure, hierarchy, comparisons, and rebuild it into something clear, usable, and scalable for multi-location businesses.",
      },
      {
        title: 'Clarify bank account selection and allocation',
        request:
          'After connecting their bank, users often import too many accounts and assign them incorrectly. We need a clear flow to help them select the right accounts and map them properly to each location.',
      },
    ],
    gallery: [
      { src: '/assets/alpa-dashboard-today.webp', caption: 'Daily dashboard overview' },
      {
        src: '/assets/alpa-cashflow-notifications.webp',
        caption: 'Cash flow tracking with notifications',
      },
      {
        src: '/assets/alpa-onboarding-flow.webp',
        caption: 'Onboarding and transaction categorization',
      },
    ],
  },
  {
    slug: 'alpin-capital',
    collaboration: 'RUFF x ALPIN CAPITAL',
    title: 'From multi-layer complexity to a platform ready to scale',
    summary:
      'Delivered the brand, two ready-to-integrate versions of their B2C app, and the launch website, from scratch.',
    quote:
      'The collaboration was dynamic and we are more than satisfied with the results. The understanding of our needs was crystal clear, we can only recommend their services.',
    authorName: 'Mickaël B.',
    authorRole: 'CEO',
    video: '/card-alpin.mp4',
    logo: '/assets/logo-klintt.png',
    logoHeight: 32,
    months: 8,
    tasks: 60,
    impact:
      'Supported the team from initial idea to research and creation of the product and brand from scratch',
    designers: [
      { name: 'Samy', role: 'Senior Product Designer', avatar: '/assets/avatar-samy.webp' },
      { name: 'Camille', role: 'Senior Brand Designer', avatar: '/assets/avatar-camille.webp' },
      { name: 'Franck', role: 'Senior Web Developer', avatar: '/assets/avatar-franck.webp' },
      {
        name: 'Aysha',
        role: 'Senior Presentation Designer',
        avatar: '/assets/avatar-aysha.webp',
      },
    ],
    sections: [
      {
        heading: 'The context',
        body: 'Alpin Capital is building a multi-layer investment platform designed to serve different audiences, from institutional partners to end clients. Alongside this, Klintt acts as the public-facing layer, focused on education, acquisition, and onboarding a new generation of investors. Ambitious vision. Multiple targets. Complex product architecture.',
      },
      {
        heading: 'The problem',
        body: "The challenge wasn't just about designing screens. It was about bringing clarity to a system that needed to work across very different user types. On the product side, roles, permissions, and navigation were not clearly structured yet. Without a solid architecture, the experience risked becoming confusing very quickly, especially with multiple dashboards. On the brand and acquisition side, Klintt needed to exist before the product. Two fronts. One core issue: making complexity understandable and actionable.",
      },
      {
        heading: 'What we did',
        body: 'We stepped in at an early stage and worked on both product foundations and brand experience. On the product side, we defined the global navigation architecture, mapped user roles and permissions, and structured the platform into clear modules. We designed dashboards adapted to each profile, admin, manager, and client, with a focus on readability, hierarchy, and actionable data. On the Klintt side, we designed and built the marketing website with a content-first approach, creating an ecosystem of educational pages to drive acquisition and build trust before conversion. We also supported the setup of the analytics and growth stack, so everything was measurable from day one.',
      },
      {
        heading: 'The impact',
        body: 'The product now has a clear structural foundation. Roles, navigation, and modules are defined, making future development faster and more consistent. Klintt is live with a strong content-driven approach, allowing the team to start acquiring users and building credibility before the full product rollout. The team gained clarity, speed, and a solid base to scale both product and brand.',
      },
    ],
    tickets: [
      {
        title: 'Design a content-first website to drive acquisition before launch',
        request:
          "The product wasn't fully live yet, but growth couldn't wait. We needed a website that could educate users, build trust, and capture leads from day one, while subtly introducing the product without relying on it.",
      },
      {
        title: 'Structure the experience between education and product discovery',
        request:
          'Users come to learn, but we want them to convert. We needed to design an experience that smoothly transitions from content consumption to product understanding, balancing editorial depth and progressive product exposure.',
      },
      {
        title: 'Design the foundations of the app experience',
        request:
          'The app needed to feel simple, modern, and reassuring, despite the complexity underneath. We structured the main user flows, defined key screens, and established UI patterns that make information easy to read, understand, and act on.',
      },
    ],
    gallery: [
      { src: '/assets/alpin-klintt-site.webp', caption: 'Content-first mobile experience' },
      { src: '/assets/alpin-klintt-app.webp', caption: 'Investor dashboard' },
      {
        src: '/assets/alpin-klintt-flows.webp',
        caption: 'App user flows, onboarding, connection, and recovery',
      },
    ],
  },
  {
    slug: 'winter',
    collaboration: 'RUFF x WINTER',
    title: 'Turning energy data into action users actually take',
    summary:
      'From self-audit redesign to renovation scenarios, signature flows, user journeys, and a more human tone of voice.',
    quote:
      'Relevant recommendations on user journeys, backed by a thoughtful analysis of needs. Great flexibility with feedback and strong availability.',
    authorName: 'Louise S.',
    authorRole: 'Product Manager',
    video: '/card-winter.mp4',
    logo: '/assets/logo-winter.png',
    logoHeight: 24,
    months: 7,
    tasks: 50,
    impact: 'Supported the growth to 50K users',
    designers: [
      { name: 'Samy', role: 'Senior Product Designer', avatar: '/assets/avatar-samy.webp' },
    ],
    sections: [
      {
        heading: 'The context',
        body: 'Winter is building an energy optimization platform that helps individuals understand their consumption and take action to reduce it. The product connects energy data, analyzes usage patterns, and translates them into actionable insights. Ambitious vision. Complex data. Strong behavioral challenge: turning awareness into action.',
      },
      {
        heading: 'The problem',
        body: "The product had the right foundations, but the experience wasn't driving engagement at the right level. Key information lacked clarity and hierarchy. Actions were present, but not always compelling or contextualized enough to trigger adoption. Users weren't lacking features, they were lacking clarity, guidance, and momentum. And when users don't clearly see value, they don't act.",
      },
      {
        heading: 'What we did',
        body: 'We plugged into the team as a senior product design layer and started shipping immediately. Over 7 months, we redesigned the self-audit experience from the ground up, optimized renovation scenarios and made them approachable, rethought signature flows and user journeys, and built a more accessible and human tone of voice across the product. We restructured the core experience around actionability and clarity, redesigning the dashboard to better articulate consumption vs. savings potential. We also contributed to the design system by introducing new components, states, and consistent patterns.',
      },
      {
        heading: 'The impact',
        body: "Users better understand their energy situation and where to act. The product becomes more actionable, not just informative. Complex topics are now approachable and structured. Engagement increased through clearer entry points and feedback loops. The product didn't just improve, it became a tool that drives action.",
      },
    ],
    tickets: [
      {
        title: 'Redesign the energy dashboard to drive action',
        request:
          "The dashboard was informative, but not actionable. Key metrics lacked hierarchy and clarity. Users couldn't easily understand where to act. We restructured the experience to highlight what matters and turn insight into action.",
      },
      {
        title: 'Structure the "Actions" experience for clarity and engagement',
        request:
          'Users had access to multiple energy-saving actions, but the system lacked coherence and feedback. We redesigned the action framework, states, navigation, and interactions to make it intuitive and easy to progress through.',
      },
      {
        title: 'Design a clear and actionable consumption experience',
        request:
          'Energy data is complex and hard to interpret. We redesigned the experience to make consumption instantly readable, structured, and useful, combining clear visualizations, usage breakdowns, and robust handling of missing data.',
      },
    ],
    gallery: [
      {
        src: '/assets/winter-energy-dashboard-dpe.webp',
        caption: 'Energy dashboard with consumption estimation',
      },
      { src: '/assets/winter-actions.webp', caption: 'Energy saving recommendations' },
      {
        src: '/assets/winter-consumption-detailed-view.webp',
        caption: 'Detailed consumption analysis',
      },
      {
        src: '/assets/winter-renovation-journey-flow.webp',
        caption: 'Renovation journey user flow',
      },
    ],
  },
];

/** Position of each fanned card inside the pinned stories section. */
export const storyCardLayouts = [
  { x: 18, y: 22, rotation: -12, from: 'left', enterAt: 0 },
  { x: 62, y: 20, rotation: 10, from: 'right', enterAt: 0.3 },
  { x: 38, y: 42, rotation: 2, from: 'left', enterAt: 0.6 },
] as const;

/* ------------------------------------------------------------------ */
/* Pricing                                                             */
/* ------------------------------------------------------------------ */

export const pricing = {
  headline: 'Simple and transparent pricing.',
  plans: [
    {
      name: 'Subscription',
      price: 'From 260€/day',
      description:
        'A senior product designer delivering asynchronously all your design tasks, without limits.',
      features: [
        { icon: '/assets/designrequest.svg', label: 'Unlimited design requests' },
        { icon: '/assets/face-content.svg', label: '1 dedicated senior designer' },
        { icon: '/assets/delivery.svg', label: 'Deliveries within 4 days' },
        { icon: '/assets/webcam-02.svg', label: 'Weekly call' },
        { icon: '/assets/budget.svg', label: 'Monthly subscription' },
        { icon: '/assets/pause-circle.svg', label: 'Pause or cancel anytime' },
      ],
    },
    {
      name: 'Mission',
      price: 'From 850€/day',
      description:
        'A senior product designer joining your team full time for a defined period, available all day for you.',
      features: [
        { icon: '/assets/designrequest.svg', label: 'Defined mission scope' },
        { icon: '/assets/face-content.svg', label: '1 dedicated senior designer' },
        { icon: '/assets/delivery.svg', label: 'Continuous delivery' },
        { icon: '/assets/webcam-02.svg', label: 'Daily calls' },
        { icon: '/assets/defined period.svg', label: 'Defined period' },
        { icon: '/assets/full design ownership.svg', label: 'Full design ownership' },
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
      question: 'How much does it cost?',
      answer:
        "Please reach out to us — we'll be happy to discuss it with you and find the right plan for your needs.",
    },
    {
      question: 'We already have a design team. Can you still help?',
      answer:
        'Absolutely. We integrate into your existing workflow and tools. Jira, Notion, Figma, Slack, Linear. Think of us as an extension of your team, not a replacement.',
    },
    {
      question: 'Who will be my designer?',
      answer:
        'A dedicated senior product designer with experience shipping products at startups and scale-ups. They own your project end to end. No handoffs, no junior rotations.',
    },
    {
      question: 'What can you design?',
      answer:
        'Everything a founding designer would handle. Mobile apps, SaaS products, websites, landing pages, design systems, dashboards, and more. UX research, UI design, prototyping, all the way to developer handoff.',
    },
    {
      question: 'How fast can you start?',
      answer:
        "Most engagements kick off within a few days. Book a call, tell us what you need, and we'll match you with the right designer.",
    },
  ] satisfies readonly FaqItem[],
} as const;

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export const footerLinks = {
  links: [
    { label: 'How it works', targetId: 'how-it-works' },
    { label: 'Client stories', targetId: 'clientstories' },
    { label: 'FAQ', targetId: 'faq' },
  ] satisfies readonly NavLink[],
  company: [
    { label: 'Contact', overlay: 'contact' },
    { label: 'Privacy Policy', overlay: 'privacy' },
    { label: 'Terms', overlay: 'terms' },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Design Academy                                                      */
/* ------------------------------------------------------------------ */

export const academy = {
  headline: ['Pause vibing.', 'Start designing.'],
  bodyBefore:
    "AI is multiplying your team's capacity to build. But design isn't about producing screens, it's about using the right methods to solve real user problems. We've already trained ",
  bodyAfter:
    " in design thinking, UX strategy, and product design. Soon, we'll offer focused sessions to help your designers leverage AI without losing craft, and your PMs think like designers. Drop your email, we'll let you know when doors open.",
  studentCount: 500,
  cta: 'Join the waiting list',
  successMessage: "You're on the list. We'll be in touch.",
} as const;

/* ------------------------------------------------------------------ */
/* Cookie consent                                                      */
/* ------------------------------------------------------------------ */

export const cookieBanner = {
  title: 'Good design starts with understanding',
  body: 'We use analytics cookies to understand how you browse this site. Nothing more.',
  reject: 'Reject',
  accept: 'Accept',
} as const;

/* ------------------------------------------------------------------ */
/* Overlays: Contact / Privacy / Terms                                 */
/* ------------------------------------------------------------------ */

export const contact = {
  title: 'Contact',
  intro:
    "We'd love to hear from you. Whether you have a project in mind, a question about our services, or just want to say hi, reach out anytime.",
  bookACallLabel: 'Schedule a 30-min intro call',
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
      body: 'Under applicable data protection laws (including GDPR), you have the right to access, correct, or delete your personal data; withdraw consent at any time; request data portability; lodge a complaint with a supervisory authority. To exercise any of these rights, contact us at hi@theruff.agency.',
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
      body: 'The Ruff Agency provides product design services on a subscription or mission basis. The scope, deliverables, and timeline for each engagement are agreed upon between both parties before work begins.',
    },
    {
      heading: '3. Subscriptions',
      body: 'Subscription plans are billed on a recurring basis (monthly). You may pause or cancel your subscription at any time. Pausing freezes your billing cycle and remaining days. Cancellation takes effect at the end of the current billing period.',
    },
    {
      heading: '4. Intellectual property',
      body: 'Upon full payment, all design deliverables created during an engagement are transferred to the client. Until payment is received, The Ruff Agency retains ownership of all work produced. We reserve the right to showcase completed work in our portfolio unless otherwise agreed in writing.',
    },
    {
      heading: '5. Confidentiality',
      body: 'We treat all client information, business data, and project details as confidential. We will not disclose any confidential information to third parties without your prior written consent, except as required by law.',
    },
    {
      heading: '6. Payment terms',
      body: 'Invoices are issued at the beginning of each billing cycle for subscriptions, or as agreed for mission-based work. Payment is due within 14 days of invoice date unless otherwise specified. Late payments may result in suspension of services.',
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
      body: 'These Terms are governed by and construed in accordance with the laws of France. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Paris, France.',
    },
    {
      heading: '10. Changes',
      body: 'We reserve the right to modify these Terms at any time. Updated Terms will be posted on our website. Continued use of our services after changes constitutes acceptance of the revised Terms.',
    },
  ] satisfies readonly LegalSection[],
} as const;
