import type { Locale } from "../i18n";
import type { MemoryEntry } from "../types/content";

export const memoryEntriesByLocale: Record<Locale, MemoryEntry[]> = {
  en: [
    {
      slug: "hentai-prison-note",
      title: "A note on Hentai Prison",
      year: "2025",
      summary:
        "One of my long-form game notes, remembered less for shock value and more for its obsession with freedom, loyalty, and emotional payoff.",
      reflection:
        "I tend to stay with story-heavy games that hide precise character writing behind chaotic surfaces. This review started as a reaction to route design and ended up being a note about escape, resilience, and why certain endings keep echoing.",
      image: "/media/memory-freedom.jpg",
      tags: ["Visual Novel", "Storytelling", "Game Notes"],
    },
  ],
  zh: [
    {
      slug: "hentai-prison-note",
      title: "关于《Hentai Prison》的一则记录",
      year: "2025",
      summary: "这是我较长的一篇游戏笔记。真正让我记住它的不是话题性，而是它对自由、忠诚与情绪回响的执着。",
      reflection:
        "我一直会被那些表面混乱、内里却有精细人物书写的故事型游戏吸引。这篇记录最初只是对路线设计的反应，最后却变成了一篇关于逃离、韧性和某些结局为何会久久回响的笔记。",
      image: "/media/memory-freedom.jpg",
      tags: ["视觉小说", "叙事", "游戏笔记"],
    },
  ],
};
