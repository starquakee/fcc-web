import { useEffect } from "react";

const SITE_ORIGIN = "https://starquake.top";
const DEFAULT_IMAGE = "/media/profile-photo.jpg";

export type DocumentMetaOptions = {
  title: string;
  description: string;
  image?: string;
  canonicalPath?: string;
  type?: "website" | "article";
};

function updateMeta(selector: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");

    if (selector.startsWith('meta[name="')) {
      element.setAttribute("name", selector.replace('meta[name="', "").replace('"]', ""));
    }

    if (selector.startsWith('meta[property="')) {
      element.setAttribute("property", selector.replace('meta[property="', "").replace('"]', ""));
    }

    document.head.appendChild(element);
  }

  element.setAttribute("content", value);
}

function updateCanonicalLink(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

function toAbsoluteUrl(path: string) {
  return new URL(path, SITE_ORIGIN).href;
}

export function useDocumentMeta({
  title,
  description,
  image = DEFAULT_IMAGE,
  canonicalPath,
  type = "website",
}: DocumentMetaOptions) {
  useEffect(() => {
    const canonicalUrl = toAbsoluteUrl(canonicalPath ?? window.location.pathname);
    const imageUrl = toAbsoluteUrl(image);

    document.title = title;
    updateMeta('meta[name="description"]', description);
    updateMeta('meta[property="og:title"]', title);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[property="og:type"]', type);
    updateMeta('meta[property="og:image"]', imageUrl);
    updateMeta('meta[name="twitter:card"]', "summary_large_image");
    updateMeta('meta[name="twitter:title"]', title);
    updateMeta('meta[name="twitter:description"]', description);
    updateMeta('meta[name="twitter:image"]', imageUrl);
    updateCanonicalLink(canonicalUrl);
  }, [canonicalPath, description, image, title, type]);
}
