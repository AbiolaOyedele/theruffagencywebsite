'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AutoplayVideo } from '@/components/ui/AutoplayVideo';
import { color, font, primaryButton, shape, weight } from '@/config/tokens';
import { brand, caseStudyChrome } from '@/content/site';
import { useIsMobile } from '@/hooks/useIsMobile';
import { clamp, setScrollLocked } from '@/utils/scroll';
import type { CaseStudy } from '@/types/content';

type Phase = 'enter' | 'open' | 'fadein' | 'exit';

/** Inset of the opened panel from the viewport edges. */
const PANEL_INSET = 32;
/** Tilt of each brief card pinned to the gallery, cycled down the page. */
const CARD_ROTATIONS = [3, -2.5, 2] as const;

/** How long the exit animation runs before the panel unmounts. */
const EXIT_MS = 400;

interface CaseStudyPanelProps {
  readonly study: CaseStudy;
  /**
   * Bounding box of the card that opened it, so the panel grows out of the
   * card rather than appearing from nowhere. Null when deep-linked, which
   * fades the panel in instead.
   */
  readonly fromRect: DOMRect | null;
  readonly onClose: () => void;
}

/**
 * A client's story, as an overlay panel over the page rather than a route.
 *
 * Expands out of the card that opened it to a near-fullscreen sheet with its
 * own scroll: a parallaxed video hero, then a sticky contents rail beside the
 * narrative. Closes on Escape, the backdrop, or the close button.
 */
