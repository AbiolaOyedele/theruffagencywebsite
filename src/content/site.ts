import { color } from '@/config/tokens';
import type {
  BlogPost,
  FooterCompanyLink,
  CaseStudy,
  ClientLogo,
  FaqItem,
  Feature,
  LegalSection,
  NavLink,
  PricingPlan,
  SocialLink,
} from '@/types/content';

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */

export const brand = {
  name: 'The Ruff Agency',
  shortName: 'Ruff',
  legalName: 'The Ruff Agency',
  email: 'hello@theruff.agency',
  /** Applications and anything hiring-related go here, not to the studio inbox. */
  careersEmail: 'careers@theruff.agency',
  copyright: '© 2026 The Ruff Agency. All rights reserved.',
  /**
   * The scheduling link. Only the contact page offers this directly — every
   * other CTA sends people to /contact first, where they can send a brief or
   * book the call, whichever suits them.
   */
  bookACallUrl: 'https://calendar.app.google/tU2SHfJjpBd56rmx7',
  /** Label and destination shared by every call to action on the site. */
  ctaLabel: 'Work with us',
  ctaHref: '/#contact',
  basedIn: ['Lagos, Nigeria', 'Working remotely with clients worldwide'],
} as const;

/* ------------------------------------------------------------------ */
/* Search and link previews                                            */
/* ------------------------------------------------------------------ */

/**
 * What a search result and a shared link say.
 *
 * Here rather than in `app/layout.tsx` so it is editable in the panel with the
 * rest of the copy. The image itself is regenerated from `scripts/og-image.mjs`.
 */
