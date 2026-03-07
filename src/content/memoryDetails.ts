import type { Locale } from "../i18n";
import type { MemoryDetail } from "../types/content";

export const memoryDetailsByLocale: Record<Locale, MemoryDetail[]> = {
  en: [
    {
      slug: "hentai-prison-note",
      title: "A note on Hentai Prison",
      year: "2025",
      summary:
        "One of my long-form game notes, remembered less for shock value and more for its obsession with freedom, loyalty, and emotional payoff.",
      image: "/media/notes/henpri/freedom.jpg",
      tags: ["Visual Novel", "Storytelling", "Game Notes"],
      contentPath: "/notes/henpri.md",
    },
  ],
  zh: [
    {
      slug: "hentai-prison-note",
      title: "关于《Hentai Prison》的一则记录",
      year: "2025",
      summary: "这是我较长的一篇游戏笔记。真正让我记住它的不是话题性，而是它对自由、忠诚与情绪回响的执着。",
      image: "/media/notes/henpri/freedom.jpg",
      tags: ["视觉小说", "叙事", "游戏笔记"],
      contentPath: "/notes/henpri.md",
    },
  ],
};
