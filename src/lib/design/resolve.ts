import { unstable_cache } from 'next/cache';
import { hasSupabase } from '@/config/env';
import { ALL_TOKENS, cssVarName, isKnownToken } from '@/config/designTokens';
import { readDesignTokens } from '@/repositories/design';

/**
 * The design tokens the site should render with, as a stylesheet.
 *
 * Only overridden tokens are emitted. Everything else falls through to the
 * value written into `config/tokens.ts`, so the block is small and a database
 * that is empty, unreachable, or not configured at all costs the site nothing.
 */

export const DESIGN_TAG = 'design-tokens';

export type TokenValues = Readonly<Record<string, string>>;

async function resolve(): Promise<TokenValues> {
  if (!hasSupabase()) return {};

  try {
    const rows = await readDesignTokens();
    const values: Record<string, string> = {};
    for (const row of rows) {
      // A token the current build no longer defines is ignored rather than
      // emitted as a variable nothing reads.
      if (isKnownToken(row.key)) values[row.key] = row.value;
    }
    return values;
  } catch (error) {
    console.error('Falling back to default design tokens:', error);
    return {};
  }
}

const cached = unstable_cache(resolve, ['design-tokens'], { tags: [DESIGN_TAG] });

export async function getDesignTokens(): Promise<TokenValues> {
  return cached();
}

/** Everything the panel needs: the override if there is one, else the repo value. */
export async function getEffectiveTokens(): Promise<TokenValues> {
  const overrides = await getDesignTokens();
  const effective: Record<string, string> = {};
  for (const token of ALL_TOKENS) {
    effective[token.id] = overrides[token.id] ?? token.fallback;
  }
  return effective;
}

/**
 * `:root { --color-brand: #e92038; ... }`, or an empty string when nothing is
 * overridden. Values are escaped: a custom property cannot break out of a
 * declaration, but `<` and `>` must never reach a style element intact.
 */
export function buildTokenCss(values: TokenValues): string {
  const declarations = Object.entries(values)
    .filter(([id]) => isKnownToken(id))
    .map(([id, value]) => `${cssVarName(id)}: ${sanitiseValue(value)};`);

  return declarations.length > 0 ? `:root{${declarations.join('')}}` : '';
}

/** Strips anything that could end the declaration or the style element. */
function sanitiseValue(value: string): string {
  return value.replace(/[<>{};]/g, '').trim().slice(0, 200);
}
