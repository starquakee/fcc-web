export type SocialLink = {
  label: string;
  href: string;
  note: string;
};

export type FocusArea = {
  title: string;
  description: string;
  bullets: string[];
};

export type TimelineEntry = {
  category: "experience" | "education";
  period: string;
  title: string;
  subtitle: string;
  body: string[];
};

export type Profile = {
  name: string;
  role: string;
  heroTitle: string;
  shortRole: string;
  location: string;
  institution: string;
  email: string;
  description: string;
  extendedBio: string;
  portrait: string;
  availability: string;
  seoDescription: string;
  heroStats: Array<{ label: string; value: string }>;
  focusAreas: FocusArea[];
  timeline: TimelineEntry[];
};

export type Publication = {
  slug: string;
  title: string;
  venue: string;
  year: string;
  summary: string;
  abstract: string;
  pdfUrl: string;
  codeUrl?: string;
  tags: string[];
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  impact: string;
  stack: string[];
  links: Array<{ label: string; href: string }>;
};

export type WritingEntry = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  href: string;
};

export type MemoryEntry = {
  slug: string;
  title: string;
  year: string;
  summary: string;
  reflection: string;
  image: string;
  tags: string[];
};

export type MemoryDetail = {
  slug: string;
  title: string;
  year: string;
  summary: string;
  image: string;
  tags: string[];
  contentPath: string;
};
