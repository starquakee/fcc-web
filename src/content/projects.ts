import type { Locale } from "../i18n";
import type { Project } from "../types/content";

export const projectsByLocale: Record<Locale, Project[]> = {
  en: [
    {
      slug: "ai-academic-research-assistant",
      title: "AI Academic Research Assistant",
      subtitle: "RAG engine and multi-agent research workflow",
      summary:
        "Built a retrieval-augmented research assistant with traceable citations, multi-agent orchestration, and a production-oriented Streamlit interface.",
      impact:
        "The system focused on reducing hallucinations while staying usable for batch document analysis and long-running tasks.",
      stack: ["Python", "RAG", "Agents", "Streamlit"],
      links: [],
    },
    {
      slug: "supercritical-airfoil-design",
      title: "Supercritical Airfoil Design and Optimization",
      subtitle: "Deep learning assisted aerodynamic optimization",
      summary:
        "Designed and optimized a supercritical airfoil for large passenger aircraft using a workflow that combined domain knowledge with data-driven optimization.",
      impact:
        "The resulting design outperformed manual baselines on key aerodynamic targets including flutter coefficient and lift-to-drag ratio.",
      stack: ["Python", "Matlab", "Deep Learning", "Optimization"],
      links: [],
    },
    {
      slug: "research-fund-management-system",
      title: "Research Fund Management System",
      subtitle: "Full-stack university workflow platform",
      summary:
        "Developed a system for faculty fund applications and approvals with messaging, visualization, and concurrency-conscious backend behavior.",
      impact:
        "This project balanced business workflow complexity with reliability, making administrative processes clearer for both applicants and reviewers.",
      stack: ["Spring Boot", "MySQL", "Vue", "Data Visualization"],
      links: [],
    },
    {
      slug: "udp-p2p-transfer",
      title: "P2P File Transfer with UDP and Congestion Control",
      subtitle: "Reliable transport mechanics built from lower-level primitives",
      summary:
        "Implemented a UDP-based peer-to-peer file transfer tool with TCP-like reliability guarantees and congestion-aware behavior.",
      impact:
        "The project sharpened protocol-level thinking around retransmission, sequencing, and throughput under unstable network conditions.",
      stack: ["Python", "UDP", "Congestion Control", "Networking"],
      links: [],
    },
  ],
  zh: [
    {
      slug: "ai-academic-research-assistant",
      title: "AI 学术研究助手",
      subtitle: "基于 RAG 与多智能体的研究工作流",
      summary: "构建了一个带可追踪引用的研究助手系统，结合多智能体协作和面向实际使用的 Streamlit 界面。",
      impact: "这个系统重点解决幻觉问题，同时保证在批量文档分析和长任务场景下依然可用。",
      stack: ["Python", "RAG", "Agents", "Streamlit"],
      links: [],
    },
    {
      slug: "supercritical-airfoil-design",
      title: "超临界翼型设计与优化",
      subtitle: "结合深度学习的气动优化",
      summary: "面向大型宽体客机设计并优化超临界翼型，把领域知识和数据驱动优化结合到同一流程中。",
      impact: "最终方案在颤振系数和升阻比等关键指标上优于人工设计基线。",
      stack: ["Python", "Matlab", "Deep Learning", "Optimization"],
      links: [],
    },
    {
      slug: "research-fund-management-system",
      title: "科研经费管理系统",
      subtitle: "高校场景下的全栈业务平台",
      summary: "开发了一个用于教师经费申请与审批的系统，包含消息、可视化以及面向并发场景的后端设计。",
      impact: "这个项目在业务复杂度和系统可靠性之间做了平衡，让申请者和审批者的流程都更清晰。",
      stack: ["Spring Boot", "MySQL", "Vue", "Data Visualization"],
      links: [],
    },
    {
      slug: "udp-p2p-transfer",
      title: "基于 UDP 的 P2P 文件传输与拥塞控制",
      subtitle: "从底层机制出发实现可靠传输",
      summary: "实现了一个基于 UDP 的点对点文件传输工具，并补齐了类似 TCP 的可靠性和拥塞控制能力。",
      impact: "这个项目强化了我对重传、序号管理以及不稳定网络下吞吐控制的理解。",
      stack: ["Python", "UDP", "Congestion Control", "Networking"],
      links: [],
    },
  ],
};
