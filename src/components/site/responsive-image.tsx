import { cn } from "@/lib/utils";
import { imageMeta, imageSrc, imageSrcSet } from "@/lib/images";

type ResponsiveImageProps = {
  id: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  style?: React.CSSProperties;
};

/** <img> WebP responsive (variantes générées par scripts/build-images.mjs). */
export function ResponsiveImage({ id, alt, sizes, className, priority = false, style }: ResponsiveImageProps) {
  const { w, h } = imageMeta(id);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc(id, 1280)}
      srcSet={imageSrcSet(id)}
      sizes={sizes}
      width={w}
      height={h}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={cn("block", className)}
      style={style}
    />
  );
}
