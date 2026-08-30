/**
 * Talent-pool option sets, lifted from the studio's existing careers form so
 * applications arriving from either site describe themselves the same way.
 *
 * Imports nothing, so the client can read these without pulling Zod into the
 * browser bundle.
 */

export const AVAILABILITY_OPTIONS = ['Full-time', 'Part-time', 'Freelance'] as const;

/** Roles, grouped the way they are presented. */
export const ROLE_CATEGORIES = [
  {
    id: 'creative',
    label: 'Creative & Design',
    roles: [
      'Junior Graphic Designer',
      'Graphic Designer',
      'Senior Graphic Designer',
      'Art Director',
      'Creative Director',
      'Illustrator',
      'UI/UX Designer',
      'Motion Designer/Animator',
      'Brand Designer',
      'Video Editor',
      'Photographer',
      'Copywriter',
      'Content Writer',
    ],
  },
  {
    id: 'social',
    label: 'Social & Marketing',
    roles: [
      'Social Media Manager',
      'Social Media Intern',
      'Content Strategist',
      'Community Manager',
      'Paid Ads/Performance Marketer',
      'SEO Specialist',
      'Influencer/PR Manager',
    ],
  },
  {
    id: 'client',
    label: 'Client & Ops',
    roles: [
      'Client Manager/Account Manager',
      'Project Manager',
      'Business Development/Sales',
      'Studio/Operations Manager',
    ],
  },
  {
    id: 'admin',
    label: 'Admin & Support',
    roles: ['In-house Admin', 'Executive Assistant', 'Finance/Bookkeeping', 'HR/People Ops'],
  },
  {
    id: 'legal',
    label: 'Legal',
    roles: ['In-house Legal', 'Contracts Manager'],
  },
] as const;

/** Every selectable role, flattened. */
export const ALL_ROLES: readonly string[] = ROLE_CATEGORIES.flatMap((category) => [
  ...category.roles,
]);

export const TALENT_LIMITS = {
  fullName: 100,
  email: 254,
  phone: 25,
  yearsExperience: 50,
  expectedRate: 100,
  portfolioLink: 500,
  note: 1_000,
} as const;

export type Availability = (typeof AVAILABILITY_OPTIONS)[number];
