'use client';

import { AgentPromptCard } from '@/components/features/contact/AgentPromptCard';
import { ContactWizard } from '@/components/features/contact/ContactWizard';
import { color, font, shape, weight } from '@/config/tokens';
import { useIsCompact } from '@/hooks/useIsCompact';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useContent } from '@/components/providers/ContentProvider';

/**
 * Everything on the contact surface: the intro, the agent route in, the form,
 * and the ways to reach us that are not a form.
 *
 * Lives in one component because it is shown in two places — the panel that
 * opens over the page, and the /contact route an assistant sends people to —
 * and the two must not drift.
 */
export function ContactContent() {
  const { brand, contactPage } = useContent();
  const isMobile = useIsMobile();
  const isCompact = useIsCompact();

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

      {/* Two tracks when there is room: the form is what people came for, so it
          takes the wider one, with the ways in that are not a form beside it.
          Below the compact breakpoint they stack in the same order — the rail
          would otherwise take 300px the form cannot spare. */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isCompact ? '1fr' : 'minmax(0, 1.45fr) minmax(300px, 1fr)',
          gap: isMobile ? 20 : 24,
          alignItems: 'start',
        }}
      >
        <ContactWizard />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? 20 : 24,
            position: isCompact ? 'static' : 'sticky',
            top: 0,
            minWidth: 0,
          }}
        >
          <AgentPromptCard />

          <section
            style={{
              background: color.cream,
              border: shape.keyline,
              borderRadius: 22,
              boxShadow: shape.hardShadowSmall,
              padding: isMobile ? 22 : 28,
              display: 'flex',
              flexDirection: 'column',
              gap: 18,
            }}
          >
            <Detail label={contactPage.emailLabel}>
              <a href={`mailto:${brand.email}`} style={linkStyle}>
                {brand.email}
              </a>
            </Detail>

            <Detail label="Based in">
              {/* Two blocks rather than a <br>: the shared link style is
                  inline-flex, and a line break does nothing inside a flex box. */}
              <span
                style={{
                  fontFamily: font.sans,
                  fontWeight: weight.bold,
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: color.ink,
                  display: 'block',
                }}
              >
                {brand.basedIn[0]}
              </span>
              <span
                style={{
                  fontFamily: font.body,
                  fontWeight: weight.light,
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: color.muted,
                  display: 'block',
                }}
              >
                {brand.basedIn[1]}
              </span>
            </Detail>
          </section>
        </div>
      </div>
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
