import type { Locale } from "../i18n";
import type { MemoryEntry } from "../types/content";

export const memoryEntriesByLocale: Record<Locale, MemoryEntry[]> = {
  en: [
    {
      slug: "istratde-alphaevolve",
      title: "Diversity as Compute: From iStratDE to AlphaEvolve",
      year: "2026",
      summary:
        "A research note on the shared search philosophy behind iStratDE, AlphaEvolve, Quality Diversity, and possible LLM agent systems.",
      reflection:
        "The interesting thread is not that both systems use evolution, but that both treat structured diversity as a source of capability. That idea feels portable beyond DE and algorithm discovery.",
      image: "/media/memory-istratde-alphaevolve.png",
      tags: ["LLM Agents", "iStratDE", "Quality Diversity"],
    },
    {
      slug: "harness-engineering",
      title: "From the Agent Formula to Harness Engineering",
      year: "2026",
      summary:
        "A note on the engineering layer that makes agents reliable: loops, context, state, tools, permissions, evaluation, and self-improvement.",
      reflection:
        "The useful shift here is from asking whether the model is smart enough to asking whether the surrounding system can let it recover, stay bounded, learn from failure, and keep working over time.",
      image: "/media/logos/moonshot.webp",
      tags: ["Agents", "AI Systems", "Engineering"],
    },
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
      slug: "istratde-alphaevolve",
      title: "把多样性当成算力：从 iStratDE 到 AlphaEvolve",
      year: "2026",
      summary: "我把 iStratDE 和 AlphaEvolve 放在一起看，想弄清楚多样性为什么可能是一种算力。",
      reflection:
        "让我在意的不是它们都用了演化，而是它们都没有急着把搜索压成单一路径。这个想法也许能迁移到 LLM Agent。",
      image: "/media/memory-istratde-alphaevolve.png",
      tags: ["LLM Agent", "iStratDE", "Quality Diversity"],
    },
    {
      slug: "harness-engineering",
      title: "从 Agent 公式到 Harness 工程",
      year: "2026",
      summary: "整理一下 Agent 外层运行系统到底要管什么，包括循环、上下文、状态、权限和评估。",
      reflection:
        "我越来越觉得，问题不只是模型够不够聪明。更麻烦的是外层系统能不能让它恢复、受控，并且别在长任务里迷路。",
      image: "/media/logos/moonshot.webp",
      tags: ["Agent", "AI 系统", "工程化"],
    },
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
