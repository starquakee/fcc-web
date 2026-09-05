import type { Locale } from "../i18n";
import type { MemoryDetail, MemoryEntry, MemoryNote } from "../types/content";
import { memoryNotesByLocale } from "./memoryNotes";

type MemoryLocaleCatalog = {
  entries: MemoryEntry[];
  detailsBySlug: Map<string, MemoryDetail>;
};

function createLocaleCatalog(locale: Locale, notes: MemoryNote[]): MemoryLocaleCatalog {
  const seenSlugs = new Set<string>();
  const entries: MemoryEntry[] = [];
  const detailsBySlug = new Map<string, MemoryDetail>();

  for (const note of notes) {
    if (seenSlugs.has(note.slug)) {
      throw new Error(`Duplicate memory slug for ${locale}: ${note.slug}`);
    }

    seenSlugs.add(note.slug);
    const { assetBasePath, contentPath, detailImage, ...entry } = note;
    entries.push(entry);

    if (!contentPath) {
      continue;
    }

    if (!contentPath.startsWith("/notes/")) {
      throw new Error(`Memory detail ${locale}/${note.slug} must load from /notes`);
    }

    detailsBySlug.set(note.slug, {
      ...entry,
      image: detailImage,
      socialImage: note.image,
      assetBasePath,
      contentPath,
    });
  }

  return { entries, detailsBySlug };
}

const catalogs: Record<Locale, MemoryLocaleCatalog> = {
  en: createLocaleCatalog("en", memoryNotesByLocale.en),
  zh: createLocaleCatalog("zh", memoryNotesByLocale.zh),
};

export function listMemory(locale: Locale) {
  return catalogs[locale].entries;
}

export function getMemoryDetail(locale: Locale, slug: string | undefined) {
  return slug ? catalogs[locale].detailsBySlug.get(slug) : undefined;
}

export function hasMemoryDetail(locale: Locale, slug: string) {
  return catalogs[locale].detailsBySlug.has(slug);
}

export const memoryEntriesByLocale: Record<Locale, MemoryEntry[]> = {
  en: listMemory("en"),
  zh: listMemory("zh"),
};

export const memoryDetailsByLocale: Record<Locale, MemoryDetail[]> = {
  en: [...catalogs.en.detailsBySlug.values()],
  zh: [...catalogs.zh.detailsBySlug.values()],
};
