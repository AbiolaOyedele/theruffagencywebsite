'use client';

import { useEffect, useRef, useState } from 'react';
import { Logo } from '@/components/ui/Logo';
import { MobileMenu } from '@/components/features/navigation/MobileMenu';
import { StepIndicator } from '@/components/features/navigation/StepIndicator';
import { color, font, primaryButton, radius, shape, weight } from '@/config/tokens';
import { useIsMobile } from '@/hooks/useIsMobile';
import { clamp, scrollToSection } from '@/utils/scroll';
import { SERVICE_STEPS } from '@/config/tokens';
import { useContent } from '@/components/providers/ContentProvider';

/** Fraction of the pinned section's scroll length used for horizontal travel. */
const HORIZONTAL_TRAVEL_RATIO = 4 / 5;
/** Cross-fade half-life when the pill swaps its contents. */
const SWAP_DELAY_MS = 500;

interface NavbarProps {
  /** Reveals the pill once the intro sequence hands over. */
  readonly revealed: boolean;
  /** Lifts the pill above the intro overlay during the handover. */
  readonly aboveOverlay: boolean;
}

/**
 * Floating pill navigation.
 *
 * Three states, all driven by scroll position:
 *  - hero:      logo and the call to action; the links stay collapsed
 *  - scrolled:  the pill widens to reveal the section links, CTA turns red
 *  - pinned:    five-dot stepper tracking the horizontal Services section
 *
 * Below `md` it collapses to a logo and a hamburger.
 */
