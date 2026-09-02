'use client';

import { useState } from 'react';
import { ClaudeMark, OpenAiMark } from '@/components/ui/AiMarks';
import { color, font, radius, shape, weight } from '@/config/tokens';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useContent } from '@/components/providers/ContentProvider';

/** How long the button holds its "Copied" state before reverting. */
const COPIED_MS = 2200;

type CopyState = 'idle' | 'copied' | 'failed';

/**
 * The AI-agent route into the form.
 *
 * One button copies the whole brief-writing prompt, so it can be pasted
 * straight into an assistant. The assistant works the brief out with the
 * visitor and hands back a block; pasting that anywhere on this page fills the
 * form in.
 */
export function AgentPromptCard() {
  const { contactPage } = useContent();
  const isMobile = useIsMobile();
  const [copyState, setCopyState] = useState<CopyState>('idle');

  async function copyPrompt(): Promise<void> {
    try {
      const response = await fetch(contactPage.agent.href);
      if (!response.ok) throw new Error(`Prompt unavailable (${response.status})`);
      await navigator.clipboard.writeText(await response.text());
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), COPIED_MS);
    } catch {
      // Clipboard access can be refused, and the fetch can fail. Either way the
      // prompt is still readable at its own URL, so say so rather than failing
      // silently.
      setCopyState('failed');
    }
  }

  const label =
    copyState === 'copied'
      ? contactPage.agent.copiedLabel
      : copyState === 'failed'
        ? contactPage.agent.copyFailedLabel
        : contactPage.agent.copyLabel;

  return (
    <section
      style={{
        background: color.white,
        border: shape.keyline,
        borderRadius: 22,
        boxShadow: shape.hardShadowSmall,
        padding: isMobile ? 22 : 26,
        display: 'flex',
        // Always stacked: this sits in a narrow rail beside the form, where a
        // row would squeeze the copy into a column two words wide.
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 18,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <h2
          style={{
            fontFamily: font.sans,
            fontWeight: weight.bold,
            fontSize: isMobile ? 17 : 19,
            color: color.ink,
            margin: '0 0 8px',
          }}
        >
          {contactPage.agent.heading}
        </h2>
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
          {contactPage.agent.body}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <span
          aria-hidden="true"
          style={{ display: 'flex', alignItems: 'center', gap: 8, color: color.ink }}
        >
          <ClaudeMark size={22} />
          <OpenAiMark size={22} />
        </span>

        {copyState === 'failed' ? (
          <a
            href={contactPage.agent.href}
            style={{
              ...actionStyle,
              background: color.white,
              color: color.ink,
              textDecoration: 'none',
            }}
          >
            {label}
          </a>
        ) : (
          <button type="button" onClick={copyPrompt} style={actionStyle}>
            {label}
          </button>
        )}
      </div>
    </section>
  );
}

const actionStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  background: color.white,
  color: color.ink,
  border: shape.keyline,
  borderRadius: radius.pill,
  boxShadow: shape.hardShadowSmall,
  fontFamily: font.sans,
  fontWeight: weight.bold,
  fontSize: 14,
  padding: '13px 20px',
  minHeight: 44,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
} as const;
