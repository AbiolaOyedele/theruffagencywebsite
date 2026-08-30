'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Blog } from '@/components/features/blog/Blog';
import { StoryPanel } from '@/components/features/story/StoryPanel';
import { Work } from '@/components/features/work/Work';
import { CookieBanner } from '@/components/features/overlays/CookieBanner';
import { Faq } from '@/components/features/faq/Faq';
import { Footer } from '@/components/features/footer/Footer';
import { Hero } from '@/components/features/hero/Hero';
import { Services } from '@/components/features/services/Services';
import { InfoOverlay } from '@/components/features/overlays/InfoOverlay';
import { IntroAnimation } from '@/components/features/intro/IntroAnimation';
import { LogoStrip } from '@/components/features/logos/LogoStrip';
import { Navbar } from '@/components/features/navigation/Navbar';
import { NoiseOverlay } from '@/components/features/overlays/NoiseOverlay';
import { Pricing } from '@/components/features/pricing/Pricing';
import { ScrollStatement } from '@/components/features/statement/ScrollStatement';
import { color } from '@/config/tokens';
import { blogPosts, caseStudies } from '@/content/site';
import { useStoryRoute } from '@/hooks/useStoryRoute';
import { refreshHash, useHash } from '@/hooks/useHash';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { videoUrl } from '@/lib/images';
import { clamp, setScrollLocked } from '@/utils/scroll';
import { postHash, storyFromCaseStudy, storyFromPost } from '@/types/content';
import type { OverlayKey, Story } from '@/types/content';

/** Assets that must be decoded before the intro can start. */
const CRITICAL_IMAGES = [
  '/assets/105e7cd3a106296d90d081af3766923516632143.webp',
  '/assets/bbce9ed952a7420976ed2c9f616ed1df87bdb9aa.svg',
  '/assets/c711fe9ebd777477bb6d7ed5d01bcceba139f212.svg',
  '/assets/7b95b73d9de4dcf48f3ddcb20e754ae7f424ef4a.svg',
] as const;

/**
 * Videos warmed once the critical images land. Named the way content names
 * them, and resolved through `videoUrl` — warming a local copy of a file the
 * page then fetches from Cloudinary would download it twice.
 */
const WARM_VIDEOS = [
  'ruff-agency/website/video/notif',
  'ruff-agency/website/video/card1-designer',
  'ruff-agency/website/video/card2',
] as const;

/** Give up waiting on preloads after this and show the intro anyway. */
const PRELOAD_TIMEOUT_MS = 4000;

/**
 * Top-level orchestration.
 *
 * Owns the intro handover, the case-study route, the Contact/Privacy/Terms
 * overlays, and the footer reveal — the
 * footer is fixed behind the page, so the page reserves its height as bottom
 * margin and slides off it on the last scroll.
 */
