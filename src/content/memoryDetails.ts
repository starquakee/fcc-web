import type { Locale } from "../i18n";
import type { MemoryDetail } from "../types/content";

export const memoryDetailsByLocale: Record<Locale, MemoryDetail[]> = {
  en: [
    {
      slug: "harness-engineering",
      title: "From the Agent Formula to Harness Engineering",
      year: "2026",
      summary:
        "A note on the engineering layer that makes agents reliable: loops, context, state, tools, permissions, evaluation, and self-improvement.",
      tags: ["Agents", "AI Systems", "Engineering"],
      contentPath: "/notes/harness-engineering-en.md",
    },
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
      slug: "harness-engineering",
      title: "从 Agent 公式到 Harness 工程",
      year: "2026",
      summary: "一篇关于 Agent 工程化外壳的整理：运行循环、上下文、状态、工具权限、评估体系和自我改进。",
      tags: ["Agent", "AI 系统", "工程化"],
      contentPath: "/notes/harness-engineering-zh.md",
    },
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
