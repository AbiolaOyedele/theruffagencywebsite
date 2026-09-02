'use client';

import { useState } from 'react';
import { TalentWizard } from '@/components/features/careers/TalentWizard';
import { color, font, primaryButton, shape, weight } from '@/config/tokens';
import { useIsCompact } from '@/hooks/useIsCompact';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useContent } from '@/components/providers/ContentProvider';

/**
 * The careers surface.
 *
 * There is nothing open, so the panel says so plainly rather than dressing up
 * an empty list — and then offers the one thing that is actually useful: the
 * talent pool. The form only appears once it has been asked for, so the panel
 * opens as a short answer rather than a wall of fields.
 */
export function CareersContent() {
  const { brand, careersPage } = useContent();
  const isMobile = useIsMobile();
  const isCompact = useIsCompact();
  const [applying, setApplying] = useState(false);

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
        {careersPage.intro}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            isCompact || applying ? '1fr' : 'minmax(0, 1.45fr) minmax(300px, 1fr)',
          gap: isMobile ? 20 : 24,
          alignItems: 'start',
        }}
      >
        {applying ? (
          <TalentWizard />
        ) : (
          <section
            style={{
              background: color.white,
              border: shape.keyline,
              borderRadius: 24,
              boxShadow: shape.hardShadow,
              padding: isMobile ? 24 : 36,
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            <h2
              style={{
                fontFamily: font.display,
                fontWeight: weight.extrabold,
                fontSize: isMobile ? 22 : 27,
                letterSpacing: '-0.02em',
                color: color.ink,
                margin: 0,
              }}
            >
              {careersPage.openings.heading}
            </h2>
            <p
              style={{
                fontFamily: font.body,
                fontWeight: weight.light,
                fontSize: 16,
                lineHeight: 1.7,
                color: color.muted,
                margin: 0,
              }}
            >
              {careersPage.openings.body}
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 14,
                marginTop: 8,
              }}
            >
              <button
                type="button"
                onClick={() => setApplying(true)}
                style={{ ...primaryButton, padding: '16px 28px', fontSize: 15, cursor: 'pointer' }}
              >
                {careersPage.cta} →
              </button>
              <span
                style={{
                  fontFamily: font.body,
                  fontWeight: weight.light,
                  fontSize: 14,
                  color: color.muted,
                }}
              >
                {careersPage.ctaNote}
              </span>
            </div>
          </section>
        )}

        {applying ? null : (
          <section
            style={{
              background: color.cream,
              border: shape.keyline,
              borderRadius: 22,
              boxShadow: shape.hardShadowSmall,
              padding: isMobile ? 22 : 28,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
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
              {careersPage.emailLabel}
            </span>
            <a
              href={`mailto:${brand.careersEmail}`}
              style={{
                fontFamily: font.sans,
                fontWeight: weight.bold,
                fontSize: 15,
                color: color.ink,
                textDecoration: 'underline',
                textUnderlineOffset: 4,
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: 44,
              }}
            >
              {brand.careersEmail}
            </a>
          </section>
        )}
      </div>
    </div>
  );
}
