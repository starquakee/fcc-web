import { WorkCard } from "../components/cards/WorkCard";
import { Reveal } from "../components/ui/Reveal";
import { profilesByLocale } from "../content/profile";
import { publicationsByLocale } from "../content/publications";
import { siteText } from "../content/siteText";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useLanguage } from "../i18n";

export function PublicationsPage() {
  const { locale } = useLanguage();
  const text = siteText[locale];
  const profile = profilesByLocale[locale];
  const publications = publicationsByLocale[locale];

  useDocumentMeta(
    locale === "zh" ? "论文 | 冯晨晨" : "Publications | Chenchen Feng",
    locale === "zh" ? "冯晨晨的论文与研究成果。" : "Journal publications and research output by Chenchen Feng.",
  );

  return (
    <div className="page-stack">
      <Reveal className="page-hero">
        <h1>{text.publications.title}</h1>
        <p>{text.publications.body}</p>
      </Reveal>

      <Reveal className="section-block" delay={80}>
        <div className="bento-grid">
          {publications.map((publication) => (
            <WorkCard
              key={publication.slug}
              eyebrow={text.common.journal}
              title={publication.title}
              subtitle={publication.venue}
              summary={publication.abstract}
              tags={publication.tags}
              meta={publication.year}
              tagsLabel={text.common.tags}
              links={[
                { label: text.common.readPaper, href: publication.pdfUrl },
                ...(publication.codeUrl ? [{ label: text.common.viewCode, href: publication.codeUrl }] : []),
              ]}
            />
          ))}
        </div>
      </Reveal>

      <Reveal className="section-block note-grid" delay={120}>
        <article className="note-card">
          <span className="eyebrow">{text.common.currentPositioning}</span>
          <h2>{profile.shortRole}</h2>
          <p>{profile.extendedBio}</p>
        </article>
        <article className="note-card">
          <span className="eyebrow">{text.common.researchIdentity}</span>
          <h2>{text.publications.noteTitle}</h2>
          <p>{text.publications.noteHeading}</p>
        </article>
      </Reveal>
    </div>
  );
}
