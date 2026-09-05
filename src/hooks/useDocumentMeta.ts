import { useEffect } from "react";
import type { RouteId, RouteMeta } from "../routeManifest";
import { getRouteMeta } from "../routeManifest";
import { useLanguage } from "../i18n";

const SITE_ORIGIN = "https://starquake.top";
const DEFAULT_IMAGE = "/media/profile-photo.jpg";

export type DocumentMetaOptions = Partial<RouteMeta> & {
  route: RouteId;
  params?: Record<string, string | undefined>;
  canonicalPath?: string;
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

export function useDocumentMeta({ route, params, title, description, image, canonicalPath, type }: DocumentMetaOptions) {
  const { locale } = useLanguage();
  const routeMeta = getRouteMeta(route, locale, params);
  const resolvedTitle = title ?? routeMeta.title;
  const resolvedDescription = description ?? routeMeta.description;
  const resolvedImage = image ?? routeMeta.image ?? DEFAULT_IMAGE;
  const resolvedType = type ?? routeMeta.type ?? "website";

  useEffect(() => {
    const canonicalUrl = toAbsoluteUrl(canonicalPath ?? window.location.pathname);
    const imageUrl = toAbsoluteUrl(resolvedImage);

    document.title = resolvedTitle;
    updateMeta('meta[name="description"]', resolvedDescription);
    updateMeta('meta[property="og:title"]', resolvedTitle);
    updateMeta('meta[property="og:description"]', resolvedDescription);
    updateMeta('meta[property="og:type"]', resolvedType);
    updateMeta('meta[property="og:image"]', imageUrl);
    updateMeta('meta[name="twitter:card"]', "summary_large_image");
    updateMeta('meta[name="twitter:title"]', resolvedTitle);
    updateMeta('meta[name="twitter:description"]', resolvedDescription);
    updateMeta('meta[name="twitter:image"]', imageUrl);
    updateCanonicalLink(canonicalUrl);
  }, [canonicalPath, resolvedDescription, resolvedImage, resolvedTitle, resolvedType]);
}
