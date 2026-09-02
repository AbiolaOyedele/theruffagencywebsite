'use client';

import { useState } from 'react';
import { cardAccent, color, font, shape, weight } from '@/config/tokens';
import { useIsMobile } from '@/hooks/useIsMobile';
import { formatPostDate, readingMinutes, type BlogPost } from '@/types/content';
import { useContent } from '@/components/providers/ContentProvider';

interface BlogCardProps {
  readonly post: BlogPost;
  /** Position on the shelf, which is what decides the card's ground. */
  readonly index: number;
  /** Given the card's own box, so the panel can grow out of it. */
  readonly onOpen: (fromRect: DOMRect) => void;
}

/**
 * One post on the writing shelf.
 *
 * Built from the same parts as the rest of the site — accent ground, ink
 * keyline, hard offset shadow — and lifts off its shadow on hover so it reads
 * as something you press.
 */
export function BlogCard({ post, index, onOpen }: BlogCardProps) {
  const { blogSection } = useContent();
  const isMobile = useIsMobile();
  const [raised, setRaised] = useState(false);

  return (
    <button
      type="button"
      onClick={(event) => onOpen(event.currentTarget.getBoundingClientRect())}
      onMouseEnter={() => setRaised(true)}
      onMouseLeave={() => setRaised(false)}
      onFocus={() => setRaised(true)}
      onBlur={() => setRaised(false)}
      style={{
        background: cardAccent(index),
        border: shape.keyline,
        borderRadius: 24,
        boxShadow: raised ? '10px 10px 0 #250200' : shape.hardShadow,
        transform: raised ? 'translate(-4px, -4px)' : 'translate(0, 0)',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        padding: isMobile ? 24 : 28,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 14,
        textAlign: 'left',
        cursor: 'pointer',
        minHeight: isMobile ? 240 : 320,
        height: '100%',
        width: '100%',
      }}
    >
      <span
        style={{
          fontFamily: font.sans,
          fontWeight: weight.bold,
          fontSize: 11,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: color.ink,
          background: color.white,
          border: shape.keyline,
          borderRadius: 999,
          padding: '6px 12px',
        }}
      >
        {post.category}
      </span>

      <h3
        style={{
          fontFamily: font.display,
          fontWeight: weight.extrabold,
          fontSize: isMobile ? 22 : 25,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          color: color.ink,
          margin: 0,
        }}
      >
        {post.title}
      </h3>

      <p
        style={{
          fontFamily: font.body,
          fontWeight: weight.light,
          fontSize: 15,
          lineHeight: 1.6,
          color: color.ink,
          opacity: 0.75,
          margin: 0,
        }}
      >
        {post.excerpt}
      </p>

      <span
        style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: font.sans,
          fontWeight: weight.bold,
          fontSize: 13,
          color: color.ink,
        }}
      >
        {blogSection.cardCta} →
        <span
          style={{
            fontFamily: font.body,
            fontWeight: weight.light,
            fontSize: 13,
            opacity: 0.7,
          }}
        >
          {formatPostDate(post.publishedAt)} · {readingMinutes(post)} min
        </span>
      </span>
    </button>
  );
}
