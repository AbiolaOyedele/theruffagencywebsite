'use client';

import { AgentPromptCard } from '@/components/features/contact/AgentPromptCard';
import { ContactForm } from '@/components/features/contact/ContactForm';
import { color, font, shape, weight } from '@/config/tokens';
import { brand, contactPage } from '@/content/site';
import { useIsMobile } from '@/hooks/useIsMobile';

/**
 * Everything on the contact surface: the intro, the agent route in, the form,
 * and the ways to reach us that are not a form.
 *
 * Lives in one component because it is shown in two places — the panel that
 * opens over the page, and the /contact route an assistant sends people to —
 * and the two must not drift.
 */
export function ContactContent() {
  const isMobile = useIsMobile();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 20 : 28 }}>
      <p
        style={{
          fontFamily: font.body,
          fontWeight: weight.light,
          fontSize: isMobile ? 16 : 18,
          lineHeight: 1.7,
          color: color.muted,
          margin: 0,
          maxWidth: 620,
        }}
      >
        {contactPage.intro}
      </p>

      <AgentPromptCard />

      <ContactForm />

      <section
        style={{
          background: color.cream,
          border: shape.keyline,
          borderRadius: 22,
          boxShadow: shape.hardShadowSmall,
          padding: isMobile ? 22 : 28,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 18 : 40,
        }}
      >
        <Detail label={contactPage.emailLabel}>
          <a href={`mailto:${brand.email}`} style={linkStyle}>
            {brand.email}
          </a>
        </Detail>

        <Detail label="Based in">
          <span style={{ ...linkStyle, textDecoration: 'none' }}>
            {brand.basedIn[0]}
            <br />
            <span style={{ fontWeight: weight.medium, color: color.muted }}>
              {brand.basedIn[1]}
            </span>
          </span>
        </Detail>
      </section>
    </div>
  );
}

const linkStyle = {
  fontFamily: font.sans,
  fontWeight: weight.bold,
  fontSize: 15,
  lineHeight: 1.5,
  color: color.ink,
  textDecoration: 'underline',
  textUnderlineOffset: 4,
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 44,
} as const;

interface DetailProps {
  readonly label: string;
  readonly children: React.ReactNode;
}

function Detail({ label, children }: DetailProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
      <span
        style={{
          fontFamily: font.sans,
          fontWeight: weight.bold,
          fontSize: 12,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: color.muted,
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}
