/**
 * The panel's map.
 *
 * One list, in the order the sidebar shows it, so a section cannot exist
 * without appearing in navigation or appear twice under different names.
 * Sections are grouped by what the studio is doing, not by what the code is:
 * everything that changes the public site sits together, everything that
 * looks outward sits together, and the rest is settings.
 */

export interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly description: string;
}

export interface NavGroup {
  readonly title: string;
  readonly items: readonly NavItem[];
}

export const NAV: readonly NavGroup[] = [
  {
    title: 'The site',
    items: [
      { href: '/admin', label: 'Overview', description: 'What changed, and what needs attention' },
      { href: '/admin/content', label: 'Content', description: 'Every word on the site' },
      { href: '/admin/design', label: 'Design', description: 'Colours, typefaces and shape' },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { href: '/admin/marketing', label: 'Traffic', description: 'Who is visiting, and from where' },
      { href: '/admin/marketing/enquiries', label: 'Enquiries', description: 'Briefs and applications' },
      { href: '/admin/marketing/contacts', label: 'Audience', description: 'Contacts and suppression' },
      { href: '/admin/marketing/campaigns', label: 'Campaigns', description: 'Write and send email' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { href: '/admin/settings', label: 'Account', description: 'Who can sign in, and integrations' },
      { href: '/admin/settings/activity', label: 'Activity', description: 'Every change, and by whom' },
    ],
  },
];
