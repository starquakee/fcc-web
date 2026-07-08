import type { Locale } from "../i18n";
import type { MemoryDetail } from "../types/content";
import { memoryNotesByLocale } from "./memoryNotes";

export const memoryDetailsByLocale = Object.fromEntries(
  Object.entries(memoryNotesByLocale).map(([locale, notes]) => [
    locale,
    notes.flatMap(({ contentPath, detailImage, image, reflection, ...note }) =>
      contentPath
        ? [
            {
              ...note,
              image: detailImage,
              socialImage: image,
              contentPath,
            },
          ]
        : [],
    ),
  ]),
) as Record<Locale, MemoryDetail[]>;
