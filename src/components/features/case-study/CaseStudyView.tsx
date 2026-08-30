'use client';

import { useEffect, useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import { color, font, primaryButton, shape } from '@/config/tokens';
import { brand, caseStudyChrome } from '@/content/site';
import { useIsMobile } from '@/hooks/useIsMobile';
import type { CaseStudy } from '@/types/content';

interface CaseStudyViewProps {
  readonly study: CaseStudy;
  readonly onBack: () => void;
}

/**
 * Full case-study page, opened from a story card.
 *
 * Dark hero with the engagement stats, then the narrative sections, the
 * tickets that made up the work, and a screenshot gallery.
 */
export function CaseStudyView({ study, onBack }: CaseStudyViewProps) {
  const isMobile = useIsMobile();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const raf = requestAnimationFrame(() => setReady(true));

    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', handleKey);
    };
  }, [onBack]);

  const stats: readonly { value: string; label: string }[] = (
    [
      { value: study.duration, label: 'Duration' },
      { value: study.deliverables, label: 'Deliverables' },
      { value: study.credits?.length ? `${study.credits.length}` : undefined, label: 'Team' },
    ] as { value?: string; label: string }[]
  ).flatMap((stat) => (stat.value ? [{ value: stat.value, label: stat.label }] : []));

  return (
    <div style={{ background: color.paperAlt, minHeight: '100vh' }}>
      <div
        style={{
          position: 'fixed',
          top: 16,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <header
          style={{
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? 12 : 24,
            background: color.navPill,
            borderRadius: 55,
            height: isMobile ? 64 : 81,
            padding: isMobile ? '0 12px 0 12px' : '0 21px',
          }}
        >
          <button
            type="button"
            onClick={onBack}
            style={{
              background: color.ink,
              color: color.white,
              border: 'none',
              borderRadius: 43,
              padding: '12px 18px',
              minHeight: 44,
              cursor: 'pointer',
              fontFamily: font.body,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {caseStudyChrome.back}
          </button>
          <Logo height={isMobile ? 26 : 32} />
        </header>
      </div>

      <section
        style={{
          background: color.ink,
          padding: isMobile ? '128px 20px 64px' : '180px 32px 96px',
          borderBottomLeftRadius: 42,
          borderBottomRightRadius: 42,
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: '0 auto',
            opacity: ready ? 1 : 0,
            transform: ready ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}
        >
          <p
            style={{
              fontFamily: font.sans,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '0.12em',
              color: color.accentPink,
              margin: '0 0 24px',
            }}
          >
            {study.collaboration ?? study.client}
          </p>

          {study.placeholder ? (
            <p
              role="status"
              style={{
                display: 'inline-block',
                fontFamily: font.sans,
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: color.ink,
                background: color.accentPink,
                border: shape.keyline,
                borderRadius: 999,
                padding: '8px 16px',
                margin: '0 0 24px',
              }}
            >
              Placeholder copy — awaiting the real write-up
            </p>
          ) : null}

          <h1
            style={{
              fontFamily: font.display,
              fontWeight: 900,
              fontSize: isMobile ? 34 : 'clamp(40px, 5vw, 68px)',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: color.white,
              margin: 0,
            }}
          >
            {study.title ?? study.client}
          </h1>

          {study.summary ? (
            <p
              style={{
                fontFamily: font.body,
                fontWeight: 300,
                fontSize: isMobile ? 16 : 20,
                color: 'rgba(255,255,255,0.6)',
                lineHeight: 1.6,
                margin: '24px 0 0',
                maxWidth: 640,
              }}
            >
              {study.summary}
            </p>
          ) : null}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(3, 160px)',
              gap: 16,
              marginTop: 48,
            }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 16,
                  padding: isMobile ? '16px 14px' : '20px 24px',
                }}
              >
                <p
                  style={{
                    fontFamily: font.sans,
                    fontWeight: 900,
                    fontSize: isMobile ? 26 : 32,
                    color: color.white,
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontFamily: font.body,
                    fontWeight: 500,
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.5)',
                    margin: '8px 0 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: isMobile ? '56px 20px 80px' : '96px 32px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? 56 : 88,
        }}
      >
        {study.quote ? (
          <blockquote
            style={{
              margin: 0,
              borderLeft: `3px solid ${color.brand}`,
              paddingLeft: 24,
            }}
          >
            <p
              style={{
                fontFamily: font.display,
                fontWeight: 700,
                fontSize: isMobile ? 20 : 28,
                lineHeight: 1.35,
                color: color.ink,
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              “{study.quote}”
            </p>
            <footer
              style={{
                fontFamily: font.body,
                fontSize: 14,
                color: color.muted,
                marginTop: 16,
              }}
            >
              {[study.authorName, study.authorRole].filter(Boolean).join(' — ')}
            </footer>
          </blockquote>
        ) : null}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {(study.sections ?? []).map((section) => (
            <section key={section.heading}>
              <h2
                style={{
                  fontFamily: font.display,
                  fontWeight: 800,
                  fontSize: isMobile ? 26 : 36,
                  letterSpacing: '-0.02em',
                  color: color.ink,
                  margin: '0 0 16px',
                }}
              >
                {section.heading}
              </h2>
              <p
                style={{
                  fontFamily: font.body,
                  fontWeight: 300,
                  fontSize: isMobile ? 16 : 18,
                  color: color.muted,
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                {section.body}
              </p>
            </section>
          ))}
        </div>

        {study.tickets?.length ? (
          <section>
            <h2
              style={{
                fontFamily: font.display,
                fontWeight: 800,
                fontSize: isMobile ? 26 : 36,
                letterSpacing: '-0.02em',
                color: color.ink,
                margin: '0 0 24px',
              }}
            >
              {caseStudyChrome.ticketsHeading}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(study.tickets ?? []).map((ticket) => (
                <article
                  key={ticket.title}
                  style={{
                    background: color.white,
                    borderRadius: 20,
                    padding: isMobile ? 24 : 32,
                    border: `1px solid ${color.border}`,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: font.body,
                      fontWeight: 700,
                      fontSize: isMobile ? 17 : 20,
                      color: color.ink,
                      margin: '0 0 12px',
                    }}
                  >
                    {ticket.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: font.body,
                      fontWeight: 300,
                      fontSize: 16,
                      color: color.muted,
                      lineHeight: 1.65,
                      margin: 0,
                    }}
                  >
                    {ticket.request}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {study.gallery?.length ? (
          <section>
            <h2
              style={{
                fontFamily: font.display,
                fontWeight: 800,
                fontSize: isMobile ? 26 : 36,
                letterSpacing: '-0.02em',
                color: color.ink,
                margin: '0 0 24px',
              }}
            >
              {caseStudyChrome.workHeading}
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: 16,
              }}
            >
              {(study.gallery ?? []).map((item) => (
                <figure key={item.src} style={{ margin: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- gallery art of unknown intrinsic size */}
                  <img
                    src={item.src}
                    alt={item.caption}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 20,
                      display: 'block',
                      background: color.paper,
                    }}
                  />
                  <figcaption
                    style={{
                      fontFamily: font.body,
                      fontSize: 13,
                      color: color.muted,
                      marginTop: 12,
                    }}
                  >
                    {item.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : null}

        <section
          style={{
            background: color.ink,
            borderRadius: 24,
            padding: isMobile ? 32 : 48,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: font.display,
                fontWeight: 800,
                fontSize: isMobile ? 26 : 32,
                color: color.white,
                margin: '0 0 8px',
                letterSpacing: '-0.02em',
              }}
            >
              {caseStudyChrome.ctaHeading}
            </h2>
            <p
              style={{
                fontFamily: font.body,
                fontSize: 16,
                color: 'rgba(255,255,255,0.6)',
                margin: 0,
              }}
            >
              {caseStudyChrome.ctaBody}
            </p>
          </div>
          <a
            href={brand.bookACallUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...primaryButton, padding: '16px 32px', fontSize: 16, whiteSpace: 'nowrap' }}
          >
            {caseStudyChrome.ctaButton}
          </a>
        </section>
      </div>
    </div>
  );
}
