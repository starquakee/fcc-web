import { Link } from "react-router-dom";
import { Reveal } from "../components/ui/Reveal";
import { memoryEntriesByLocale } from "../content/memory";
import { memoryDetailsByLocale } from "../content/memoryDetails";
import { siteText } from "../content/siteText";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useLanguage } from "../i18n";

export function MemoryPage() {
  const { locale } = useLanguage();
  const text = siteText[locale];
  const memoryEntries = memoryEntriesByLocale[locale];
  const detailSlugs = new Set(memoryDetailsByLocale[locale].map((entry) => entry.slug));

  useDocumentMeta({
    title: locale === "zh" ? "小记 | 冯晨晨" : "Notes | Chenchen Feng",
    description:
      locale === "zh"
        ? "一些更私人一些的文化小记、兴趣记录与长期参照。"
        : "A quieter set of notes on culture, media, and long-term personal references.",
  });

  const renderEntryBody = (entry: (typeof memoryEntries)[number], linked: boolean, index: number) => (
    <article className="memory-entry">
      <div className="memory-entry__frame">
        <img
          src={entry.image}
          alt={entry.title}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
        />
      </div>
      <div className="memory-entry__body">
        <div className="memory-entry__meta">
          <span>{entry.year}</span>
          <span>{entry.tags.join(" · ")}</span>
        </div>
        <h2>{entry.title}</h2>
        <p>{entry.summary}</p>
        <p>{entry.reflection}</p>
        {linked ? <span className="arrow-link">{text.memory.readMore}</span> : null}
      </div>
    </article>
  );

  return (
    <div className="page-stack">
      <Reveal as="header" className="page-header">
        <span className="eyebrow">{text.memory.eyebrow}</span>
        <h1>{text.memory.title}</h1>
      </Reveal>

      <Reveal stagger={110} className="memory-list">
        {memoryEntries.map((entry, index) =>
          detailSlugs.has(entry.slug) ? (
            <Link key={entry.slug} to={`/memory/${entry.slug}`} className="memory-link">
              {renderEntryBody(entry, true, index)}
            </Link>
          ) : (
            <div key={entry.slug}>{renderEntryBody(entry, false, index)}</div>
          ),
        )}
      </Reveal>
    </div>
  );
}
