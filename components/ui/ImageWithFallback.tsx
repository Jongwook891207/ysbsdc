"use client";

import { useState } from "react";
import Image from "next/image";

/**
 * Ports the static site's `onerror="...replaceWith(.img-placeholder)"`
 * pattern (index.html) for images that may 404 — swaps to the same
 * `.img-placeholder` box the original inline handler built.
 */
export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  placeholderText,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  placeholderText: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className="img-placeholder">{placeholderText}</div>;
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
