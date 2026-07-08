import type { Locale } from "../i18n";
import type { MemoryEntry } from "../types/content";
import { memoryNotesByLocale } from "./memoryNotes";

export const memoryEntriesByLocale = Object.fromEntries(
  Object.entries(memoryNotesByLocale).map(([locale, notes]) => [
    locale,
    notes.map(({ assetBasePath, contentPath, detailImage, ...entry }) => entry),
  ]),
) as Record<Locale, MemoryEntry[]>;
