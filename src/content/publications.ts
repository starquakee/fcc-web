import type { Locale } from "../i18n";
import type { Publication } from "../types/content";

export const publicationsByLocale: Record<Locale, Publication[]> = {
  en: [
    {
      slug: "istratde",
      title: "Unleashing the Potential of Differential Evolution through Individual-Level Strategy Diversity",
      venue: "IEEE Transactions on Evolutionary Computation",
      year: "2026",
      summary:
        "A GPU-accelerated Differential Evolution framework that improves performance through individual-level strategy diversity.",
      abstract:
        "iStratDE explores strategy diversity at the individual level instead of relying on a single static strategy schedule. The work emphasizes practical performance improvements while keeping the framework efficient enough for large-scale experimentation.",
      pdfUrl: "/docs/istratde.pdf",
      codeUrl: "https://github.com/EMI-Group/istratde",
      tags: ["Differential Evolution", "GPU", "Strategy Diversity", "TEVC"],
    },
    {
      slug: "metade",
      title: "MetaDE: Evolving Differential Evolution by Differential Evolution",
      venue: "IEEE Transactions on Evolutionary Computation",
      year: "2025",
      summary:
        "A meta-level Differential Evolution framework that optimizes DE hyperparameters and strategies through DE itself.",
      abstract:
        "MetaDE treats Differential Evolution as both the solver and the optimizer of its own configuration space. The framework combines specialized parameterization with GPU-parallel execution to automate hyperparameter and strategy adaptation inside one coherent process.",
      pdfUrl: "/docs/metade.pdf",
      codeUrl: "https://github.com/EMI-Group/metade",
      tags: ["Meta-Optimization", "Evolutionary Computation", "GPU", "TEVC"],
    },
  ],
  zh: [
    {
      slug: "istratde",
      title: "Unleashing the Potential of Differential Evolution through Individual-Level Strategy Diversity",
      venue: "IEEE Transactions on Evolutionary Computation",
      year: "2026",
      summary: "一个基于 GPU 加速的 Differential Evolution 框架，通过个体层面的策略多样性来提升整体性能。",
      abstract:
        "iStratDE 从个体层面探索策略多样性，而不是依赖单一静态策略调度。该工作在保持大规模实验效率的同时，强调了实际性能收益和可扩展性。",
      pdfUrl: "/docs/istratde.pdf",
      codeUrl: "https://github.com/EMI-Group/istratde",
      tags: ["Differential Evolution", "GPU", "Strategy Diversity", "TEVC"],
    },
    {
      slug: "metade",
      title: "MetaDE: Evolving Differential Evolution by Differential Evolution",
      venue: "IEEE Transactions on Evolutionary Computation",
      year: "2025",
      summary: "一个元层 Differential Evolution 框架，用 DE 自身去优化 DE 的超参数和策略选择。",
      abstract:
        "MetaDE 将 Differential Evolution 同时视为求解器和自身配置空间的优化器。它结合专门设计的参数化方式和 GPU 并行执行，把超参数优化与实际求解过程整合到一个统一框架里。",
      pdfUrl: "/docs/metade.pdf",
      codeUrl: "https://github.com/EMI-Group/metade",
      tags: ["Meta-Optimization", "Evolutionary Computation", "GPU", "TEVC"],
    },
  ],
};
