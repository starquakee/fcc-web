import { imageMetadata } from "../generated/imageMetadata";

// Match the container, 960px breakpoint, and grid columns in global.scss.
const containerSize = "calc(100vw - clamp(2rem, 5vw, 4rem))";
export const imageSizes = {
  noteCover: `(max-width: 960px) ${containerSize}, calc((min(1200px, ${containerSize}) - clamp(1.5rem, 3vw, 2.5rem)) / 2.25)`,
  portrait: `(max-width: 960px) min(420px, ${containerSize}), 300px`,
  noteHero: `(max-width: 960px) ${containerSize}, 360px`,
  timelineLogo: "4.5rem",
};

export function getImageMetadata(src: string) {
  // Note URLs have already been resolved against assetBasePath by the parser.
  // Query/hash suffixes do not change local geometry; unknown URLs stay intact.
  const path = src.split(/[?#]/, 1)[0];
  try {
    return imageMetadata[decodeURIComponent(path)];
  } catch {
    return undefined;
  }
}

export function getResponsiveImageProps(src: string, sizes: string) {
  const metadata = getImageMetadata(src);
  const variants = metadata?.variants;
  const fallback = variants?.find((variant) => variant.width >= 640) ?? variants?.at(-1);

  return {
    src: fallback?.src ?? src,
    width: metadata?.width,
    height: metadata?.height,
    srcSet: variants?.map((variant) => `${variant.src} ${variant.width}w`).join(", "),
    sizes: variants?.length ? sizes : undefined,
  };
}
