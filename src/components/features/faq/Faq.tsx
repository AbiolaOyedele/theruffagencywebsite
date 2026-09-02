'use client';

import { useId, useState } from 'react';
import { color, font } from '@/config/tokens';
import { useIsMobile } from '@/hooks/useIsMobile';
import type { FaqItem } from '@/types/content';
import { useContent } from '@/components/providers/ContentProvider';

interface AccordionRowProps {
  readonly item: FaqItem;
  readonly isOpen: boolean;
  readonly onToggle: () => void;
}

/** One accordion row; the plus rotates into a minus as it opens. */
function AccordionRow({ item, isOpen, onToggle }: AccordionRowProps) {
  const panelId = useId();

  return (
    <div
      style={{
        background: isOpen ? 'rgba(255,255,255,0.05)' : 'transparent',
        borderRadius: 16,
        transition: 'background 0.3s ease',
      }}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          gap: 16,
          alignItems: 'flex-start',
          cursor: 'pointer',
          background: 'none',
          border: 'none',
          padding: 24,
          textAlign: 'left',
        }}
      >
        <span
          style={{
            width: 24,
            height: 24,
            flexShrink: 0,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke={isOpen ? color.brand : 'rgba(255,255,255,0.3)'}
              strokeWidth="1.5"
              style={{ transition: 'stroke 0.3s ease' }}
            />
            <path
              d="M8 12h8"
              stroke={isOpen ? color.brand : 'rgba(255,255,255,0.5)'}
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{ transition: 'stroke 0.3s ease' }}
            />
            <path
              d="M12 8v8"
              stroke={isOpen ? color.brand : 'rgba(255,255,255,0.5)'}
              strokeWidth="1.5"
              strokeLinecap="round"
              style={{
                transformOrigin: '12px 12px',
                transform: isOpen ? 'rotate(90deg) scaleY(0)' : 'rotate(0deg) scaleY(1)',
                transition:
                  'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.3s ease',
              }}
            />
          </svg>
        </span>

        <span
          style={{
            flex: 1,
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              fontFamily: font.body,
              fontWeight: 700,
              fontSize: 16,
              color: isOpen ? color.brand : color.white,
              lineHeight: '24px',
              transition: 'color 0.25s ease',
            }}
          >
            {item.question}
          </span>

          {/* Grid rows animate from 0fr to 1fr, so the answer expands to its
              natural height without measuring anything. */}
          <span
            id={panelId}
            style={{
              display: 'grid',
              gridTemplateRows: isOpen ? '1fr' : '0fr',
              opacity: isOpen ? 1 : 0,
              transition:
                'grid-template-rows 0.5s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.35s ease',
            }}
          >
            <span style={{ overflow: 'hidden', minHeight: 0 }}>
              <span
                style={{
                  display: 'block',
                  fontFamily: font.body,
                  fontWeight: 300,
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: '24px',
                  margin: '8px 0 0',
                }}
              >
                {item.answer}
              </span>
            </span>
          </span>
        </span>
      </button>
    </div>
  );
}

/**
 * FAQ panel. One row open at a time, the first open by default. Its rounded
 * bottom corners are animated by the footer reveal as the page scrolls past.
 */
export function Faq() {
  const { faq } = useContent();
  const isMobile = useIsMobile();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      data-section="faq"
      style={{
        background: color.ink,
        padding: isMobile ? '64px 16px' : '96px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: isMobile ? 40 : 64,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          maxWidth: 768,
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: font.display,
            fontWeight: 800,
            fontSize: isMobile ? 28 : 36,
            lineHeight: '44px',
            letterSpacing: '-0.72px',
            color: color.white,
            margin: 0,
          }}
        >
          {faq.headline}
        </h2>
        <p
          style={{
            fontFamily: font.body,
            fontWeight: 300,
            fontSize: isMobile ? 16 : 20,
            color: 'rgba(255,255,255,0.5)',
            lineHeight: '30px',
            margin: 0,
          }}
        >
          {faq.subhead}
        </p>
      </div>

      <div
        style={{
          maxWidth: 768,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {faq.items.map((item, index) => (
          <AccordionRow
            key={item.question}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
          />
        ))}
      </div>
    </section>
  );
}
