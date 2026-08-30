'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { AccentWord } from '@/components/ui/AccentWord';
import { Logo } from '@/components/ui/Logo';
import { color, font, shape } from '@/config/tokens';
import { academy, viewTabs } from '@/content/site';
import { useCountUp } from '@/hooks/useCountUp';
import { useIsMobile } from '@/hooks/useIsMobile';

/** Number of gradient columns behind the content. */
const BAR_COUNT = 7;

/** Taller at the edges, shortest in the middle — a shallow valley. */
function barScale(index: number, total: number): number {
  const position = index / (total - 1);
  return (30 + 70 * (Math.abs(position - 0.5) * 2) ** 1.2) / 100;
}

/** Slowly pulsing gradient columns behind the Academy content. */
function PulseBars() {
  return (
    <>
      <style>{`
        @keyframes academyPulseBar {
          0% { transform: scaleY(var(--initial-scale)); }
          100% { transform: scaleY(calc(var(--initial-scale) * 0.7)); }
        }
      `}</style>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', height: '100%', width: '100%' }}>
          {Array.from({ length: BAR_COUNT }, (_unused, index) => {
            const scale = barScale(index, BAR_COUNT);
            return (
              <div
                key={index}
                style={
                  {
                    flex: `1 0 calc(100% / ${BAR_COUNT})`,
                    maxWidth: `calc(100% / ${BAR_COUNT})`,
                    height: '100%',
                    background: `linear-gradient(to top, ${color.brand}, transparent)`,
                    transform: `scaleY(${scale})`,
                    transformOrigin: 'bottom',
                    transition: 'transform 0.5s ease-in-out',
                    animation: 'academyPulseBar 2s ease-in-out infinite alternate',
                    animationDelay: `${index * 0.1}s`,
                    '--initial-scale': scale,
                  } as React.CSSProperties
                }
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

interface AcademyNavProps {
  readonly onStudio: () => void;
  readonly exiting: boolean;
}

function AcademyNav({ onStudio, exiting }: AcademyNavProps) {
  const isMobile = useIsMobile();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const visible = entered && !exiting;

  return (
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
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-200%)',
        transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.4,0,0.6,1)',
      }}
    >
      <header style={{ pointerEvents: 'auto' }}>
        {isMobile ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: color.navPill,
              borderRadius: 55,
              padding: '0 16px 0 12px',
              gap: 4,
              height: 81,
              width: 'min(375px, calc(100vw - 32px))',
            }}
          >
            <button
              type="button"
              onClick={onStudio}
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
              ← Studio
            </button>
            <Logo height={32} />
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: color.navPill,
              borderRadius: 55,
              padding: '0 21px',
              gap: 24,
              height: 81,
              whiteSpace: 'nowrap',
            }}
          >
            <Logo height={32} />
            <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  onStudio();
                }}
                style={{
                  fontFamily: font.body,
                  fontWeight: 700,
                  fontSize: 16,
                  color: color.ink,
                  textDecoration: 'none',
                  padding: '10px',
                  borderRadius: 8,
                }}
              >
                {viewTabs[0]}
              </a>
              <span
                aria-current="page"
                style={{
                  fontFamily: font.body,
                  fontWeight: 800,
                  fontSize: 16,
                  color: color.brand,
                  padding: '10px',
                }}
              >
                {viewTabs[1]}
              </span>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}

interface AcademyPageProps {
  readonly onStudio: () => void;
  readonly navExiting: boolean;
}

/**
 * "Design Academy" — a single-screen waitlist page.
 *
 * Signups are held in local state only; wire the form to a real endpoint
 * before launch.
 */
export function AcademyPage({ onStudio, navExiting }: AcademyPageProps) {
  const isMobile = useIsMobile();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { ref: counterRef, value: students } = useCountUp<HTMLElement>(
    academy.studentCount,
    2000,
    1,
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: color.ink,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <PulseBars />
      <AcademyNav onStudio={onStudio} exiting={navExiting} />

      <section
        style={{
          flex: 1,
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '120px 20px 80px' : '120px 32px 80px',
          textAlign: 'center',
          gap: 16,
        }}
      >
        <h1
          style={{
            fontFamily: font.display,
            fontWeight: 900,
            fontSize: isMobile ? 36 : 72,
            lineHeight: isMobile ? '44px' : '78px',
            letterSpacing: isMobile ? '-0.72px' : '-1.44px',
            color: color.white,
            margin: 0,
            WebkitFontSmoothing: 'antialiased',
            fontFeatureSettings: '"calt" 0, "liga" 0, "dlig" 0, "clig" 0',
          }}
        >
          Pause <AccentWord>vibing.</AccentWord>
          <br />
          {academy.headline[1]}
        </h1>

        <p
          style={{
            fontFamily: font.sans,
            fontWeight: 700,
            fontSize: isMobile ? 18 : 24,
            lineHeight: isMobile ? '28px' : '32px',
            letterSpacing: '-0.24px',
            color: 'rgba(255,255,255,0.7)',
            margin: '16px 0 0',
            maxWidth: 680,
          }}
        >
          {academy.bodyBefore}
          <strong ref={counterRef} style={{ color: color.white, fontWeight: 700 }}>
            {students >= academy.studentCount ? `${academy.studentCount}+` : students} students
          </strong>
          {academy.bodyAfter}
        </p>

        {submitted ? (
          <p
            role="status"
            style={{
              padding: '20px 32px',
              background: color.brand,
              borderRadius: 9999,
              fontFamily: font.body,
              fontWeight: 700,
              fontSize: 16,
              color: color.white,
              margin: '12px 0 0',
            }}
          >
            {academy.successMessage}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 12,
              width: '100%',
              maxWidth: 480,
              marginTop: 12,
            }}
          >
            <label htmlFor="academy-email" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)', whiteSpace: 'nowrap' }}>
              Email address
            </label>
            <input
              id="academy-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              style={{
                flex: 1,
                padding: '16px 20px',
                minHeight: 44,
                borderRadius: 9999,
                border: shape.keyline,
                background: color.white,
                fontFamily: font.body,
                fontWeight: 500,
                fontSize: 16,
                color: color.ink,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              style={{
                background: color.brand,
                color: color.white,
                border: shape.keyline,
                borderRadius: 9999,
                padding: '16px 28px',
                minHeight: 44,
                cursor: 'pointer',
                fontFamily: font.body,
                fontWeight: 700,
                fontSize: 16,
                whiteSpace: 'nowrap',
              }}
            >
              {academy.cta}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