export const seo = {
  title: 'The Ruff Agency | Brand Strategy & Creative Studio, Lagos',
  description:
    'A remote creative studio in Lagos building brand strategy, identity, motion, and social content for startups and growing brands worldwide.',
  /** Shorter, punchier variant for link previews. */
  shareDescription:
    'Brand strategy, creative direction, motion, and social content, built remotely from Lagos for startups and growing brands worldwide.',
  keywords: [
    'brand strategy agency Lagos',
    'creative director Lagos',
    'brand identity Nigeria',
    'remote creative studio',
    'brand strategist for startups',
    'creative studio for startups',
    'motion design studio',
    'social media content strategy',
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export const sectionLinks: readonly NavLink[] = [
  { label: 'Services', targetId: 'services' },
  { label: 'Work', targetId: 'work' },
  { label: 'Writing', targetId: 'writing' },
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
  subheadAfter: ' into a brand ',
  /**
   * Held on one line. Where the subhead has to wrap — narrow screens — the
   * break lands before this rather than stranding "remember." on its own.
   */
  subheadTail: 'people remember.',
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
  label: 'Our designers have worked with these companies and brands',
  logos: [
    { name: 'Teemplot' },
    { name: 'IPC Africa' },
    { name: 'Zero to 16' },
    { name: 'FoodCourt' },
    { name: 'Daash' },
    { name: 'WingsBistro' },
    { name: 'Citysubs' },
    { name: 'GoSource' },
    { name: 'Anikela' },
    { name: 'Doux' },
    { name: 'Renda Africa' },
    { name: 'Ajebo Chops' },
    { name: 'Spicy Corner' },
    { name: 'Sisi Eko' },
    { name: "Papa's Grill" },
    { name: 'GetZing' },
    { name: 'Shiip' },
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
      video: 'ruff-agency/website/video/card1-designer',
    },
    {
      title: 'Creative direction that fits',
      description:
        'Every idea is built around your brand, not a template. Concepts you can actually ship.',
      icon: '/assets/designrequest.svg',
      video: 'ruff-agency/website/video/card2',
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
    gallery: [
      { src: 'ruff-agency/website/placeholder/case-1', caption: 'Placeholder — a key screen or artefact from the work.' },
      { src: 'ruff-agency/website/placeholder/case-2', caption: 'Placeholder — a second view, showing a different part of the system.' },
      { src: 'ruff-agency/website/placeholder/case-3', caption: 'Placeholder — the work in context, or a before-and-after.' },
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
    video: 'ruff-agency/website/video/card-alpa',
    ...placeholderStory('Teemplot'),
  },
  {
    slug: 'ipc-africa',
    client: 'IPC Africa',
    accent: color.accentPink,
    collaboration: 'Ruff × IPC Africa',
    video: 'ruff-agency/website/video/card-alpin',
    ...placeholderStory('IPC Africa'),
  },
  {
    slug: 'zero-to-16',
    client: 'Zero to 16',
    accent: color.accentPink,
    collaboration: 'Ruff × Zero to 16',
    video: 'ruff-agency/website/video/card-winter',
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
  ctaBody: "Tell us what you're building and we'll match you with the right creative lead.",
  ctaButton: 'Work with us',
} as const;

/* ------------------------------------------------------------------ */
/* Writing                                                             */
/* ------------------------------------------------------------------ */

export const blogSection = {
  eyebrow: 'Writing',
  headline: ['How we', 'think about it.'],
  /** The word set in the accent italic inside the headline. */
  accentWord: 'think',
  intro:
    'Notes from the studio on brand, creative direction, and the parts of the work nobody puts in a case study.',
  cardCta: 'Read',
  allCta: 'Read everything',
  /** Shown on /blog, where there is no section around the list. */
  indexTitle: 'Writing',
  indexIntro:
    'Notes from the studio on brand, creative direction, and the parts of the work nobody puts in a case study. No newsletter, no gate — just the thinking.',
  empty: 'Nothing published yet. Check back shortly.',
} as const;

/**
 * Posts, newest first.
 *
 * Every one carries `draft: true` until Ruff has read it and signed it off —
 * the panel says so on the post itself, so nothing goes out under the studio's
 * name by accident.
 */
export const blogPosts: readonly BlogPost[] = [
  {
    slug: 'why-we-turn-down-projects',
    title: "Why we turn down projects we'd be good at",
    excerpt:
      'Ruff qualifies every lead before Discovery starts, because a wrong yes costs a future client the attention they deserve.',
    category: 'How we work',
    publishedAt: '2026-09-01',
    author: { name: 'The Ruff Agency', role: 'Studio' },
    draft: true,
    video: 'ruff-agency/website/video/card1-designer',
    gallery: [
      {
        src: 'ruff-agency/website/placeholder/writing-3',
        caption: 'A qualification call in progress, notes open beside the laptop.',
      },
      {
        src: 'ruff-agency/website/placeholder/writing-4',
        caption: 'A completed qualification scorecard, ready for review.',
      },
    ],
    pullQuotes: [
      {
        title: 'Say no early',
        request:
          "Every hour spent scoping a project that should never have gone ahead is an hour taken from a client who deserved that focus, which is the real cost of a yes we shouldn't have given.",
      },
      {
        title: 'A score, not a feeling',
        request:
          'Scoring qualification removes the discomfort of a maybe, and the risk that whether we take a project depends on whoever happened to answer the call that day.',
      },
    ],
    sections: [
      {
        heading: 'The cost of saying yes',
        body: "Every hour a strategist spends scoping a project that should never have gone ahead is an hour taken from a client who deserved that focus. That's why qualification runs as its own stage, before Discovery, on a short call where we ask about budget, decision-making, and the actual problem, out loud, before any unpaid time goes into a proposal. Skip this and a studio either scopes on guesswork or treats every enquiry the same way. Neither produces work either side is proud of.",
      },
      {
        heading: 'What a good fit looks like',
        body: "The clients we do our best work for share a shape: founder-led or a small leadership team, with enough budget and data behind them that decisions move fast rather than through six layers of approval. They can describe a business problem, even loosely, growth has stalled, a rebrand feels overdue, a product needs its first real design pass, rather than only naming a deliverable. And they're looking for a strategic partner, rather than a pair of hands to execute a decision they've already made. Size and industry matter far less than whether the relationship can actually work.",
      },
      {
        heading: 'The patterns that predict trouble',
        body: "A few signals reliably predict a difficult project, regardless of how nice everyone is on the call. A client who can't describe the problem beyond \"we need a new logo\" usually isn't ready for Discovery yet. Multiple stakeholders with no clear final decision maker means revision rounds expand indefinitely as approval bounces between people who were never in the same room. A client who has already decided on the solution before any discovery wants execution, not thinking, which suits some studios and isn't the one we're built around. None of these alone rules a client out. Several together are reason enough to pause and talk it through.",
      },
      {
        heading: 'How we score a lead',
        body: 'Every qualification call ends with a scorecard, not a gut call. Problem clarity, budget fit, decision-making clarity, category fit, timeline, and openness to strategic input each carry a weight, and the total lands in one of three bands: proceed straight to Discovery, proceed with the weak spots flagged to the creative director, or decline. Scoring it removes the discomfort of a maybe and the risk that qualification depends on whoever happened to take the call that day. A studio that qualifies on vibes eventually takes on a client it should have declined, then wonders, months in, why the project feels wrong.',
      },
    ],
  },
  {
    slug: 'why-we-never-show-one-idea',
    title: 'Why we never show you just one idea',
    excerpt:
      'Ruff presents two or three genuinely distinct creative territories, each traceable to a line in the brief, before any direction is chosen.',
    category: 'Creative direction',
    publishedAt: '2026-09-01',
    author: { name: 'The Ruff Agency', role: 'Studio' },
    draft: true,
    video: 'ruff-agency/website/video/notif',
    gallery: [
      {
        src: 'ruff-agency/website/placeholder/writing-5',
        caption: 'Three creative territories pinned up, ready for internal review.',
      },
      {
        src: 'ruff-agency/website/placeholder/writing-6',
        caption: 'A written rationale document sitting beside the presentation deck.',
      },
    ],
    pullQuotes: [
      {
        title: 'Theatre, not a choice',
        request:
          'When only one direction was ever seriously considered, three territories on the wall is theatre dressed up as a client decision, and clients tend to notice eventually.',
      },
      {
        title: 'Reasoning before reaction',
        request:
          'We restate the brief before showing a single visual, and ask whether a direction solves the agreed problem before we ask which one people like.',
      },
    ],
    sections: [
      {
        heading: 'Three boards, one idea',
        body: "When only one direction was ever seriously considered, three territories on the wall is theatre dressed up as a client decision. We've seen the trick: one strong direction paired with two deliberately weak options, built to steer the room toward whatever we already preferred. It can work, in the sense that the client picks the favourite. It fails everywhere else, because the client never had three genuine ideas to weigh, and clients tend to notice eventually. Every territory we present gets equal production time and equal presentation weight, or it doesn't reach the client at all.",
      },
      {
        heading: 'Every territory earns its place',
        body: "Each territory starts from the same brief and has to answer a specific line in it, an objective, an audience insight, a piece of positioning, rather than just a different colour palette on the same idea. We build reference libraries that pull from outside the client's own category on purpose, because reference drawn only from direct competitors just reproduces what the category already looks like. From there, two or three moodboards become two or three visual territories, each applied to the same set of touchpoints so the comparison is fair. If we can't say which line of the brief a territory is betting on, it doesn't go up on the wall.",
      },
      {
        heading: 'Reasoning before reaction',
        body: "Before any client sees a territory, we write the argument for it: which objective it answers, which insight it's built on, and the objection we expect first. That rationale gets written before the deck, not after, so the presentation leads with reasoning instead of hoping the work explains itself. In the room, we restate the brief before showing a single visual, and we ask whether a direction solves the agreed problem before we ask which one people like. A taste-based reaction, decided in the first five minutes, is the outcome we're actively designing the session to avoid.",
      },
      {
        heading: 'One direction, locked in writing',
        body: "Once a direction is chosen, we score it against the brief's actual success criteria, not a straight preference vote, and put the choice in writing before full-fidelity design starts. A verbal \"we like direction two\" has a way of resurfacing as a disagreement three weeks later, once real budget has gone into building it out. Any hybrid a client requests between two territories gets scoped and confirmed in writing too, rather than assumed. Locking the direction this way protects the timeline and the client's own budget from a decision that quietly keeps moving.",
      },
    ],
  },
  {
    slug: 'a-logo-is-not-a-brand',
    title: 'A logo is not a brand, and the difference costs money',
    excerpt:
      'Most founders come to us asking for a logo. Almost none of them actually need one first.',
    category: 'Brand strategy',
    publishedAt: '2026-08-12',
    author: { name: 'The Ruff Agency', role: 'Studio' },
    draft: true,
    video: 'ruff-agency/website/video/card-alpa',
    gallery: [
      {
        src: 'ruff-agency/website/placeholder/writing-1',
        caption: 'Placeholder — the positioning line, before and after.',
      },
      {
        src: 'ruff-agency/website/placeholder/writing-2',
        caption: 'Placeholder — the same business, said three different ways.',
      },
    ],
    pullQuotes: [
      {
        title: 'A logo is a signature',
        request:
          'It is the mark you sign work with once you already know what the work says. Signing before you know what you are saying is how a business ends up with a beautiful mark it quietly stops using.',
      },
      {
        title: 'Positioning in a design costume',
        request:
          'If customers cannot tell you apart from three competitors, a new typeface will not fix it — the confusion is not visual.',
      },
    ],
    sections: [
      {
        heading: 'The request that is never the problem',
        body: 'Nine times out of ten the first message says the same thing: we need a logo. Sometimes it is a rebrand, sometimes it is "just a refresh", but the shape is identical — a founder has decided the visual is what is holding them back. It rarely is. A logo is a signature. It is the mark you sign work with once you already know what the work says. Signing before you know what you are saying is how a business ends up with a beautiful mark it quietly stops using within a year.',
      },
      {
        heading: 'What people actually mean',
        body: 'Dig one question deeper and the real brief comes out. We look the same as everyone else. People do not remember us. We keep having to explain what we do. Our prices get questioned. None of those are drawing problems. They are positioning problems wearing a design costume. If customers cannot tell you apart from three competitors, a new typeface will not fix it, because the confusion is not visual — it is that nobody, including the founder, can say in one sentence why this business is the one to pick.',
      },
      {
        heading: 'What we do instead',
        body: 'We start with the market. Who else is in it, how they all sound, and where the space actually is. Then the audience: not a persona document, but the two or three things a real buyer is weighing at the moment they choose. Then the sentence — the one line the brand has to own. Only then does anything get drawn, and by that point the drawing is easy, because the mark has a job. Strategy is not the expensive preamble to design. It is what stops design being guesswork.',
      },
      {
        heading: 'The cost of skipping it',
        body: 'A brand built without that groundwork does not fail loudly. It fails by being forgettable — assets that never quite get used, a deck that gets rebuilt for every pitch, a founder who keeps tweaking the mark because something feels off and nobody can name what. That is not a design bill. It is the same bill, paid twice, plus the year of trading you did while nobody could remember your name.',
      },
    ],
  },
  {
    slug: 'brief-that-gets-good-work',
    title: 'How to write a brief that gets you good work',
    excerpt:
      'The best briefs we get are short, specific, and honest about what is not working. Here is the shape of one.',
    category: 'Working together',
    publishedAt: '2026-07-29',
    author: { name: 'The Ruff Agency', role: 'Studio' },
    draft: true,
    video: 'ruff-agency/website/video/card-alpin',
    gallery: [
      {
        src: 'ruff-agency/website/placeholder/writing-3',
        caption: 'Placeholder — a one-page brief, annotated.',
      },
      {
        src: 'ruff-agency/website/placeholder/writing-4',
        caption: 'Placeholder — the same brief rewritten around the problem.',
      },
    ],
    pullQuotes: [
      {
        title: 'Describe, do not prescribe',
        request:
          'A brief that opens with a list of deliverables has already made every interesting decision before anyone with craft has looked at it — and you are paying for that craft.',
      },
      {
        title: 'Constraints are not an insult',
        request:
          'Budget, deadline, the three colours the parent company will never approve. Knowing that on day one is what lets a studio design something that actually ships.',
      },
    ],
    sections: [
      {
        heading: 'Long is not the same as clear',
        body: 'We have had twenty-page briefs that told us nothing and three-paragraph emails that told us everything. Length is not the variable. What separates them is whether the brief describes the problem or prescribes the solution. A brief that opens with a list of deliverables has already made every interesting decision before anyone with craft has looked at it — and you are paying for that craft.',
      },
      {
        heading: 'Lead with what is not working',
        body: 'The single most useful line in any brief is the honest one: here is what is going wrong. Sales calls stall at the same objection. The deck gets a good reaction and no follow-up. The feed looks fine but nobody shares it. That sentence is worth more than a mood board, because it points at the actual gap. Studios can design to a taste, but they can only solve a problem you have named.',
      },
      {
        heading: 'Say who it is for, specifically',
        body: 'Not "SMEs in West Africa". A person: the operations lead at a fifty-seat logistics company who has been burned by two vendors already. The more specific the audience, the more decisive the work, because specificity gives everyone something to argue with. Broad audiences produce broad work, and broad work is the kind nobody remembers.',
      },
      {
        heading: 'Bring the constraints early',
        body: 'Budget, deadline, the three colours the parent company will never approve, the founder who hates serifs. None of that is an insult to the work — it is the shape of the box, and knowing it on day one is what lets a studio design something that actually ships. Constraints revealed in week six are the most expensive information in the project.',
      },
      {
        heading: 'What good looks like',
        body: 'End the brief by describing success in a sentence a non-designer could check. Not "modern and premium" — that means nothing and everyone agrees with it. Something closer to: a prospect can explain what we do to a colleague after one look. That gives the work a target, and it gives both sides a way to tell, at the end, whether it landed.',
      },
    ],
  },
  {
    slug: 'why-we-work-inside-your-tools',
    title: 'Why we work inside your tools, not around them',
    excerpt:
      'Most agency friction is not creative. It is the handoff. So we removed the handoff.',
    category: 'How we work',
    publishedAt: '2026-07-08',
    author: { name: 'The Ruff Agency', role: 'Studio' },
    draft: true,
    video: 'ruff-agency/website/video/card2',
    gallery: [
      {
        src: 'ruff-agency/website/placeholder/writing-5',
        caption: 'Placeholder — a request raised where the team already works.',
      },
      {
        src: 'ruff-agency/website/placeholder/writing-6',
        caption: 'Placeholder — work in progress, visible without asking.',
      },
    ],
    pullQuotes: [
      {
        title: 'It rarely goes wrong. It goes quiet.',
        request:
          'Feedback sat in an email thread. A file was the wrong version. Someone was waiting on someone who was waiting on them. None of that is a creative failure.',
      },
      {
        title: 'The project stops needing a translator',
        request:
          'Requests come in where your team already raises them. Feedback lands on the file rather than in a thread about the file.',
      },
    ],
    sections: [
      {
        heading: 'The gap where projects die',
        body: 'Ask anyone who has worked with an agency where it went wrong and they rarely say the work was bad. They say it went quiet. Feedback sat in an email thread. A file was the wrong version. Someone was waiting on someone who was waiting on them. Almost none of that is a creative failure — it is a logistics failure, and it happens in the gap between how the studio works and how the client does.',
      },
      {
        heading: 'Two systems, one project',
        body: 'The traditional setup gives every project two homes: the client’s tools and the agency’s. Everything has to be carried between them by hand, and everything carried by hand eventually gets dropped. Weekly status calls exist almost entirely to paper over that gap — an hour spent telling each other things a shared board would have shown at a glance.',
      },
      {
        heading: 'What we do instead',
        body: 'We work in your Slack, your Notion, your Figma, your board. Requests come in where your team already raises them. Work in progress is visible without asking. Feedback lands on the file rather than in a thread about the file. It is a small change on paper and it removes most of the friction, because the project stops needing a translator.',
      },
      {
        heading: 'What it changes',
        body: 'Turnarounds get shorter, but the bigger difference is quieter: nobody has to chase. The client can see where something is without sending a message, and we can see the context around a request without asking for it. That is most of what people mean when they say an agency felt like part of the team.',
      },
    ],
  },
  {
    slug: 'your-feed-looks-fine',
    title: 'Your feed looks fine. That is the problem.',
    excerpt:
      'Competent is the most expensive place a brand can sit — good enough to publish, forgettable enough to scroll past.',
    category: 'Social',
    publishedAt: '2026-06-24',
    author: { name: 'The Ruff Agency', role: 'Studio' },
    draft: true,
    video: 'ruff-agency/website/video/card-winter',
    gallery: [
      { src: 'ruff-agency/website/placeholder/writing-1', caption: 'Placeholder — replace with art that belongs to this piece.' },
      { src: 'ruff-agency/website/placeholder/writing-2', caption: 'Placeholder — a second view, or the point made visually.' },
    ],
    pullQuotes: [
      {
        title: 'Competent is the problem',
        request:
          'A consistent feed stops you looking amateur. It does not make anyone care.',
      },
      {
        title: 'The test worth passing',
        request:
          'One idea that only your brand could have posted, that a person who saw it last week can still tell you the point of.',
      },
    ],
    sections: [
      {
        heading: 'Nothing is wrong, and nothing is working',
        body: 'The grid is consistent. The type is clean. The colours match the guidelines. And the numbers have not moved in five months. This is the most common brief we get, and it is the hardest one to hear, because there is nothing obviously broken to point at. The work is competent. Competent is the problem.',
      },
      {
        heading: 'Consistency is a floor, not a strategy',
        body: 'A consistent feed stops you looking amateur. It does not make anyone care. Somewhere along the way consistency became the goal rather than the baseline, and brands started measuring themselves on whether the grid looked tidy instead of whether anyone remembered a single post from it.',
      },
      {
        heading: 'What we look for instead',
        body: 'One idea that only your brand could have posted. Not a format anyone could run, not a trend with your logo on it. Something that carries a point of view, so that a person who saw it last week can tell you what it said. Most feeds cannot pass that test, and every feed worth copying can.',
      },
    ],
  },
  {
    slug: 'three-questions-before-a-quote',
    title: 'The three questions we ask before quoting',
    excerpt:
      'A number without these answers is a guess. Here is what we need to know before we give you one.',
    category: 'Working together',
    publishedAt: '2026-06-10',
    author: { name: 'The Ruff Agency', role: 'Studio' },
    draft: true,
    video: 'ruff-agency/website/video/card1-designer',
    gallery: [
      { src: 'ruff-agency/website/placeholder/writing-3', caption: 'Placeholder — replace with art that belongs to this piece.' },
      { src: 'ruff-agency/website/placeholder/writing-4', caption: 'Placeholder — a second view, or the point made visually.' },
    ],
    pullQuotes: [
      {
        title: 'Not what you want made',
        request:
          'What has to have changed. The answer decides the scope, and the scope decides the number.',
      },
      {
        title: 'Who has to say yes?',
        request:
          'The single biggest difference between a project that takes six weeks and the same project taking sixteen.',
      },
    ],
    sections: [
      {
        heading: 'What has to be true when this is finished?',
        body: 'Not what you want made — what has to have changed. A deck that closes a specific round. A brand a distributor takes seriously. A feed that gives the sales team something to send. The answer decides the scope, and the scope decides the number. Skip it and you get a quote for a list of files.',
      },
      {
        heading: 'Who has to say yes?',
        body: 'One founder, or a founder and two investors, or a committee. This is the single biggest difference between a project that takes six weeks and the same project taking sixteen. It changes nothing about the craft and everything about the timeline, so it belongs in the quote rather than in a difficult conversation later.',
      },
      {
        heading: 'What already exists?',
        body: 'Half-finished guidelines, a logo somebody likes, photography with rights attached, a name that is not registered yet. Every one of those is either time saved or time spent, and we would rather find out at the quoting stage than in week three.',
      },
    ],
  },
  {
    slug: 'premium-does-not-mean-western',
    title: 'Premium does not mean Western',
    excerpt:
      'The reflex to look international is usually a reflex to look like everyone else. It costs brands the only thing they had.',
    category: 'Brand strategy',
    publishedAt: '2026-05-27',
    author: { name: 'The Ruff Agency', role: 'Studio' },
    draft: true,
    video: 'ruff-agency/website/video/notif',
    gallery: [
      { src: 'ruff-agency/website/placeholder/writing-5', caption: 'Placeholder — replace with art that belongs to this piece.' },
      { src: 'ruff-agency/website/placeholder/writing-6', caption: 'Placeholder — a second view, or the point made visually.' },
    ],
    pullQuotes: [
      {
        title: 'The reference deck problem',
        request:
          'A deck full of the same references produces a brand that looks like the deck.',
      },
      {
        title: 'Premium has no nationality',
        request:
          'Restraint, confidence, and evidence of care. Copying a look gets you the surface without the substance.',
      },
    ],
    sections: [
      {
        heading: 'The reference deck problem',
        body: 'Almost every brand brief we receive arrives with references, and almost all of those references are American or European. That is not a criticism — it is what is easiest to find. But a deck full of the same references produces a brand that looks like the deck, and there are only so many ways to look like a San Francisco startup before you are indistinguishable from one.',
      },
      {
        heading: 'What premium actually signals',
        body: 'Restraint, confidence, and evidence of care. None of those have a nationality. A brand reads as premium when every decision looks deliberate — the spacing, the paper, the photography, the way the name is said out loud. Copying a look gets you the surface of that without the substance underneath, which is why the copies never quite work.',
      },
      {
        heading: 'The advantage nobody uses',
        body: 'A brand built here has access to a visual and verbal world that the reference decks do not contain. Using it is not a limitation to overcome; it is the only durable way to be unmistakable in a market where everyone else is looking at the same twelve websites.',
      },
    ],
  },
  {
    slug: 'motion-is-not-decoration',
    title: 'Motion is not decoration',
    excerpt:
      'If the animation could be removed without anyone noticing, it was never doing a job.',
    category: 'Creative direction',
    publishedAt: '2026-05-13',
    author: { name: 'The Ruff Agency', role: 'Studio' },
    draft: true,
    video: 'ruff-agency/website/video/card-alpa',
    gallery: [
      { src: 'ruff-agency/website/placeholder/writing-1', caption: 'Placeholder — replace with art that belongs to this piece.' },
      { src: 'ruff-agency/website/placeholder/writing-2', caption: 'Placeholder — a second view, or the point made visually.' },
    ],
    pullQuotes: [
      {
        title: 'Take the motion out',
        request:
          'If the piece communicates exactly as well without it, the motion was decoration — and decoration is the first thing an audience learns to ignore.',
      },
      {
        title: 'Flat is a composition problem',
        request:
          'Animation cannot fix composition. It can only make a flat thing move.',
      },
    ],
    sections: [
      {
        heading: 'The test',
        body: 'Take the motion out. If the piece communicates exactly as well without it, the motion was decoration — and decoration is the first thing an audience learns to ignore. Good motion carries meaning that the static frame cannot: sequence, emphasis, cause and effect, the difference between two things that look the same standing still.',
      },
      {
        heading: 'What it is for',
        body: 'Motion tells you what to look at, and in what order. It shows one thing turning into another, which no still image can. It gives a brand a tempo — brisk, considered, playful — that people read long before they read any words. Those are jobs, not effects.',
      },
      {
        heading: 'Where it goes wrong',
        body: 'Almost always in the same place: motion added at the end, to something already finished, because the piece felt flat. Flat is a composition problem, and animation cannot fix composition. It can only make a flat thing move.',
      },
    ],
  },
  {
    slug: 'what-a-retainer-buys',
    title: 'What a retainer actually buys you',
    excerpt:
      'Not a discount on volume. The thing worth paying for is that nobody has to explain the brand again.',
    category: 'Working together',
    publishedAt: '2026-04-29',
    author: { name: 'The Ruff Agency', role: 'Studio' },
    draft: true,
    video: 'ruff-agency/website/video/card-alpin',
    gallery: [
      { src: 'ruff-agency/website/placeholder/writing-3', caption: 'Placeholder — replace with art that belongs to this piece.' },
      { src: 'ruff-agency/website/placeholder/writing-4', caption: 'Placeholder — a second view, or the point made visually.' },
    ],
    pullQuotes: [
      {
        title: 'Context, not volume',
        request:
          'By month four the studio is making judgement calls you would have made yourself. That is when the work starts getting genuinely faster.',
      },
      {
        title: 'When not to',
        request:
          'A retainer that exists to hit a monthly quota produces work nobody needed, and both sides can feel it.',
      },
    ],
    sections: [
      {
        heading: 'The version people expect',
        body: 'Most people read a retainer as bulk pricing — a set number of deliverables a month, cheaper per unit than buying them one at a time. That is real, and it is the least interesting part of the arrangement. If volume is all you need, a retainer is an expensive way to buy it.',
      },
      {
        heading: 'What it is really for',
        body: 'Context. On a project, a studio spends the first two weeks learning your market, your constraints, and the three things your founder will never approve — then hands the work over and forgets it. On a retainer that learning compounds. By month four the studio is making judgement calls you would have made yourself, which is the point at which the work starts getting genuinely faster.',
      },
      {
        heading: 'When not to',
        body: 'If the work is genuinely one-off — a launch, a raise, a single campaign with an end date — a project is the honest structure and we will say so. A retainer that exists to hit a monthly quota produces work nobody needed, and both sides can feel it.',
      },
    ],
  },
  {
    slug: 'brief-the-designer-first',
    title: 'Stop briefing your designer last',
    excerpt:
      'By the time the decisions are made, all that is left is decoration — and you are paying for judgement.',
    category: 'Working together',
    publishedAt: '2026-04-15',
    author: { name: 'The Ruff Agency', role: 'Studio' },
    draft: true,
    video: 'ruff-agency/website/video/card2',
    gallery: [
      { src: 'ruff-agency/website/placeholder/writing-5', caption: 'Placeholder — replace with art that belongs to this piece.' },
      { src: 'ruff-agency/website/placeholder/writing-6', caption: 'Placeholder — a second view, or the point made visually.' },
    ],
    pullQuotes: [
      {
        title: 'What gets lost',
        request:
          'Designers see structural problems early. Every one is cheap to fix at the thinking stage and expensive at the artwork stage.',
      },
      {
        title: 'One hour, at the start',
        request:
          'Not a briefing — a conversation. It costs an hour and it routinely saves a fortnight.',
      },
    ],
    sections: [
      {
        heading: 'The usual order',
        body: 'The strategy is agreed, the copy is signed off, the launch date is set, and then design is asked to make it look good. Everything that shapes whether the work lands has already been decided in a room design was not in. What is left is arrangement.',
      },
      {
        heading: 'What gets lost',
        body: 'Designers see structural problems early — a proposition that cannot be said in one line, a hierarchy that fights itself, a claim that will not survive being put next to a photograph. Every one of those is cheap to fix at the thinking stage and expensive at the artwork stage, and the only reason they surface late is that nobody was in the room to raise them.',
      },
      {
        heading: 'The change',
        body: 'One meeting, at the start, with whoever will make the work in it. Not a briefing — a conversation. It costs an hour and it routinely saves a fortnight, which is a return no amount of craft further down the line can match.',
      },
    ],
  },
  {
    slug: 'the-market-stall-test',
    title: 'The market stall test',
    excerpt:
      'Your packaging looked immaculate in the mockup. Now put it on a crowded shelf under bad light.',
    category: 'Brand strategy',
    publishedAt: '2026-04-01',
    author: { name: 'The Ruff Agency', role: 'Studio' },
    draft: true,
    video: 'ruff-agency/website/video/card-winter',
    gallery: [
      { src: 'ruff-agency/website/placeholder/writing-1', caption: 'Placeholder — replace with art that belongs to this piece.' },
      { src: 'ruff-agency/website/placeholder/writing-2', caption: 'Placeholder — a second view, or the point made visually.' },
    ],
    pullQuotes: [
      {
        title: 'The mockup lies',
        request:
          'It will be seen at an angle, half-obscured, under fluorescent light, beside eleven competitors shouting the same thing.',
      },
      {
        title: 'Print it badly',
        request:
          'Actual size, among the real competitors, photographed on a phone. It will change the design more than any meeting will.',
      },
    ],
    sections: [
      {
        heading: 'The mockup lies',
        body: 'Every packaging design looks good centred on a neutral background in a rendered studio shot. That is not where it will be seen. It will be seen at an angle, half-obscured, under fluorescent light, beside eleven competitors shouting the same thing, being scanned by someone in a hurry. The mockup tests none of that.',
      },
      {
        heading: 'What the shelf punishes',
        body: 'Low contrast. Type set too small to read from a metre away. Colour that disappears against a neighbour. A name that needs the back of the pack to make sense. All of these survive a mockup review and none of them survive a real shelf, which is where the money is either made or not.',
      },
      {
        heading: 'How to test it early',
        body: 'Print it, badly, at actual size. Put it among the real competitors, in a real shop, and photograph it on a phone. It takes an afternoon, it costs almost nothing, and it will change the design more than any round of feedback in a meeting room ever will.',
      },
    ],
  },
];

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
        "Projects start from ₦150,000, depending on scope. Send us a brief and we'll come back with a clear quote before any work begins.",
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

/**
 * The studio's accounts.
 *
 * An entry with no `url` is not rendered — no dead links ship. Fill the URL in
 * and the icon appears; there is nothing else to change.
 */
export const socialLinks = [
  // Threads is deliberately blank — the account is not live yet, and an entry
  // with no URL simply does not render.
  { platform: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/company/the-ruff-agency' },
  { platform: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/theruff.agency/' },
  { platform: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@ruff.agency' },
  { platform: 'threads', label: 'Threads', url: '' },
  { platform: 'x', label: 'X', url: 'https://x.com/RuffAgency' },
] as const satisfies readonly SocialLink[];

export const footerLinks = {
  links: [
    { label: 'Services', targetId: 'services' },
    { label: 'Work', targetId: 'work' },
    { label: 'FAQ', targetId: 'faq' },
  ] satisfies readonly NavLink[],
  company: [
    { label: 'Writing', overlay: 'blog' },
    { label: 'Contact', overlay: 'contact' },
    { label: 'Careers', overlay: 'careers' },
    { label: 'Privacy Policy', overlay: 'privacy' },
    { label: 'Terms', overlay: 'terms' },
  ] satisfies readonly FooterCompanyLink[],
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

/** The contact surface: the panel at #contact, and the /contact route. */
export const contactPage = {
  /** Heading on the panel that opens over the page. */
  panelTitle: 'Let’s Talk!',
  eyebrow: 'Work with us',
  intro:
    'Five short questions — about a minute. We will come back with the most useful next step, whether that is a quote or a conversation.',
  emailLabel: 'Or email us directly',

  /**
   * The enquiry, one question per step. The review step reads the same copy to
   * build its summary, so a question can never appear in one and not the other.
   */
  steps: {
    service: {
      question: 'What kind of work is it?',
      label: 'Kind of work',
    },
    project: {
      question: 'Tell us about the project.',
      label: 'The project',
      placeholder:
        'What is it for, who is it meant to reach, and what would make it a success? A few sentences is plenty.',
    },
    you: {
      question: 'What should we call you, and where can we reach you?',
      nameLabel: 'Name',
      namePlaceholder: 'First and last name',
      emailLabel: 'Email',
      emailPlaceholder: 'you@company.com',
    },
    context: {
      question: 'Does the brand have a name yet, and how did you find us?',
      companyLabel: 'Brand or company',
      companyPlaceholder: 'What is it called? (optional)',
      referralLabel: 'How you found us',
      referralPlaceholder: 'A referral, a search, something you saw (optional)',
    },
    scope: {
      question: 'When do you need it, and what budget are you working with?',
      label: 'Timing and budget',
      timelineLabel: 'Timeline',
      budgetLabel: 'Budget',
      note: 'Projects start from ₦150,000. A rough band is enough — it only helps us shape the right scope.',
    },
    review: {
      question: 'That is everything. Look it over, then send it when you are ready.',
      skipped: 'Skipped',
      notAnswered: 'Not answered',
    },
  },

  /** Wizard chrome. */
  back: 'Back',
  skip: 'Skip',
  continueLabel: 'Continue',
  editLabel: 'Edit',
  submitLabel: 'Send project enquiry',
  submitBusyLabel: 'Sending…',
  callHeading: 'Rather talk it through?',
  callBody: 'Book a call and we will match you with the right creative lead.',
  callLabel: 'Book a direct call',
  successHeading: 'Enquiry sent',

  /** The paste-to-fill flow an AI agent can follow on the visitor's behalf. */
  agent: {
    heading: 'Working with an AI agent?',
    body: 'Copy one prompt into Claude, ChatGPT, or any agent. It works the brief out with you, then hands you a snippet to paste on this page — every answer fills itself in and you check it over before sending.',
    copyLabel: 'Copy prompt',
    copiedLabel: 'Copied',
    copyFailedLabel: 'Copy failed — open it instead',
    href: '/agent/prompt.md',
    pasteNotice:
      'We filled your answers in from your assistant’s draft. Check them over, then send.',
  },
} as const;

/** The careers surface: the panel at #careers, and the /careers route. */
export const careersPage = {
  panelTitle: 'Work at Ruff',
  eyebrow: 'Careers',
  intro:
    'We are a small studio that takes on work bigger than our size. When we hire, we hire from people who have already told us what they do.',

  /** The openings notice. Replace when a role actually opens. */
  openings: {
    heading: 'No open roles right now',
    body: 'Nothing is posted at the moment. The talent pool is how we find people when that changes — it is the first place we look, before anything goes public.',
  },

  cta: 'Join the talent pool',
  ctaNote: 'Takes about two minutes.',

  /** The application, one step at a time. */
  steps: {
    about: {
      question: 'Tell us about you.',
      label: 'About you',
      nameLabel: 'Full name',
      namePlaceholder: 'First and last name',
      emailLabel: 'Email',
      emailPlaceholder: 'you@email.com',
      phoneLabel: 'Phone number',
      phonePlaceholder: '+234 800 000 0000',
      experienceLabel: 'Years of experience',
      experiencePlaceholder: 'e.g. 4',
      availabilityLabel: 'Availability',
      rateLabel: 'Expected monthly rate or salary',
      ratePlaceholder: 'A number or a range — whatever you are working to',
      portfolioLabel: 'Portfolio or LinkedIn',
      portfolioPlaceholder: 'https:// (optional)',
    },
    roles: {
      question: 'Which roles fit you?',
      label: 'Roles',
      helper: 'Select as many as genuinely apply.',
    },
    note: {
      question: 'Anything you want us to know?',
      label: 'Note',
      placeholder:
        'Optional. What you are good at, what you want to be doing, or anything the fields above did not cover.',
    },
    review: {
      question: 'That is everything. Look it over, then send it when you are ready.',
      notAnswered: 'Not answered',
      none: 'None selected',
    },
  },

  submitLabel: 'Join the talent pool',
  submitBusyLabel: 'Sending…',
  successHeading: 'You are in',
  emailLabel: 'Or email us directly',
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
      body: 'Under applicable data protection laws, including the Nigeria Data Protection Act, you have the right to access, correct, or delete your personal data; withdraw consent at any time; request data portability; lodge a complaint with a supervisory authority. To exercise any of these rights, contact us at hello@theruff.agency.',
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