export function CaseStudyPanel({ study, fromRect, onClose }: CaseStudyPanelProps) {
  const isMobile = useIsMobile();
  const [phase, setPhase] = useState<Phase>(fromRect ? 'enter' : 'fadein');
  const [scrollTop, setScrollTop] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const beginClose = useCallback(() => {
    setPhase('exit');
    setTimeout(onClose, EXIT_MS);
  }, [onClose]);

  useEffect(() => {
    setScrollLocked(true);
    const nav = document.querySelector<HTMLElement>('[data-main-nav]');
    if (nav) {
      nav.style.visibility = 'hidden';
      nav.style.pointerEvents = 'none';
    }

    // Two frames: mount at the card's rect, then animate out to full size.
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase((current) => (current === 'exit' ? current : 'open')));
    });

    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') beginClose();
    };
    window.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf);
      setScrollLocked(false);
      if (nav) {
        nav.style.visibility = '';
        nav.style.pointerEvents = '';
      }
      window.removeEventListener('keydown', onKey);
    };
  }, [beginClose]);

  // Gallery art and the brief cards pinned to it drift at their own rates as
  // the panel scrolls, so the page has depth rather than sliding as one sheet.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const images = scroller.querySelectorAll<HTMLElement>('[data-parallax-gallery]');
    const cards = scroller.querySelectorAll<HTMLElement>('[data-parallax-card]');
    if (images.length === 0 && cards.length === 0) return;

    /** How far through the viewport an element's frame has travelled, -0.5 → 0.5. */
    const travel = (node: HTMLElement): number | null => {
      const frame = node.parentElement;
      if (!frame) return null;
      const bounds = frame.getBoundingClientRect();
      const through = (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height);
      return clamp(through) - 0.5;
    };

    const update = (): void => {
      for (const image of images) {
        const at = travel(image);
        if (at !== null) image.style.transform = `scale(1.08) translateY(${at * -40}px)`;
      }
      for (const card of cards) {
        const at = travel(card);
        if (at === null) continue;
        const rotation = card.getAttribute('data-card-rotation') ?? '0';
        card.style.transform = `translateY(${at * 80}px) rotate(${rotation}deg)`;
      }
    };

    scroller.addEventListener('scroll', update, { passive: true });
    update();
    return () => scroller.removeEventListener('scroll', update);
  }, [phase]);

  // Only ever mounted from a client-side route change, so there is no server
  // pass to guard against — but `document` still has to exist for the portal.
  if (typeof document === 'undefined') return null;

  const inset = isMobile ? 0 : PANEL_INSET;
  const settled = phase === 'open' || phase === 'fadein' || phase === 'exit';
  const isOpen = phase === 'open' || phase === 'fadein';
  const isExiting = phase === 'exit';
  const origin =
    fromRect ??
    new DOMRect(window.innerWidth / 2 - 140, window.innerHeight / 2 - 185, 280, 370);

  const sections = study.sections ?? [];
  const tickets = study.tickets ?? [];
  const gallery = study.gallery ?? [];
  const credits = study.credits ?? [];

  const railLabel = {
    fontFamily: font.sans,
    fontWeight: weight.bold,
    fontSize: 14,
    color: color.muted,
    margin: '0 0 12px',
  } as const;

  const panel = (
    <>
      <div
        onClick={beginClose}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10_001,
          background: 'rgba(37, 2, 0, 0.5)',
          backdropFilter: isOpen ? 'blur(12px)' : 'blur(0px)',
          WebkitBackdropFilter: isOpen ? 'blur(12px)' : 'blur(0px)',
          opacity: isExiting ? 0 : isOpen ? 1 : 0,
          transition: isExiting
            ? 'opacity 0.35s ease'
            : 'opacity 0.4s ease, backdrop-filter 0.5s ease',
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${study.client} story`}
        style={{
          position: 'fixed',
          zIndex: 10_002,
          top: settled ? inset : origin.top,
          left: settled ? inset : origin.left,
          width: settled ? `calc(100vw - ${inset * 2}px)` : origin.width,
          height: settled ? `calc(100dvh - ${inset * 2}px)` : origin.height,
          borderRadius: isMobile ? 0 : 24,
          overflow: 'hidden',
          background: color.paperAlt,
          isolation: 'isolate',
          border: isMobile ? 'none' : shape.keyline,
          boxShadow: '0 32px 80px rgba(37,2,0,0.25)',
          opacity: isExiting ? 0 : 1,
          transform: isExiting ? 'scale(0.97)' : 'scale(1)',
          transition: isExiting
            ? 'all 0.35s cubic-bezier(0.4, 0, 0.6, 1)'
            : phase === 'enter'
              ? 'none'
              : 'opacity 0.4s ease, top 0.5s cubic-bezier(0.16, 1, 0.3, 1), left 0.5s cubic-bezier(0.16, 1, 0.3, 1), width 0.5s cubic-bezier(0.16, 1, 0.3, 1), height 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <div
          ref={scrollerRef}
          data-lenis-prevent
          onScroll={() => setScrollTop(scrollerRef.current?.scrollTop ?? 0)}
          style={{
            width: '100%',
            height: '100%',
            overflowY: isOpen ? 'auto' : 'hidden',
            overflowX: 'hidden',
          }}
        >
          {/* Video hero. The footage and the title drift at different rates,
              which is what gives the panel its depth as you start scrolling. */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '50vh',
              minHeight: 320,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {study.video ? (
              <AutoplayVideo
                src={study.video}
                style={{
                  position: 'absolute',
                  inset: '-20% 0',
                  width: '100%',
                  height: '140%',
                  objectFit: 'cover',
                  transform: `translateY(${scrollTop * 0.3}px)`,
                  willChange: 'transform',
                }}
              />
            ) : null}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '-20% 0',
                width: '100%',
                height: '140%',
                background: 'rgba(37, 2, 0, 0.85)',
                transform: `translateY(${scrollTop * 0.3}px)`,
                willChange: 'transform',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 16,
                padding: isMobile ? '48px 20px' : '64px 48px',
                transform: `translateY(${scrollTop * -0.15}px)`,
                willChange: 'transform',
              }}
            >
              <p
                style={{
                  fontFamily: font.sans,
                  fontWeight: weight.bold,
                  fontSize: 12,
                  letterSpacing: '0.12em',
                  color: color.accentPink,
                  margin: 0,
                }}
              >
                {study.collaboration ?? study.client}
              </p>
              <h1
                style={{
                  fontFamily: font.display,
                  fontWeight: weight.black,
                  fontSize: isMobile ? 28 : 'clamp(28px, 4vw, 56px)',
                  lineHeight: 1.05,
                  letterSpacing: '-0.02em',
                  color: color.white,
                  margin: 0,
                  maxWidth: 700,
                }}
              >
                {study.title ?? study.client}
              </h1>
              {study.placeholder ? (
                <span
                  style={{
                    alignSelf: 'flex-start',
                    fontFamily: font.sans,
                    fontWeight: weight.bold,
                    fontSize: 11,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: color.ink,
                    background: color.accentPink,
                    borderRadius: 999,
                    padding: '7px 14px',
                  }}
                >
                  Placeholder copy — awaiting the real write-up
                </span>
              ) : null}
            </div>
          </div>

          {/* Body. Fades up once the panel has finished expanding. */}
          <div
            style={{
              padding: isMobile ? '24px 20px 0' : '32px 32px 0',
              opacity: isOpen && phase !== 'fadein' ? 1 : phase === 'fadein' ? 1 : 0,
              transform: isOpen ? 'translateY(0)' : 'translateY(24px)',
              transition:
                'opacity 0.5s ease 0.45s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.45s',
            }}
          >
            <div
              style={{
                maxWidth: 1100,
                margin: '0 auto',
                padding: isMobile ? '24px 0 48px' : '32px 0 80px',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 40 : 64,
                alignItems: 'flex-start',
              }}
            >
              {/* Contents rail */}
              <aside
                style={{
                  position: isMobile ? 'static' : 'sticky',
                  top: 32,
                  flex: isMobile ? undefined : '0 0 240px',
                  width: isMobile ? '100%' : 240,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 40,
                }}
              >
                {sections.length ? (
                  <div>
                    <p style={railLabel}>Table of contents</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {sections.map((section) => (
                        <button
                          key={section.heading}
                          type="button"
                          onClick={() =>
                            scrollerRef.current
                              ?.querySelector(`#uc-${slugify(section.heading)}`)
                              ?.scrollIntoView({ behavior: 'smooth' })
                          }
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontFamily: font.body,
                            fontWeight: weight.light,
                            fontSize: 15,
                            color: color.ink,
                          }}
                        >
                          {section.heading}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {credits.length ? (
                  <div>
                    <p style={railLabel}>Team</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {credits.map((person) => (
                        <div
                          key={`${person.name}-${person.role}`}
                          style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                        >
                          <span
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              background: color.accentPink,
                              border: shape.keyline,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontFamily: font.sans,
                              fontWeight: weight.bold,
                              fontSize: 14,
                              color: color.ink,
                              flexShrink: 0,
                            }}
                          >
                            {person.name.slice(0, 1)}
                          </span>
                          <div>
                            <p
                              style={{
                                fontFamily: font.sans,
                                fontWeight: weight.bold,
                                fontSize: 14,
                                color: color.ink,
                                margin: 0,
                              }}
                            >
                              {person.name}
                            </p>
                            <p
                              style={{
                                fontFamily: font.body,
                                fontWeight: weight.light,
                                fontSize: 12,
                                color: color.muted,
                                margin: 0,
                              }}
                            >
                              {person.role}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div>
                  <p style={railLabel}>{caseStudyChrome.ctaHeading}</p>
                  <a
                    href={brand.bookACallUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...primaryButton, width: '100%', padding: '14px 0', fontSize: 14 }}
                  >
                    {caseStudyChrome.ctaButton}
                  </a>
                </div>
              </aside>

              {/* Narrative */}
              <div
                style={{
                  flex: '1 1 auto',
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: isMobile ? 48 : 64,
                }}
              >
                {sections.map((section, index) => (
                  <div key={section.heading}>
                    <section id={`uc-${slugify(section.heading)}`} style={{ scrollMarginTop: 24 }}>
                      <h2
                        style={{
                          fontFamily: font.display,
                          fontWeight: weight.extrabold,
                          fontSize: isMobile ? 24 : 28,
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
                          fontWeight: weight.light,
                          fontSize: 16,
                          lineHeight: 1.75,
                          color: color.muted,
                          margin: 0,
                        }}
                      >
                        {section.body}
                      </p>
                    </section>

                    {/* The gallery breaks the reading up after the third beat.
                        Each image carries the brief it came from, pinned to its
                        corner on a card that drifts as the panel scrolls. */}
                    {index === 2 && gallery.length ? (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: isMobile ? 28 : 56,
                          margin: isMobile ? '32px 0 32px' : '48px 0 64px',
                        }}
                      >
                        {gallery.map((item, galleryIndex) => {
                          const ticket = tickets[galleryIndex];
                          const rotation = CARD_ROTATIONS[galleryIndex % CARD_ROTATIONS.length] ?? 0;
                          const onRight = galleryIndex % 2 === 0;

                          return (
                            <div key={item.src} style={{ position: 'relative' }}>
                              <div
                                style={{
                                  borderRadius: 18,
                                  overflow: 'hidden',
                                  border: shape.keyline,
                                  boxShadow: shape.hardShadow,
                                  background: color.paper,
                                }}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element -- gallery art of unknown intrinsic size */}
                                <img
                                  src={item.src}
                                  alt={item.caption}
                                  loading="lazy"
                                  data-parallax-gallery
                                  style={{
                                    width: '100%',
                                    height: 'auto',
                                    display: 'block',
                                    transform: 'scale(1.08)',
                                  }}
                                />
                              </div>

                              {ticket && !isMobile ? (
                                <div
                                  data-parallax-card
                                  data-card-rotation={rotation}
                                  style={{
                                    position: 'absolute',
                                    bottom: -32,
                                    ...(onRight ? { right: -20 } : { left: -20 }),
                                    width: 280,
                                    background: color.paperAlt,
                                    borderRadius: 22,
                                    border: shape.keyline,
                                    boxShadow: shape.hardShadow,
                                    padding: 8,
                                    transform: `rotate(${rotation}deg)`,
                                    zIndex: 2,
                                  }}
                                >
                                  <div
                                    style={{
                                      background: color.ink,
                                      borderRadius: 15,
                                      padding: '28px 22px',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: 12,
                                      minHeight: 260,
                                    }}
                                  >
                                    <p
                                      style={{
                                        fontFamily: font.sans,
                                        fontWeight: weight.bold,
                                        fontSize: 18,
                                        lineHeight: 1.2,
                                        color: color.white,
                                        margin: 0,
                                      }}
                                    >
                                      {ticket.title}
                                    </p>
                                    <p
                                      style={{
                                        fontFamily: font.body,
                                        fontWeight: weight.light,
                                        fontSize: 13,
                                        lineHeight: '20px',
                                        color: 'rgba(255,255,255,0.7)',
                                        margin: 0,
                                      }}
                                    >
                                      {ticket.request}
                                    </p>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                ))}

                {tickets.length && (isMobile || !gallery.length) ? (
                  <section>
                    <h2
                      style={{
                        fontFamily: font.display,
                        fontWeight: weight.extrabold,
                        fontSize: isMobile ? 24 : 28,
                        letterSpacing: '-0.02em',
                        color: color.ink,
                        margin: '0 0 20px',
                      }}
                    >
                      {caseStudyChrome.ticketsHeading}
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {tickets.map((ticket) => (
                        <article
                          key={ticket.title}
                          style={{
                            background: color.white,
                            borderRadius: 20,
                            border: shape.keyline,
                            boxShadow: shape.hardShadowSmall,
                            padding: isMobile ? 22 : 28,
                          }}
                        >
                          <h3
                            style={{
                              fontFamily: font.sans,
                              fontWeight: weight.bold,
                              fontSize: isMobile ? 17 : 20,
                              color: color.ink,
                              margin: '0 0 10px',
                            }}
                          >
                            {ticket.title}
                          </h3>
                          <p
                            style={{
                              fontFamily: font.body,
                              fontWeight: weight.light,
                              fontSize: 15,
                              lineHeight: 1.65,
                              color: color.muted,
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
              </div>
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
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: shape.keyline,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
            aria-hidden="true"
          >
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </div>
    </>
  );

  return createPortal(panel, document.body);
}

/** Turns a heading into an id the contents rail can jump to. */
function slugify(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
