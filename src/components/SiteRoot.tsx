'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AcademyPage } from '@/components/features/academy/AcademyPage';
import { CaseStudyView } from '@/components/features/case-study/CaseStudyView';
import { ClientStories } from '@/components/features/stories/ClientStories';
import { CookieBanner } from '@/components/features/overlays/CookieBanner';
import { Faq } from '@/components/features/faq/Faq';
import { Footer } from '@/components/features/footer/Footer';
import { Hero } from '@/components/features/hero/Hero';
import { HowItWorks } from '@/components/features/how-it-works/HowItWorks';
import { InfoOverlay } from '@/components/features/overlays/InfoOverlay';
import { IntroAnimation } from '@/components/features/intro/IntroAnimation';
import { LogoStrip } from '@/components/features/logos/LogoStrip';
import { Navbar } from '@/components/features/navigation/Navbar';
import { NoiseOverlay } from '@/components/features/overlays/NoiseOverlay';
import { Pricing } from '@/components/features/pricing/Pricing';
import { ScrollStatement } from '@/components/features/statement/ScrollStatement';
import { color } from '@/config/tokens';
import { caseStudies } from '@/content/site';
import { useCaseStudyRoute } from '@/hooks/useCaseStudyRoute';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { clamp, setScrollLocked } from '@/utils/scroll';
import type { OverlayKey, SiteView } from '@/types/content';

/** Assets that must be decoded before the intro can start. */
const CRITICAL_IMAGES = [
  '/assets/105e7cd3a106296d90d081af3766923516632143.webp',
  '/assets/bbce9ed952a7420976ed2c9f616ed1df87bdb9aa.svg',
  '/assets/c711fe9ebd777477bb6d7ed5d01bcceba139f212.svg',
  '/assets/7b95b73d9de4dcf48f3ddcb20e754ae7f424ef4a.svg',
] as const;

/** Videos warmed once the critical images land. */
const WARM_VIDEOS = ['/notif.mp4', '/card1-designer.mp4', '/card2.mp4'] as const;

/** Give up waiting on preloads after this and show the intro anyway. */
const PRELOAD_TIMEOUT_MS = 4000;

/** Cross-fade time when swapping between the Studio and Academy views. */
const VIEW_SWAP_MS = 500;

/**
 * Top-level orchestration.
 *
 * Owns the intro handover, the Studio ↔ Academy view swap, the case-study
 * route, the Contact/Privacy/Terms overlays, and the footer reveal — the
 * footer is fixed behind the page, so the page reserves its height as bottom
 * margin and slides off it on the last scroll.
 */
export function SiteRoot() {
  const [view, setView] = useState<SiteView>('studio');
  const caseStudyRoute = useCaseStudyRoute();
  const caseStudySlug = caseStudyRoute.slug;
  const [overlay, setOverlay] = useState<OverlayKey | null>(null);
  const [overlayOrigin, setOverlayOrigin] = useState<DOMRect | null>(null);

  const [assetsReady, setAssetsReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [navRevealed, setNavRevealed] = useState(false);
  const [navExiting, setNavExiting] = useState(false);

  const [footerHeight, setFooterHeight] = useState(0);
  const footerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useSmoothScroll(view === 'studio' && caseStudySlug === null);

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
        video.src = source;
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

  // A deep link into a case study skips the intro entirely.
  const introFinished = introDone || caseStudySlug !== null;

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
  }, [view, caseStudySlug]);

  // Inset the page and round the FAQ panel as the footer is revealed beneath it.
  useEffect(() => {
    if (view !== 'studio' || caseStudySlug !== null) return;

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
  }, [view, caseStudySlug]);

  const handleIntroComplete = useCallback(() => {
    window.scrollTo(0, 0);
    setIntroDone(true);
  }, []);

  const handleNavReveal = useCallback(() => setNavRevealed(true), []);

  /** Slides the nav out, swaps the view, then slides it back in. */
  const swapView = useCallback((next: SiteView) => {
    setNavExiting(true);
    setTimeout(() => {
      setNavExiting(false);
      setView(next);
      window.scrollTo(0, 0);
    }, VIEW_SWAP_MS);
  }, []);

  const openOverlay = useCallback((key: OverlayKey) => {
    const active = document.activeElement;
    setOverlayOrigin(active instanceof HTMLElement ? active.getBoundingClientRect() : null);
    setOverlay(key);
  }, []);

  const activeCaseStudy = caseStudies.find((study) => study.slug === caseStudySlug) ?? null;

  if (activeCaseStudy) {
    return (
      <>
        <NoiseOverlay />
        <CaseStudyView study={activeCaseStudy} onBack={caseStudyRoute.close} />
      </>
    );
  }

  if (view === 'academy') {
    return (
      <>
        <NoiseOverlay />
        <AcademyPage onStudio={() => swapView('studio')} navExiting={navExiting} />
      </>
    );
  }

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

      <Navbar
        revealed={navRevealed}
        aboveOverlay={!introFinished}
        exiting={navExiting}
        onOpenAcademy={() => swapView('academy')}
      />

      <div
        ref={contentRef}
        style={{ position: 'relative', zIndex: 1, marginBottom: footerHeight }}
      >
        <div style={{ background: color.white }}>
          <Hero introActive={!introFinished} />
        </div>
        <LogoStrip />
        <ScrollStatement />
        <HowItWorks />
        <ClientStories onOpenCaseStudy={caseStudyRoute.open} />
        <Pricing />
        <Faq />
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 0 }}>
        <Footer ref={footerRef} onOpenOverlay={openOverlay} />
      </div>

      <NoiseOverlay />
      <CookieBanner />

      {overlay ? (
        <InfoOverlay panel={overlay} origin={overlayOrigin} onClose={() => setOverlay(null)} />
      ) : null}
    </div>
  );
}
