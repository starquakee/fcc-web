import type { Locale } from "../i18n";
import type { SocialLink } from "../types/content";

export const socialLinksByLocale: Record<Locale, SocialLink[]> = {
  en: [
    {
      label: "Email",
      href: "mailto:chenchenfengcn@gmail.com",
      note: "Best for collaboration and direct contact",
    },
    {
      label: "GitHub",
      href: "https://github.com/starquakee",
      note: "Code, experiments, and public repositories",
    },
    {
      label: "ORCID",
      href: "https://orcid.org/0009-0000-1072-8183",
      note: "Research identity and publication record",
    },
    {
      label: "Google Scholar",
      href: "https://scholar.google.com/citations?user=t9jcbNUAAAAJ",
      note: "Scholar profile and citation record",
    },
    {
      label: "LeetCode",
      href: "https://leetcode.cn/u/star-quake/",
      note: "Algorithm practice and problem solving",
    },
    {
      label: "Bangumi",
      href: "https://bangumi.tv/user/846860",
      note: "Personal archive for anime and visual novels",
    },
  ],
  zh: [
    {
      label: "邮箱",
      href: "mailto:chenchenfengcn@gmail.com",
      note: "最适合合作交流和直接联系",
    },
    {
      label: "GitHub",
      href: "https://github.com/starquakee",
      note: "代码、实验和公开仓库",
    },
    {
      label: "ORCID",
      href: "https://orcid.org/0009-0000-1072-8183",
      note: "学术身份与论文记录",
    },
    {
      label: "谷歌学术",
      href: "https://scholar.google.com/citations?user=t9jcbNUAAAAJ",
      note: "学术主页与引用记录",
    },
    {
      label: "LeetCode",
      href: "https://leetcode.cn/u/star-quake/",
      note: "算法练习与题解积累",
    },
    {
      label: "Bangumi",
      href: "https://bangumi.tv/user/846860",
      note: "动漫、Galgame 与个人兴趣记录",
    },
  ],
};
