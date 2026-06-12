import type { Locale } from "../i18n";
import type { Profile } from "../types/content";

export const profilesByLocale: Record<Locale, Profile> = {
  en: {
    name: "Chenchen Feng",
    role: "Graduate student building evolutionary computation research, LLM applications, and dependable backend systems.",
    heroTitle: "Hi, I'm Chenchen Feng — a second-year CS Master's student.",
    shortRole: "EC Researcher + Systems Builder",
    location: "Shenzhen, China",
    institution: "Southern University of Science and Technology",
    email: "chenchenfengcn@gmail.com",
    description:
      "I am interested in Evolutionary Computation, Backend Engineering, and LLM Applications.",
    extendedBio:
      "My background is a mix of academic experimentation and product-minded implementation. I care about algorithmic clarity, robust system design, and interfaces that feel intentional. Outside work, I keep a long-running habit of documenting anime, visual novels, and story-heavy games, which quietly shapes how I think about structure and detail.",
    portrait: "/media/profile-photo.jpg",
    availability: "Since 2026.02: Agents Development Intern at Moonshot AI (Kimi), building agentic applications for LLM products.",
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
        title: "LLM Applications",
        description:
          "Building RAG pipelines and agentic tooling that keep retrieval traceable, resilient, and usable in research workflows.",
        bullets: [
          "Citation-grounded retrieval systems",
          "Parallel agent workflows for speed and coverage",
          "Graceful degradation for long-running document tasks",
        ],
      },
      {
        title: "Backend Engineering",
        description:
          "Turning ideas into reliable software with a bias toward data integrity, clear interfaces, and practical deployment.",
        bullets: [
          "Database and service design",
          "Concurrency-aware application features",
          "Operational thinking beyond proof-of-concept demos",
        ],
      },
    ],
    timeline: [
      {
        category: "experience",
        period: "2026.02 - Present",
        title: "Agents Development Intern",
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
        title: "LLM Post-Training Intern",
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
    role: "研究方向覆盖 Evolutionary Computation、LLM 应用以及可靠后端系统实现的计算机硕士研究生。",
    heroTitle: "你好，我是冯晨晨，\n计算机科学研二在读。",
    shortRole: "进化计算研究者 + 系统构建者",
    location: "中国，深圳",
    institution: "南方科技大学",
    email: "chenchenfengcn@gmail.com",
    description:
      "我的研究方向包括 Evolutionary Computation、后端工程和 LLM 应用。",
    extendedBio:
      "我的背景同时包含学术探索和偏产品落地的工程实现。我重视算法逻辑的清晰性、系统设计的稳健性，以及真正具有意图的界面表达。工作之外，我长期记录动画、视觉小说和故事型游戏，这些兴趣也在潜移默化地影响我对结构和细节的理解。",
    portrait: "/media/profile-photo.jpg",
    availability: "自 2026.02 起在月之暗面（Kimi）实习，负责 LLM 产品中的 Agents 开发。",
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
        title: "LLM Applications",
        description: "构建可追踪、可用、能在研究流程里真正落地的 RAG 与多智能体系统。",
        bullets: ["带引用追踪的检索系统", "多智能体协作工作流", "面向长任务的降级与稳定性设计"],
      },
      {
        title: "Backend Engineering",
        description: "把想法落到可靠软件里，重视数据一致性、接口清晰度以及部署后的可维护性。",
        bullets: ["数据库与服务设计", "并发场景下的功能实现", "超越 Demo 的系统性思考"],
      },
    ],
    timeline: [
      {
        category: "experience",
        period: "2026.02 - 至今",
        title: "Agents 开发实习生",
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
        title: "安全大模型实习生",
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
