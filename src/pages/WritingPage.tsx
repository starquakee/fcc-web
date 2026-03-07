import { WritingCard } from "../components/cards/WritingCard";
import { Reveal } from "../components/ui/Reveal";
import { siteText } from "../content/siteText";
import { writingEntriesByLocale } from "../content/writing";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useLanguage } from "../i18n";

export function WritingPage() {
  const { locale } = useLanguage();
  const text = siteText[locale];
  const writingEntries = writingEntriesByLocale[locale];

  useDocumentMeta(
    locale === "zh" ? "文章 | 冯晨晨" : "Writing | Chenchen Feng",
    locale === "zh" ? "冯晨晨的报告、技术笔记与文章。" : "Reports, technical notes, and article-style writing by Chenchen Feng.",
  );

  return (
    <div className="page-stack">
      <Reveal className="page-hero">
        <h1>{text.writing.title}</h1>
        <p>{text.writing.body}</p>
      </Reveal>

      <Reveal className="section-block" delay={80}>
        <div className="three-up-grid">
          {writingEntries.map((entry) => (
            <WritingCard
              key={entry.slug}
              title={entry.title}
              date={entry.date}
              summary={entry.summary}
              tags={entry.tags}
              href={entry.href}
              cta={text.common.openPdf}
              tagsLabel={text.common.tags}
            />
          ))}
        </div>
      </Reveal>
    </div>
  );
}
