'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import * as defaults from '@/content/site';
import { applyOverrides, type OverrideMap } from '@/lib/content/resolve';
import { setPanelContent } from '@/hooks/useStoryRoute';
import type { SiteContent } from '@/lib/content/resolve';

/**
 * The site's copy, as the browser should render it.
 *
 * The context defaults to exactly what `content/site.ts` exports, so a
 * component rendered outside the provider — in isolation, or on a route that
 * does not wrap — still gets real content rather than undefined.
 */
const ContentContext = createContext<SiteContent>(defaults);

export function ContentProvider({
  overrides,
  children,
}: {
  readonly overrides: OverrideMap;
  readonly children: ReactNode;
}) {
  const value = useMemo(() => applyOverrides(overrides), [overrides]);

  // Synchronously, not in an effect: the hash store may be read before effects
  // run, and it must already know which stories exist by then.
  setPanelContent(value.caseStudies, value.blogPosts);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

/**
 * The resolved copy. Shaped exactly like the `content/site` module, so a
 * component reads `const { hero } = useContent()` where it used to import it.
 */
export function useContent(): SiteContent {
  return useContext(ContentContext);
}