export function Navbar({ revealed, aboveOverlay }: NavbarProps) {
  const { brand, sectionLinks } = useContent();
  const isMobile = useIsMobile();

  const [contentVisible, setContentVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [inPinnedSection, setInPinnedSection] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [activeSection, setActiveSection] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const wasAtHero = useRef(true);
  const wasPinned = useRef(false);
  const lastStep = useRef(0);
  const swapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    /** Swaps the pill's contents behind a short fade so it never jump-cuts. */
    const swapContents = (apply: () => void): void => {
      setContentVisible(false);
      if (swapTimer.current) clearTimeout(swapTimer.current);
      swapTimer.current = setTimeout(() => {
        apply();
        setContentVisible(true);
      }, SWAP_DELAY_MS);
    };

    const handleScroll = (): void => {
      const heroSection = document.getElementById('hero-section');
      const atHero =
        window.scrollY <= (heroSection ? heroSection.offsetHeight : window.innerHeight);

      // Track progress through the pinned horizontal section.
      const pinned = document.getElementById('services');
      let isPinned = false;

      if (pinned) {
        const scrolledIntoPin = Math.max(0, -pinned.getBoundingClientRect().top);
        const travel = (pinned.offsetHeight - window.innerHeight) * HORIZONTAL_TRAVEL_RATIO;
        isPinned = scrolledIntoPin > 0 && scrolledIntoPin < travel;

        if (isPinned) {
          const progress = clamp(scrolledIntoPin / travel);
          const step = Math.min(
            SERVICE_STEPS - 1,
            Math.floor(progress * SERVICE_STEPS),
          );
          if (step !== lastStep.current) {
            lastStep.current = step;
            setActiveStep(step);
          }
        }
      }

      if (isPinned !== wasPinned.current) {
        wasPinned.current = isPinned;
        swapContents(() => setInPinnedSection(isPinned));
      } else if (!isPinned) {
        if (wasAtHero.current && !atHero) {
          swapContents(() => {
            setIsScrolled(true);
            setInPinnedSection(false);
          });
        } else if (!wasAtHero.current && atHero) {
          swapContents(() => {
            setIsScrolled(false);
            setInPinnedSection(false);
          });
        }
      }
      wasAtHero.current = atHero;

      // Highlight whichever section owns the upper third of the viewport.
      let current = '';
      for (const id of ['services', 'work', 'pricing', 'faq']) {
        const element = document.querySelector<HTMLElement>(`[data-section="${id}"], #${id}`);
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.4 && rect.bottom > window.innerHeight * 0.3) {
          current = id;
        }
      }
      // Once past the horizontal travel, the stories section is what's on screen.
      if (current === 'services' && pinned) {
        const travel = (pinned.offsetHeight - window.innerHeight) * HORIZONTAL_TRAVEL_RATIO;
        if (Math.max(0, -pinned.getBoundingClientRect().top) > travel) current = 'work';
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (swapTimer.current) clearTimeout(swapTimer.current);
    };
  }, []);

  // The links only exist once you are past the hero; before that the pill
  // stays collapsed around the logo and the CTA.
  const showInnerContent = contentVisible && (isScrolled || inPinnedSection);

  const shellStyle = {
    display: 'flex',
    alignItems: 'center',
    background: color.navPill,
    borderRadius: radius.nav,
    height: 81,
    whiteSpace: 'nowrap' as const,
    border: shape.keyline,
    boxShadow: shape.hardShadowSmall,
  };

  return (
    <>
      <div
        data-main-nav
        style={{
          position: 'fixed',
          top: 16,
          left: 0,
          right: 0,
          zIndex: aboveOverlay ? 10_000 : 100,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(-200%)',
          transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.4,0,0.6,1)',
        }}
      >
        <header style={{ pointerEvents: 'auto' }}>
          {isMobile ? (
            <div
              style={{
                ...shellStyle,
                justifyContent: 'space-between',
                padding: '0 16px 0 20px',
                gap: 4,
                width: 'min(375px, calc(100vw - 32px))',
              }}
            >
              {inPinnedSection ? (
                <StepIndicator activeIndex={activeStep} compact />
              ) : (
                <Logo height={44} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
              )}
              <button
                type="button"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(true)}
                style={{
                  background: color.ink,
                  color: color.white,
                  border: shape.keyline,
                  borderRadius: radius.cta,
                  padding: '13px 16px',
                  minWidth: 56,
                  minHeight: 44,
                  cursor: 'pointer',
                  display: 'flex',
                  gap: 5,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                {[0, 1, 2].map((bar) => (
                  <span
                    key={bar}
                    style={{
                      display: 'block',
                      width: 18,
                      height: 2,
                      background: color.white,
                      borderRadius: 1,
                    }}
                  />
                ))}
              </button>
            </div>
          ) : (
            <div style={{ ...shellStyle, padding: '0 21px', gap: 24 }}>
              <Logo height={32} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: showInnerContent ? '1fr' : '0fr',
                  transition: 'grid-template-columns 0.45s cubic-bezier(0.4,0,0.2,1)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    minWidth: 0,
                    opacity: showInnerContent ? 1 : 0,
                    transition: showInnerContent ? 'opacity 0.3s ease' : 'none',
                  }}
                >
                  {inPinnedSection ? (
                    <StepIndicator activeIndex={activeStep} />
                  ) : (
                    <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {sectionLinks.map((link) => {
                        const isActive = activeSection === link.targetId;

                        return (
                          <a
                            key={link.targetId}
                            href={`#${link.targetId}`}
                            onClick={(event) => {
                              event.preventDefault();
                              scrollToSection(link.targetId);
                            }}
                            style={{
                              fontFamily: font.sans,
                              fontWeight: isActive ? weight.extrabold : weight.medium,
                              fontSize: 16,
                              color: isActive ? color.brand : color.ink,
                              textDecoration: 'none',
                              padding: '10px',
                              borderRadius: 8,
                              flexShrink: 0,
                              transition: 'color 0.2s ease',
                            }}
                          >
                            {link.label}
                          </a>
                        );
                      })}
                    </nav>
                  )}
                </div>
              </div>

              <a
                href={brand.ctaHref}
                style={{
                  ...primaryButton,
                  fontSize: 16,
                  padding: '12px 20px',
                  flexShrink: 0,
                  marginLeft: 4,
                  textDecoration: 'none',
                  transition: 'background 0.35s ease',
                }}
              >
                {brand.ctaLabel}
              </a>
            </div>
          )}
        </header>
      </div>

      {isMobile ? <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} /> : null}
    </>
  );
}