export function SiteRoot() {
  const storyRoute = useStoryRoute();
  const caseStudySlug = storyRoute.slug;
  const [caseStudyOrigin, setCaseStudyOrigin] = useState<DOMRect | null>(null);
  const [overlay, setOverlay] = useState<OverlayKey | null>(null);
  // Every "Work with us" is a plain link to #contact, so the panel opens from
  // the URL rather than from a callback threaded through half the tree — and
  // /contact, which the agent instructions point at, redirects here.
  const hash = useHash();
  const hashOverlay: OverlayKey | null =
    hash === 'contact' ? 'contact' : hash === 'careers' ? 'careers' : null;
  const activeOverlay = overlay ?? hashOverlay;
  const [overlayOrigin, setOverlayOrigin] = useState<DOMRect | null>(null);

  const [assetsReady, setAssetsReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [navRevealed, setNavRevealed] = useState(false);

  const [footerHeight, setFooterHeight] = useState(0);
  const footerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useSmoothScroll(caseStudySlug === null);

  // Preload the intro's assets, with a hard timeout so a slow network can't
  // strand visitors on a blank screen.
  useEffect(() => {
    let settled = 0;
    const total = CRITICAL_IMAGES.length;

    const onSettled = (): void => {
      settled += 1;
      if (settled < total) return;

      setTimeout(() => setAssetsReady(true), 100);
      for (const source of WARM_VIDEOS) {
        const video = document.createElement('video');
        video.preload = 'auto';
        video.src = videoUrl(source);
        video.load();
      }
    };

    for (const source of CRITICAL_IMAGES) {
      const image = new Image();
      image.onload = onSettled;
      image.onerror = onSettled;
      image.src = source;
    }

    const fallback = setTimeout(() => setAssetsReady(true), PRELOAD_TIMEOUT_MS);
    return () => clearTimeout(fallback);
  }, []);

  // A deep link into a case study or the contact panel skips the intro: those
  // visitors came for one thing and should not sit through the opening.
  const introFinished = introDone || caseStudySlug !== null || hashOverlay !== null;

  // Freeze the page under the intro overlay.
  useEffect(() => {
    setScrollLocked(!introFinished);
    return () => setScrollLocked(false);
  }, [introFinished]);

  // Track the footer's height so the page can reserve exactly that much room.
  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const measure = (): void => setFooterHeight(footer.offsetHeight);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(footer);
    return () => observer.disconnect();
  }, [caseStudySlug]);

  // Inset the page and round the FAQ panel as the footer is revealed beneath it.
  useEffect(() => {
    if (caseStudySlug !== null) return;

    const handleScroll = (): void => {
      const content = contentRef.current;
      const footer = footerRef.current;
      if (!content || !footer) return;

      const revealed = window.innerHeight - content.getBoundingClientRect().bottom;
      const progress = clamp(revealed / (footer.offsetHeight * 0.5));

      content.style.marginLeft = `${progress * 10}px`;
      content.style.marginRight = `${progress * 10}px`;

      const faq = document.getElementById('faq');
      if (faq) {
        faq.style.borderBottomLeftRadius = `${progress * 42}px`;
        faq.style.borderBottomRightRadius = `${progress * 42}px`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [caseStudySlug]);

  const handleIntroComplete = useCallback(() => {
    window.scrollTo(0, 0);
    setIntroDone(true);
  }, []);

  const handleNavReveal = useCallback(() => setNavRevealed(true), []);

  const openStory = useCallback(
    (hash: string, fromRect: DOMRect) => {
      setCaseStudyOrigin(fromRect);
      storyRoute.open(hash);
    },
    [storyRoute],
  );

  const closeStory = useCallback(() => {
    storyRoute.close();
    setCaseStudyOrigin(null);
  }, [storyRoute]);


  const openOverlay = useCallback((key: OverlayKey) => {
    const active = document.activeElement;
    setOverlayOrigin(active instanceof HTMLElement ? active.getBoundingClientRect() : null);
    setOverlay(key);
  }, []);

  const closeOverlay = useCallback(() => {
    setOverlay(null);
    // Clear the hash too, or the panel it named simply reopens.
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      refreshHash();
    }
  }, []);

  // One panel, two kinds of thing in it: whichever the hash names.
  const activeStory: Story | null = (() => {
    if (caseStudySlug === null) return null;
    const study = caseStudies.find((entry) => entry.slug === caseStudySlug);
    if (study) return storyFromCaseStudy(study);
    const post = blogPosts.find((entry) => postHash(entry.slug) === caseStudySlug);
    return post ? storyFromPost(post) : null;
  })();

  return (
    <div style={{ overflowX: 'clip', background: color.paperAlt }}>
      {assetsReady && !introFinished ? (
        <IntroAnimation onNavReveal={handleNavReveal} onComplete={handleIntroComplete} />
      ) : null}

      {!assetsReady ? (
        <div
          aria-hidden="true"
          style={{ position: 'fixed', inset: 0, background: color.paper, zIndex: 99_999 }}
        />
      ) : null}

      <Navbar revealed={navRevealed} aboveOverlay={!introFinished} />

      <div
        ref={contentRef}
        style={{ position: 'relative', zIndex: 1, marginBottom: footerHeight }}
      >
        <div style={{ background: color.white }}>
          <Hero />
        </div>
        <LogoStrip />
        <ScrollStatement />
        <Services />
        <Work onOpenCaseStudy={openStory} activeSlug={caseStudySlug} />
        <Blog onOpenPost={openStory} />
        <Pricing />
        <Faq />
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 0 }}>
        <Footer ref={footerRef} onOpenOverlay={openOverlay} />
      </div>

      <NoiseOverlay />
      <CookieBanner />

      {activeOverlay ? (
        <InfoOverlay panel={activeOverlay} origin={overlayOrigin} onClose={closeOverlay} />
      ) : null}

      {activeStory ? (
        <StoryPanel story={activeStory} fromRect={caseStudyOrigin} onClose={closeStory} />
      ) : null}
    </div>
  );
}
