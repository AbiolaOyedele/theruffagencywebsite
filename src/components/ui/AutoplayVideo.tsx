'use client';

import { useEffect, useImperativeHandle, useRef, type CSSProperties, type Ref } from 'react';
import { videoUrl } from '@/lib/images';

interface AutoplayVideoProps {
  /** A path into `public/`, an absolute URL, or a Cloudinary public id. */
  readonly src: string;
  readonly style?: CSSProperties | undefined;
  readonly className?: string | undefined;
  readonly preload?: 'auto' | 'metadata' | 'none' | undefined;
  /** Set false when a parent sequence starts playback itself. */
  readonly playOnMount?: boolean | undefined;
  readonly ref?: Ref<HTMLVideoElement | null> | undefined;
}

/**
 * Looping background video.
 *
 * The `muted` attribute alone is not enough — React can apply it after the
 * element starts loading, which makes some browsers refuse to autoplay. This
 * sets `muted` imperatively before asking to play, and retries once the media
 * is actually playable.
 *
 * Every video on the site plays through here, so this is where a source is
 * resolved — content names footage however it likes and one place decides
 * where it is fetched from.
 */
export function AutoplayVideo({
  src,
  style,
  className,
  preload = 'auto',
  playOnMount = true,
  ref,
}: AutoplayVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useImperativeHandle(ref, () => videoRef.current as HTMLVideoElement, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !playOnMount) return;

    video.muted = true;
    video.defaultMuted = true;

    const attempt = (): void => {
      if (document.visibilityState !== 'visible') return;
      void video.play().catch(() => {
        // Autoplay can still be refused; the poster frame stands in.
      });
    };

    // Browsers suspend decorative media aggressively (backgrounded tabs, power
    // saving). These loops have no controls, so resuming is always the intent.
    attempt();
    video.addEventListener('canplay', attempt);
    video.addEventListener('pause', attempt);
    document.addEventListener('visibilitychange', attempt);

    return () => {
      video.removeEventListener('canplay', attempt);
      video.removeEventListener('pause', attempt);
      document.removeEventListener('visibilitychange', attempt);
    };
  }, [playOnMount, src]);

  return (
    <video
      ref={videoRef}
      autoPlay={playOnMount}
      loop
      muted
      playsInline
      preload={preload}
      aria-hidden="true"
      className={className}
      style={style}
    >
      <source src={videoUrl(src)} type="video/mp4" />
    </video>
  );
}
