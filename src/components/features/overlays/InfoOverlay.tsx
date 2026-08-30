'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { color, font } from '@/config/tokens';
import { brand, contact, privacyPolicy, termsOfService } from '@/content/site';
import { setScrollLocked } from '@/utils/scroll';
import type { LegalSection, OverlayKey } from '@/types/content';

type Phase = 'enter' | 'open' | 'exit';

/** Inset of the opened panel from the viewport edges. */
const PANEL_INSET = 32;

function LegalBody({ sections }: { readonly sections: readonly LegalSection[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {sections.map((section) => (
        <section key={section.heading}>
          <h2
            style={{
              fontFamily: font.body,
              fontWeight: 700,
              fontSize: 18,
              color: color.ink,
              margin: '0 0 8px',
            }}
          >
            {section.heading}
          </h2>
          <p
            style={{
              fontFamily: font.body,
              fontWeight: 300,
              fontSize: 16,
              color: color.muted,
              lineHeight: '26px',
              margin: 0,
            }}
          >
            {section.body}
          </p>
        </section>
      ))}
    </div>
  );
}

function ContactBody() {
  const rows = [
    { label: 'Email', content: <a href={`mailto:${brand.email}`}>{brand.email}</a> },
    {
      label: 'Based in',
      content: (
        <>
          {brand.basedIn[0]}
          <br />
          <span style={{ color: color.muted }}>{brand.basedIn[1]}</span>
        </>
      ),
    },
    {
      label: 'Book a call',
      content: (
        <a href={brand.bookACallUrl} target="_blank" rel="noopener noreferrer">
          {contact.bookACallLabel}
        </a>
      ),
    },
    // TODO: awaiting the social handle. The row stays hidden until then
    // rather than shipping a dead link.
    ...(brand.socialUrl
      ? [
          {
            label: 'Social',
            content: (
              <a href={brand.socialUrl} target="_blank" rel="noopener noreferrer">
                {brand.socialLabel}
              </a>
            ),
          },
        ]
      : []),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <p
        style={{
          fontFamily: font.body,
          fontWeight: 300,
          fontSize: 18,
          color: color.muted,
          lineHeight: '30px',
          margin: 0,
        }}
      >
        {contact.intro}
      </p>

      {rows.map((row) => (
        <div key={row.label}>
          <p
            style={{
              fontFamily: font.sans,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: color.muted,
              margin: '0 0 8px',
            }}
          >
            {row.label}
          </p>
          <p
            style={{
              fontFamily: font.body,
              fontWeight: 500,
              fontSize: 18,
              color: color.ink,
              lineHeight: '28px',
              margin: 0,
            }}
          >
            {row.content}
          </p>
        </div>
      ))}
    </div>
  );
}

const PANELS: Record<OverlayKey, { title: string; subtitle?: string; body: ReactNode }> = {
  contact: { title: contact.title, body: <ContactBody /> },
  privacy: {
    title: privacyPolicy.title,
    subtitle: privacyPolicy.updated,
    body: <LegalBody sections={privacyPolicy.sections} />,
  },
  terms: {
    title: termsOfService.title,
    subtitle: termsOfService.updated,
    body: <LegalBody sections={termsOfService.sections} />,
  },
};

interface InfoOverlayProps {
  readonly panel: OverlayKey;
  /** Bounding box of the link that opened it, so the panel grows out of it. */
  readonly origin: DOMRect | null;
  readonly onClose: () => void;
}

/**
 * Contact / Privacy / Terms panel.
 *
 * Expands out of the link that opened it to a near-fullscreen sheet over a
 * blurred backdrop. Closes on the button, the backdrop, or Escape.
 */
export function InfoOverlay({ panel, origin, onClose }: InfoOverlayProps) {
  const [phase, setPhase] = useState<Phase>('enter');
  const content = PANELS[panel];

  const beginClose = useCallback(() => {
    setPhase('exit');
    setTimeout(onClose, 400);
  }, [onClose]);

  useEffect(() => {
    setScrollLocked(true);
    const nav = document.querySelector<HTMLElement>('[data-main-nav]');
    if (nav) {
      nav.style.visibility = 'hidden';
      nav.style.pointerEvents = 'none';
    }

    // Two frames: mount at the origin rect, then animate to the open size.
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase('open'));
    });

    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') beginClose();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      cancelAnimationFrame(raf);
      setScrollLocked(false);
      if (nav) {
        nav.style.visibility = '';
        nav.style.pointerEvents = '';
      }
      window.removeEventListener('keydown', handleKey);
    };
  }, [beginClose]);

  const from =
    origin ??
    new DOMRect(window.innerWidth / 2 - 100, window.innerHeight / 2 - 50, 200, 40);
  const isOpen = phase === 'open';
  const isExiting = phase === 'exit';
  const settled = isOpen || isExiting;

  return (
    <>
      <div
        onClick={beginClose}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10_001,
          background: 'rgba(10, 13, 18, 0.5)',
          backdropFilter: isOpen ? 'blur(12px)' : 'blur(0px)',
          WebkitBackdropFilter: isOpen ? 'blur(12px)' : 'blur(0px)',
          opacity: isExiting ? 0 : isOpen ? 1 : 0,
          transition:
            'opacity 0.4s ease, backdrop-filter 0.4s ease, -webkit-backdrop-filter 0.4s ease',
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={content.title}
        style={{
          position: 'fixed',
          zIndex: 10_002,
          top: settled ? PANEL_INSET : from.top,
          left: settled ? PANEL_INSET : from.left,
          width: settled ? `calc(100vw - ${PANEL_INSET * 2}px)` : from.width,
          height: settled ? `calc(100dvh - ${PANEL_INSET * 2}px)` : from.height,
          borderRadius: 24,
          overflow: 'hidden',
          background: color.white,
          isolation: 'isolate',
          boxShadow: isOpen ? '0 32px 80px rgba(0,0,0,0.25)' : '0 8px 32px rgba(0,0,0,0.2)',
          opacity: isExiting ? 0 : 1,
          transform: isExiting ? 'scale(0.97)' : 'scale(1)',
          transition: isExiting
            ? 'all 0.35s cubic-bezier(0.4, 0, 0.6, 1)'
            : phase === 'enter'
              ? 'none'
              : 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          data-lenis-prevent
          style={{
            width: '100%',
            height: '100%',
            overflowY: isOpen ? 'auto' : 'hidden',
            overflowX: 'hidden',
          }}
        >
          <div style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px 120px' }}>
            <h1
              style={{
                fontFamily: font.display,
                fontWeight: 900,
                fontSize: 'clamp(32px, 4vw, 52px)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: color.ink,
                margin: content.subtitle ? '0 0 8px' : '0 0 40px',
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateY(0)' : 'translateY(16px)',
                transition:
                  'opacity 0.4s ease 0.2s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
              }}
            >
              {content.title}
            </h1>

            {content.subtitle ? (
              <p
                style={{
                  fontFamily: font.body,
                  fontSize: 14,
                  color: color.muted,
                  margin: '0 0 40px',
                  opacity: isOpen ? 1 : 0,
                  transition: 'opacity 0.4s ease 0.25s',
                }}
              >
                {content.subtitle}
              </p>
            ) : null}

            <div style={{ opacity: isOpen ? 1 : 0, transition: 'opacity 0.4s ease 0.3s' }}>
              {content.body}
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Close"
          onClick={beginClose}
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            zIndex: 3,
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(0,0,0,0.06)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
            opacity: isOpen ? 1 : 0,
            transition: 'opacity 0.3s ease 0.35s',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color.ink}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </div>
    </>
  );
}
