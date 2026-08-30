'use client';

import { useRef, useState } from 'react';
import { color, font } from '@/config/tokens';
import { brand } from '@/content/site';
import { useIsMobile } from '@/hooks/useIsMobile';

/** How long the "Copied!" confirmation stays up. */
const CONFIRM_MS = 2000;

/**
 * The giant low-contrast email watermark under the footer.
 *
 * Hovering summons a cursor-following pill that tilts toward the edge you
 * approach from; clicking copies the address and flips the pill to a tick.
 */
export function CopyEmailWatermark() {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0, tilt: 0 });

  const copyEmail = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(brand.email);
      setCopied(true);
      setTimeout(() => setCopied(false), CONFIRM_MS);
    } catch {
      // Clipboard access can be denied; the address stays visible either way.
    }
  };

  const watermark = (
    <svg
      viewBox="0 0 900 85"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: 'auto', display: 'block' }}
      aria-hidden="true"
    >
      <text
        x="450"
        y="70"
        textAnchor="middle"
        style={{
          fontFamily: font.sans,
          fontWeight: 900,
          fontSize: 80,
          letterSpacing: '-0.04em',
          fill: isMobile && copied ? color.brand : 'rgba(0,0,0,0.06)',
          transition: 'fill 0.3s ease',
        }}
      >
        {brand.email}
      </text>
    </svg>
  );

  if (isMobile) {
    return (
      <button
        type="button"
        onClick={copyEmail}
        aria-label={`Copy ${brand.email}`}
        style={{
          width: '100%',
          paddingTop: 24,
          paddingLeft: 16,
          paddingRight: 16,
          background: 'none',
          border: 'none',
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        {watermark}
        <span
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: color.brand,
            borderRadius: 100,
            padding: '8px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            opacity: copied ? 1 : 0,
            transition: 'opacity 0.25s ease',
            pointerEvents: 'none',
            fontFamily: font.body,
            fontWeight: 700,
            fontSize: 13,
            color: color.white,
            whiteSpace: 'nowrap',
          }}
        >
          Email copied
        </span>
      </button>
    );
  }

  return (
    <>
      <style>{`
        @keyframes copyTooltipIn {
          0% { scale: 0; opacity: 0; }
          100% { scale: 1; opacity: 1; }
        }
      `}</style>

      <div
        ref={containerRef}
        role="button"
        tabIndex={0}
        aria-label={`Copy ${brand.email}`}
        onClick={copyEmail}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            void copyEmail();
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setCopied(false);
        }}
        onMouseMove={(event) => {
          const rect = containerRef.current?.getBoundingClientRect();
          if (!rect) return;
          const x = event.clientX - rect.left;
          const halfWidth = Math.max(1, rect.width / 2);
          // Tip the pill toward whichever edge the pointer is nearer.
          setPointer({ x, y: event.clientY - rect.top, tilt: ((x - halfWidth) / halfWidth) * 12 });
        }}
        style={{
          width: '100%',
          paddingTop: 40,
          paddingLeft: 40,
          paddingRight: 40,
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        {watermark}

        {hovered ? (
          <span
            style={{
              position: 'absolute',
              left: pointer.x,
              top: pointer.y,
              transform: `translate(-50%, -50%) rotate(${pointer.tilt}deg)`,
              background: copied ? color.brand : color.ink,
              borderRadius: 100,
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              pointerEvents: 'none',
              animation: 'copyTooltipIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
              transition: 'background 0.2s ease',
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {copied ? (
                <polyline points="20 6 9 17 4 12" />
              ) : (
                <>
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </>
              )}
            </svg>
            <span
              style={{
                fontFamily: font.body,
                fontWeight: 700,
                fontSize: 13,
                color: color.white,
                whiteSpace: 'nowrap',
              }}
            >
              {copied ? 'Copied!' : 'Copy our email'}
            </span>
          </span>
        ) : null}
      </div>
    </>
  );
}
