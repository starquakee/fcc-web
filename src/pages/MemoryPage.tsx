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

  useDocumentMeta(
    locale === "zh" ? "小记 | 冯晨晨" : "Notes | Chenchen Feng",
    locale === "zh" ? "一些更私人一些的文化小记、兴趣记录与长期参照。" : "A quieter set of notes on culture, media, and long-term personal references.",
  );

  return (
    <div className="page-stack">
      <Reveal className="page-hero page-hero--memory">
        <h1>{text.memory.title}</h1>
      </Reveal>

      <Reveal className="memory-grid" delay={80}>
        {memoryEntries.map((entry) => (
          detailSlugs.has(entry.slug) ? (
            <Link key={entry.slug} to={`/memory/${entry.slug}`} className="memory-card-link">
              <article className="memory-card">
                <img src={entry.image} alt={entry.title} className="memory-card__image" />
                <div className="memory-card__body">
                  <div className="memory-card__meta">
                    <span>{entry.year}</span>
                    <div className="memory-card__tags">
                      {entry.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <h2>{entry.title}</h2>
                  <p>{entry.summary}</p>
                  <p>{entry.reflection}</p>
                  <span className="memory-card__cta">{text.memory.readMore}</span>
                </div>
              </article>
            </Link>
          ) : (
            <article key={entry.slug} className="memory-card">
              <img src={entry.image} alt={entry.title} className="memory-card__image" />
              <div className="memory-card__body">
                <div className="memory-card__meta">
                  <span>{entry.year}</span>
                  <div className="memory-card__tags">
                    {entry.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <h2>{entry.title}</h2>
                <p>{entry.summary}</p>
                <p>{entry.reflection}</p>
              </div>
            </article>
          )
        ))}
      </Reveal>
    </div>
  );
}
