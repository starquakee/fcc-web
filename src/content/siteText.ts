import type { Locale } from "../i18n";

type SiteText = {
  skipToContent: string;
  brandNote: string;
  languageSwitchLabel: string;
  nav: {
    home: string;
    publications: string;
    projects: string;
    writing: string;
    cv: string;
    memory: string;
  };
  footer: {
    email: string;
    visits: string;
    visitsPreview: string;
    visitsUnavailable: string;
  };
  common: {
    tags: string;
    publication: string;
    journal: string;
    project: string;
    built: string;
    implementation: string;
    readPaper: string;
    code: string;
    viewCode: string;
    browseAllWriting: string;
    openDocument: string;
    openPdf: string;
    experience: string;
    education: string;
    overview: string;
    contact: string;
    currentPositioning: string;
    researchIdentity: string;
  };
  home: {
    eyebrow: string;
    ctaPrimary: string;
    ctaSecondary: string;
    selectedWorkTitle: string;
    selectedWorkBody: string;
    focusTitle: string;
    focusBody: string;
    timelineTitle: string;
    timelineBody: string;
    writingTitle: string;
    writingBody: string;
    contactTitle: string;
    contactBody: string;
  };
  publications: {
    eyebrow: string;
    title: string;
    body: string;
    noteTitle: string;
    noteHeading: string;
    noteBody: string;
  };
  projects: {
    eyebrow: string;
    title: string;
    body: string;
  };
  writing: {
    eyebrow: string;
    title: string;
    body: string;
  };
  memory: {
    eyebrow: string;
    title: string;
    readMore: string;
    backToList: string;
  };
  cv: {
    eyebrow: string;
    title: string;
    download: string;
  };
  notFound: {
    title: string;
    body: string;
    cta: string;
  };
};

export const siteText: Record<Locale, SiteText> = {
  en: {
    skipToContent: "Skip to content",
    brandNote: "Editorial-tech portfolio",
    languageSwitchLabel: "Select language",
    nav: {
      home: "Home",
      publications: "Publications",
      projects: "Projects",
      writing: "Writing",
      cv: "CV",
      memory: "Notes",
    },
    footer: {
      email: "Email",
      visits: "Visits",
      visitsPreview: "Visit counter starts on the deployed site.",
      visitsUnavailable: "Visit counter unavailable.",
    },
    common: {
      tags: "Tags",
      publication: "Publication",
      journal: "Journal",
      project: "Project",
      built: "Built",
      implementation: "Implementation",
      readPaper: "Read paper",
      code: "Code",
      viewCode: "View code",
      browseAllWriting: "Browse all writing",
      openDocument: "Open document",
      openPdf: "Open PDF",
      experience: "Experience",
      education: "Education",
      overview: "Overview",
      contact: "Contact",
      currentPositioning: "Current Positioning",
      researchIdentity: "Research Identity",
    },
    home: {
      eyebrow: "Research + Engineering",
      ctaPrimary: "View selected work",
      ctaSecondary: "Open CV",
      selectedWorkTitle: "Selected Work",
      selectedWorkBody:
        "A small mix of publication work and hands-on systems projects that best represents how I think and build.",
      focusTitle: "Research Focus",
      focusBody: "Research Focus",
      timelineTitle: "Education and Experience",
      timelineBody: "Timeline",
      writingTitle: "Writing",
      writingBody: "Writing Preview",
      contactTitle: "Contact",
      contactBody: "Contact",
    },
    publications: {
      eyebrow: "Publications",
      title: "Publications",
      body:
        "Current work centers on Differential Evolution and how to push it further with meta-level adaptation, diversity, and GPU-aware execution.",
      noteTitle: "From paper to code",
      noteHeading:
        "I prefer research that can be inspected, reproduced, and pushed into working systems rather than staying purely conceptual.",
      noteBody: "Current Positioning",
    },
    projects: {
      eyebrow: "Projects",
      title: "Projects",
      body:
        "These projects sit across AI tooling, optimization, full-stack workflow software, and networking fundamentals.",
    },
    writing: {
      eyebrow: "Writing",
      title: "Writing",
      body:
        "Most of these pieces come from concrete problem-solving: routing heuristics, mathematical modeling, and implementation-focused reports.",
    },
    memory: {
      eyebrow: "Notes",
      title: "Notes",
      readMore: "Read full note",
      backToList: "Back to Notes",
    },
    cv: {
      eyebrow: "Curriculum Vitae",
      title: "Curriculum Vitae",
      download: "Download PDF CV",
    },
    notFound: {
      title: "That page does not exist.",
      body: "The route may have moved, or the URL may be incomplete.",
      cta: "Return home",
    },
  },
  zh: {
    skipToContent: "跳转到正文",
    brandNote: "个人学术与技术主页",
    languageSwitchLabel: "选择语言",
    nav: {
      home: "首页",
      publications: "论文",
      projects: "项目",
      writing: "文章",
      cv: "简历",
      memory: "小记",
    },
    footer: {
      email: "邮箱",
      visits: "访问量",
      visitsPreview: "访问计数会在部署后开始记录。",
      visitsUnavailable: "访问计数暂时不可用。",
    },
    common: {
      tags: "标签",
      publication: "论文",
      journal: "期刊",
      project: "项目",
      built: "已完成",
      implementation: "实现",
      readPaper: "查看论文",
      code: "代码",
      viewCode: "查看代码",
      browseAllWriting: "查看全部文章",
      openDocument: "打开文档",
      openPdf: "打开 PDF",
      experience: "实习与经历",
      education: "教育背景",
      overview: "概览",
      contact: "联系方式",
      currentPositioning: "当前定位",
      researchIdentity: "研究取向",
    },
    home: {
      eyebrow: "研究 + 工程",
      ctaPrimary: "查看精选内容",
      ctaSecondary: "打开简历",
      selectedWorkTitle: "精选内容",
      selectedWorkBody: "这里选取了最能代表我研究方向和工程能力的一组论文与项目。",
      focusTitle: "研究兴趣",
      focusBody: "研究兴趣",
      timelineTitle: "教育背景与经历",
      timelineBody: "时间线",
      writingTitle: "文章",
      writingBody: "文章预览",
      contactTitle: "联系方式",
      contactBody: "联系我",
    },
    publications: {
      eyebrow: "论文",
      title: "论文",
      body: "目前的工作主要围绕 Differential Evolution，以及如何通过元层优化、多样性设计和 GPU 加速进一步提升它。",
      noteTitle: "从论文到代码",
      noteHeading: "我更偏好那些可以被检查、复现，并最终落到真实系统里的研究，而不是停留在概念层面。",
      noteBody: "当前定位",
    },
    projects: {
      eyebrow: "项目",
      title: "项目",
      body: "这些项目覆盖 AI 工具、优化方法、全栈业务系统以及网络基础实现。",
    },
    writing: {
      eyebrow: "文章",
      title: "文章",
      body: "这些内容大多来自具体问题求解过程，比如路径规划启发式、数学建模以及实现导向的项目报告。",
    },
    memory: {
      eyebrow: "小记",
      title: "小记",
      readMore: "查看全文",
      backToList: "返回小记",
    },
    cv: {
      eyebrow: "简历",
      title: "简历",
      download: "下载 PDF 简历",
    },
    notFound: {
      title: "页面不存在。",
      body: "这个地址可能已经变更，或者输入的链接不完整。",
      cta: "返回首页",
    },
  },
};
