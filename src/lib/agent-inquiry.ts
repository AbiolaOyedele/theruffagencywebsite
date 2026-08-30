/**
 * The agent-inquiry block format.
 *
 * An AI agent following `/agent/prompt.md` works a brief out with the visitor,
 * then hands them a markdown block. Pasting that block anywhere on the contact
 * page fills the form in. This module owns both halves of that contract — the
 * marker and the parser — so the instructions we publish and the code that
 * reads them cannot drift apart.
 *
 * SECURITY: parsed values are only ever assigned to form field values, never
 * inserted as markup, and the server revalidates every field on submit. This
 * parser is a convenience, not a trust boundary.
 */
import {
  BUDGET_BANDS,
  LIMITS,
  PROJECT_STAGES,
} from '@/lib/schemas/form-constants';

/** Present on the block's first line, and the stem of the instructions marker. */
export const INQUIRY_MARKER = 'ruff-inquiry';

/** Matches an inquiry block's opening comment. */
const BLOCK_MARKER = /<!--\s*ruff-inquiry\s+v\d+\s*-->/i;

/**
 * Matches the instructions document's own marker.
 *
 * This is why the block marker alone is not enough: /agent/prompt.md shows a
 * worked example inside a fence, complete with the real block marker and
 * plausible Name, Email and `## Brief` lines. Someone who pastes the
 * instructions rather than their assistant's output would otherwise fill the
 * form in with the example's invented details and could send them without
 * noticing. The document says outright which one it is — so ask it.
 */
const INSTRUCTIONS_MARKER = /<!--\s*ruff-inquiry-instructions\s+v\d+\s*-->/i;

export interface ParsedInquiry {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  stage?: string;
  budget?: string;
  projectDetails?: string;
  referralSource?: string;
}

/** Returns the value only when it is one of the options we actually offer. */
function oneOf(value: string | undefined, options: readonly string[]): string | undefined {
  return value && options.includes(value) ? value : undefined;
}

function field(text: string, label: string): string | undefined {
  const match = new RegExp(`^\\*\\*${label}:\\*\\*[ \\t]*(.+)$`, 'im').exec(text);
  return match?.[1]?.trim() || undefined;
}

/**
 * Parses an agent inquiry block. Returns `null` when the text is not one of
 * ours, so an ordinary paste falls through untouched.
 *
 * A field the form has no home for — the website, say — is appended to the
 * brief rather than dropped, so nothing the visitor approved is quietly lost.
 */
export function parseInquiryBlock(text: string): ParsedInquiry | null {
  if (INSTRUCTIONS_MARKER.test(text)) return null;
  if (!BLOCK_MARKER.test(text)) return null;

  const name = field(text, 'Name');
  const email = field(text, 'Email');
  const brief = /^##\s+Brief\s*$([\s\S]*)/im.exec(text)?.[1]?.trim();

  // A block with none of the three load-bearing parts is not worth acting on.
  if (!name && !email && !brief) return null;

  const website = field(text, 'Website');
  const projectDetails = [brief, website ? `Website: ${website}` : null]
    .filter(Boolean)
    .join('\n\n');

  const clamp = (value: string | undefined, max: number): string | undefined =>
    value ? value.slice(0, max) : undefined;

  const parsed: ParsedInquiry = {};
  const assign = <K extends keyof ParsedInquiry>(key: K, value: string | undefined): void => {
    if (value) parsed[key] = value;
  };

  assign('name', clamp(name, LIMITS.name));
  assign('email', clamp(email, LIMITS.email));
  assign('company', clamp(field(text, 'Company'), LIMITS.company));
  assign('phone', clamp(field(text, 'Phone'), LIMITS.phone));
  assign('projectDetails', clamp(projectDetails || undefined, LIMITS.projectDetails));
  assign('referralSource', clamp(field(text, 'Heard about'), LIMITS.referralSource));
  // Closed sets: anything that is not one of ours is dropped rather than
  // carried through to a field the server would reject anyway.
  assign('stage', oneOf(field(text, 'Stage'), PROJECT_STAGES));
  assign('budget', oneOf(field(text, 'Budget'), BUDGET_BANDS));

  return parsed;
}
