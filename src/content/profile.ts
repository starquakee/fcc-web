import type { Locale } from "../i18n";
import type { Profile } from "../types/content";

export const profilesByLocale: Record<Locale, Profile> = {
  en: {
    name: "Chenchen Feng",
    heroTitle: "Hi, I'm Chenchen Feng.",
    shortRole: "EC Researcher + Systems Builder",
    location: "Shenzhen, China",
    institution: "Southern University of Science and Technology",
    email: "chenchenfengcn@gmail.com",
    description:
      "I'm a second-year master's student in computer science focused on Evolutionary Computation, Backend Engineering, and LLM Applications.",
    extendedBio:
      "My background is a mix of academic experimentation and product-minded implementation. I care about algorithmic clarity, robust system design, and interfaces that feel intentional. Outside work, I keep a long-running habit of documenting anime, visual novels, and story-heavy games, which quietly shapes how I think about structure and detail.",
    portrait: "/media/profile-photo.jpg",
    availability: "Since 2026.03: Intern with the Harness team at Moonshot AI.",
    seoDescription:
      "Chenchen Feng is a graduate student focused on evolutionary computation, LLM systems, and backend engineering.",
    heroStats: [
      { label: "Journal papers", value: "2" },
      { label: "Internships", value: "2" },
      { label: "GitHub Stars", value: "500+" },
      { label: "LeetCode solved", value: "1000+" },
    ],
    focusAreas: [
      {
        title: "Evolutionary Computation",
        description:
          "Designing stronger Differential Evolution variants and meta-level optimization strategies with GPU-aware implementations.",
        bullets: [
          "Meta-level parameter and strategy evolution",
          "Individual-level strategy diversity",
          "Benchmark-driven evaluation on challenging black-box problems",
        ],
      },
      {
        title: "Harness Developments",
        description:
          "Building the runtime around LLM agents, with a focus on execution loops, context management, and reliable tool use",
        bullets: [
          "Agent orchestration and tool-use workflows",
          "Context and state management for long-running tasks",
          "Failure recovery, observability, and evaluation",
        ],
      },
    ],
    timeline: [
      {
        category: "experience",
        period: "2026.03 - Present",
        title: "Harness Development",
        subtitle: "Moonshot AI (Kimi)",
        logoSrc: "/media/logos/moonshot.webp",
        logoAlt: "Moonshot AI logo",
        body: [
          "Working on agent development for LLM products, turning model capabilities into reliable user-facing workflows.",
          "Focusing on agent orchestration, tool-use flows, and engineering support for agentic applications.",
        ],
      },
      {
        category: "experience",
        period: "2025.12 - 2026.02",
        title: "LLM Algorithms",
        subtitle: "Sangfor",
        logoSrc: "/media/logos/sangfor.png",
        logoAlt: "Sangfor logo",
        body: [
          "Worked on post-training for a security-focused large language model.",
          "Covered both supervised fine-tuning (SFT) and reinforcement learning from human feedback (RLHF).",
        ],
      },
      {
        category: "education",
        period: "2024 - Present",
        title: "Master of Computer Science",
        subtitle: "Southern University of Science and Technology",
        logoSrc: "/media/logos/sustech.jpg",
        logoAlt: "Southern University of Science and Technology logo",
        body: [
          "Researching evolutionary computation with a focus on Differential Evolution.",
          "Extending research output into open-source code and reproducible systems.",
        ],
      },
      {
        category: "education",
        period: "2020 - 2024",
        title: "Bachelor of Computer Science",
        subtitle: "Southern University of Science and Technology",
        logoSrc: "/media/logos/sustech.jpg",
        logoAlt: "Southern University of Science and Technology logo",
        body: [
          "Completed thesis work on MetaDE, a meta-level Differential Evolution framework.",
          "Built a foundation across algorithms, systems, and applied machine learning.",
        ],
      },
    ],
  },
  zh: {
    name: "冯晨晨",
    heroTitle: "你好，我是冯晨晨。",
    shortRole: "进化计算研究者 + 系统构建者",
    location: "中国，深圳",
    institution: "南方科技大学",
    email: "chenchenfengcn@gmail.com",
    description:
      "计算机科学研二在读，研究方向包括 Evolutionary Computation、后端工程和 LLM 应用。",
    extendedBio:
      "我的背景同时包含学术探索和偏产品落地的工程实现。我重视算法逻辑的清晰性、系统设计的稳健性，以及真正具有意图的界面表达。工作之外，我长期记录动画、视觉小说和故事型游戏，这些兴趣也在潜移默化地影响我对结构和细节的理解。",
    portrait: "/media/profile-photo.jpg",
    availability: "自 2026.03 起在月之暗面 Harness 部门实习。",
    seoDescription: "冯晨晨，研究方向包括 Evolutionary Computation、LLM 系统以及后端工程。",
    heroStats: [
      { label: "期刊论文", value: "2" },
      { label: "实习经历", value: "2" },
      { label: "GitHub Stars", value: "500+" },
      { label: "LeetCode 刷题", value: "1000+" },
    ],
    focusAreas: [
      {
        title: "Evolutionary Computation",
        description: "围绕 Differential Evolution 设计更强的变体，以及适合 GPU 加速的元层优化策略。",
        bullets: ["元层参数与策略进化", "个体层策略多样性", "面向复杂黑盒问题的基准评测"],
      },
      {
        title: "Harness Developments",
        description: "构建 LLM Agent 的运行环境，关注执行循环、上下文管理与可靠的工具调用",
        bullets: ["Agent 编排与工具调用流程", "长任务的上下文与状态管理", "失败恢复、运行观测与评估"],
      },
    ],
    timeline: [
      {
        category: "experience",
        period: "2026.03 - 至今",
        title: "Harness开发",
        subtitle: "月之暗面（Kimi）",
        logoSrc: "/media/logos/moonshot.webp",
        logoAlt: "月之暗面标志",
        body: [
          "参与 LLM 产品中的 Agents 开发，将模型能力落地到稳定的用户工作流中。",
          "主要聚焦 Agent 编排、工具调用流程以及智能体应用的工程化支撑。",
        ],
      },
      {
        category: "experience",
        period: "2025.12 - 2026.02",
        title: "大模型算法",
        subtitle: "深信服",
        logoSrc: "/media/logos/sangfor.png",
        logoAlt: "深信服标志",
        body: [
          "参与安全大模型的 post-training 相关工作。",
          "主要覆盖 SFT 与 RLHF 两类训练流程。",
        ],
      },
      {
        category: "education",
        period: "2024 - 至今",
        title: "计算机科学硕士",
        subtitle: "南方科技大学",
        logoSrc: "/media/logos/sustech.jpg",
        logoAlt: "南方科技大学标志",
        body: [
          "主要研究 Evolutionary Computation，尤其关注 Differential Evolution。",
          "同步推进研究代码开源与可复现实验系统。",
        ],
      },
      {
        category: "education",
        period: "2020 - 2024",
        title: "计算机科学学士",
        subtitle: "南方科技大学",
        logoSrc: "/media/logos/sustech.jpg",
        logoAlt: "南方科技大学标志",
        body: [
          "本科毕业设计围绕 MetaDE 展开，这是一个元层 Differential Evolution 框架。",
          "系统学习了算法、系统和应用机器学习相关基础。",
        ],
      },
    ],
  },
};
