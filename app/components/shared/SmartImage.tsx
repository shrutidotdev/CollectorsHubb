import { PackageOpen } from "lucide-react";
import { useState } from "react";

export default function SmartImage({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | undefined>();
  const failed = !src || failedSrc === src;

  if (failed || !src) {
    return (
      <div
        className={`image-fallback ${className}`}
        role="img"
        aria-label={`${alt} image unavailable`}
      >
        <PackageOpen size={30} strokeWidth={1.5} />
        <span>Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailedSrc(src)}
    />
  );
}
