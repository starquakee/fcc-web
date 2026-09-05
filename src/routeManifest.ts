import type { Locale } from "./i18n";
import { getMemoryDetail } from "./content/memoryCatalog";
import { profilesByLocale } from "./content/profile";

export type RouteId = "home" | "publications" | "projects" | "memory" | "memoryDetail" | "cv" | "notFound";

export type RouteMeta = {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
};

type RouteDefinition = {
  path: string;
  navLabel?: Record<Locale, string>;
  end?: boolean;
  meta: Record<Locale, RouteMeta> | ((locale: Locale, params?: Record<string, string | undefined>) => RouteMeta);
};

export const routeManifest: Record<RouteId, RouteDefinition> = {
  home: {
    path: "/",
    navLabel: { en: "Home", zh: "首页" },
    end: true,
    meta: {
      en: { title: "Chenchen Feng", description: profilesByLocale.en.seoDescription },
      zh: { title: "冯晨晨", description: profilesByLocale.zh.seoDescription },
    },
  },
  publications: {
    path: "/publications",
    navLabel: { en: "Publications", zh: "论文" },
    meta: {
      en: {
        title: "Publications | Chenchen Feng",
        description: "Journal publications and research output by Chenchen Feng.",
      },
      zh: { title: "论文 | 冯晨晨", description: "冯晨晨的论文与研究成果。" },
    },
  },
  projects: {
    path: "/projects",
    navLabel: { en: "Projects", zh: "项目" },
    meta: {
      en: { title: "Projects | Chenchen Feng", description: "Selected systems and engineering projects by Chenchen Feng." },
      zh: { title: "项目 | 冯晨晨", description: "冯晨晨的系统与工程项目。" },
    },
  },
  memory: {
    path: "/memory",
    navLabel: { en: "Notes", zh: "小记" },
    meta: {
      en: {
        title: "Notes | Chenchen Feng",
        description: "A quieter set of notes on culture, media, and long-term personal references.",
      },
      zh: { title: "小记 | 冯晨晨", description: "一些更私人一些的文化小记、兴趣记录与长期参照。" },
    },
  },
  memoryDetail: {
    path: "/memory/:slug",
    meta: (locale, params) => {
      const detail = getMemoryDetail(locale, params?.slug);
      const fallback = routeManifest.memory.meta;
      const fallbackMeta = typeof fallback === "function" ? fallback(locale, params) : fallback[locale];

      return detail
        ? {
            title: locale === "zh" ? `${detail.title} | 冯晨晨` : `${detail.title} | Chenchen Feng`,
            description: detail.summary,
            image: detail.socialImage ?? detail.image,
            type: "article",
          }
        : fallbackMeta;
    },
  },
  cv: {
    path: "/cv",
    navLabel: { en: "CV", zh: "简历" },
    meta: {
      en: { title: "CV | Chenchen Feng", description: "Experience, education, and CV download for Chenchen Feng." },
      zh: { title: "简历 | 冯晨晨", description: "冯晨晨的教育背景、经历和 PDF 简历下载。" },
    },
  },
  notFound: {
    path: "*",
    meta: {
      en: { title: "Page Not Found | Chenchen Feng", description: "The requested page could not be found." },
      zh: { title: "页面未找到 | 冯晨晨", description: "请求的页面不存在。" },
    },
  },
};

export const primaryRouteIds = ["home", "publications", "projects", "cv", "memory"] as const satisfies RouteId[];

export function getRoutePath(routeId: RouteId) {
  return routeManifest[routeId].path;
}

export function getRouteLabel(routeId: (typeof primaryRouteIds)[number], locale: Locale) {
  const label = routeManifest[routeId].navLabel?.[locale];

  if (!label) {
    throw new Error(`Route ${routeId} does not have a navigation label for ${locale}`);
  }

  return label;
}

export function getRouteMeta(routeId: RouteId, locale: Locale, params?: Record<string, string | undefined>) {
  const meta = routeManifest[routeId].meta;
  return typeof meta === "function" ? meta(locale, params) : meta[locale];
}
