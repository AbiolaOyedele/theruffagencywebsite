'use client';

import { useEffect } from 'react';
import { color, font, primaryButton } from '@/config/tokens';
import { brand, sectionLinks } from '@/content/site';
import { scrollToSection, setScrollLocked } from '@/utils/scroll';

interface MobileMenuProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

/** Full-screen navigation overlay shown below the `md` breakpoint. */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (!open) return;

    setScrollLocked(true);
    const handleKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      setScrollLocked(false);
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10_001,
        background: color.ink,
        display: 'flex',
        flexDirection: 'column',
        padding: '0 24px',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 0.3s ease',
        height: '100dvh',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '24px 0' }}>
        <button
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 8,
            minWidth: 44,
            minHeight: 44,
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M6 6l16 16M22 6L6 22" stroke={color.brand} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          flex: 1,
          justifyContent: 'center',
        }}
      >
        {sectionLinks.map((link) => (
          <a
            key={link.targetId}
            href={`#${link.targetId}`}
            onClick={(event) => {
              event.preventDefault();
              onClose();
              setTimeout(() => scrollToSection(link.targetId), 300);
            }}
            style={{
              fontFamily: font.display,
              fontWeight: 900,
              fontSize: 48,
              color: color.brand,
              textDecoration: 'none',
              lineHeight: 1.2,
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div style={{ paddingBottom: 32 }}>
        <a
          href={brand.bookACallUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          style={{ ...primaryButton, display: 'flex', width: '100%', padding: '18px 24px', fontSize: 18 }}
        >
          Book a call
        </a>
      </div>
    </div>
  );
}
