"use client";
import Image from "next/image";
import { useState } from "react";
import { FiPackage } from "react-icons/fi";
export default function ProductPhoto({ src, alt, sizes, priority = false, className = "" }: { src: string | null; alt: string; sizes: string; priority?: boolean; className?: string }) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  if (!src || failedSource === src) return <div className="shop-photo-unavailable" role="img" aria-label={`Image unavailable for ${alt}`}><FiPackage aria-hidden /><span>Image unavailable</span></div>;
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} onError={() => setFailedSource(src)} className={className} />;
}
