import type { Locale } from "../i18n";
import type { WritingEntry } from "../types/content";

export const writingEntriesByLocale: Record<Locale, WritingEntry[]> = {
  en: [
    {
      slug: "mcm-icm-math-model",
      title: "MCM/ICM Math Model",
      date: "April 2023",
      summary:
        "A modeling note on how sailboat value changes with time and attributes, with supporting analysis packaged as a PDF report.",
      tags: ["Math Modeling", "Optimization", "Report"],
      href: "/docs/math-model.pdf",
    },
    {
      slug: "path-scanning-carp",
      title: "Path-Scanning Algorithm for the Capacitated Arc Routing Problem",
      date: "December 2022",
      summary:
        "A focused write-up on path-scanning, local search, and heuristic improvement strategies for the NP-hard CARP setting.",
      tags: ["CARP", "Algorithms", "Local Search"],
      href: "/docs/path-scanning.pdf",
    },
    {
      slug: "carp-report",
      title: "Capacitated Arc Routing Problem",
      date: "November 2022",
      summary:
        "An earlier implementation report on shortest paths, path-scanning, and randomized heuristics for open capacitated arc routing.",
      tags: ["CARP", "Python", "Heuristics"],
      href: "/docs/carp-report.pdf",
    },
  ],
  zh: [
    {
      slug: "mcm-icm-math-model",
      title: "MCM/ICM 数学建模",
      date: "2023年4月",
      summary: "关于帆船价格如何随时间和属性变化的建模分析，并整理成一份完整 PDF 报告。",
      tags: ["数学建模", "优化", "报告"],
      href: "/docs/math-model.pdf",
    },
    {
      slug: "path-scanning-carp",
      title: "容量弧路径规划问题的 Path-Scanning 算法",
      date: "2022年12月",
      summary: "围绕 NP-hard 的 CARP 问题，记录 path-scanning、局部搜索与启发式改进策略的技术笔记。",
      tags: ["CARP", "算法", "局部搜索"],
      href: "/docs/path-scanning.pdf",
    },
    {
      slug: "carp-report",
      title: "容量弧路径规划问题",
      date: "2022年11月",
      summary: "较早期的一份实现报告，涵盖最短路、path-scanning 和随机启发式方法在开放式 CARP 上的应用。",
      tags: ["CARP", "Python", "启发式"],
      href: "/docs/carp-report.pdf",
    },
  ],
};
