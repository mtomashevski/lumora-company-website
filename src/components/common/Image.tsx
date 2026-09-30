import { useState } from 'react';
import { publicAsset } from '../../utils/deployment';
export function Image({
  src,
  alt,
  className = '',
  eager = false,
  position,
  sizes,
}: {
  src?: string;
  alt: string;
  className?: string;
  eager?: boolean;
  position?: string;
  sizes?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const failed = !src || failedSrc === src;
  const resolved = publicAsset(failed ? '/images/fallback.svg' : src!);
  // Legacy responsive pairs are supported; supplied AVIF/WebP files are used directly.
  const responsive = !failed && src?.match(/-(1200|1920)\.webp$/);
  return (
    <img
      className={className}
      src={resolved}
      srcSet={
        responsive
          ? `${publicAsset(src!.replace(/-(1200|1920)\.webp$/, '-640.webp'))} 640w, ${resolved} ${responsive[1]}w`
          : undefined
      }
      sizes={
        responsive
          ? sizes || (eager ? '100vw' : '(max-width: 540px) 100vw, (max-width: 800px) 50vw, 40vw')
          : undefined
      }
      style={position ? { objectPosition: position } : undefined}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      decoding="async"
      onError={() => setFailedSrc(src)}
    />
  );
}
