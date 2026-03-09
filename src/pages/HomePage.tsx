import { Link } from "react-router-dom";
import { WorkCard } from "../components/cards/WorkCard";
import { WritingCard } from "../components/cards/WritingCard";
import { Reveal } from "../components/ui/Reveal";
import { socialLinksByLocale } from "../content/links";
import { profilesByLocale } from "../content/profile";
import { projectsByLocale } from "../content/projects";
import { publicationsByLocale } from "../content/publications";
import { siteText } from "../content/siteText";
import { writingEntriesByLocale } from "../content/writing";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useLanguage } from "../i18n";

export function HomePage() {
  const { locale } = useLanguage();
  const text = siteText[locale];
  const profile = profilesByLocale[locale];
  const socialLinks = socialLinksByLocale[locale];
  const publications = publicationsByLocale[locale];
  const projects = projectsByLocale[locale];
  const writingEntries = writingEntriesByLocale[locale];
  const experienceEntries = profile.timeline.filter((entry) => entry.category === "experience");
  const educationEntries = profile.timeline.filter((entry) => entry.category === "education");

  useDocumentMeta(
    locale === "zh" ? "冯晨晨" : "Chenchen Feng",
    profile.seoDescription,
  );

  return (
    <div className="page-stack">
      <Reveal className="hero hero--home">
        <div className="hero__copy">
          <span className="eyebrow">{text.home.eyebrow}</span>
          <h1 className="hero__title">{profile.heroTitle}</h1>
          <p className="hero__lede">{profile.description}</p>
          <div className="hero__actions">
            <Link to="/projects" className="button button--primary">
              {text.home.ctaPrimary}
            </Link>
            <Link to="/cv" className="button button--ghost">
              {text.home.ctaSecondary}
            </Link>
          </div>
          <div className="hero__meta">
            <span>{profile.location}</span>
            <span>{profile.institution}</span>
            <span>{profile.availability}</span>
          </div>
        </div>
        <div className="hero__aside">
          <div className="portrait-panel">
            <img
              src={profile.portrait}
              alt={locale === "zh" ? "冯晨晨头像" : "Portrait of Chenchen Feng"}
              className="portrait-panel__image"
            />
          </div>
          <div className="stat-grid">
            {profile.heroStats.map((item) => (
              <div key={item.label} className="stat-card">
                <span className="stat-card__value">{item.value}</span>
                <span className="stat-card__label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="section-block" delay={80}>
        <div className="section-heading">
          <div>
            <h2>{text.home.selectedWorkTitle}</h2>
          </div>
        </div>
        <div className="bento-grid">
          {publications.map((publication) => (
            <WorkCard
              key={publication.slug}
              eyebrow={text.common.publication}
              title={publication.title}
              subtitle={publication.venue}
              summary={publication.summary}
              tags={publication.tags}
              meta={publication.year}
              tagsLabel={text.common.tags}
              links={[
                { label: text.common.readPaper, href: publication.pdfUrl },
                ...(publication.codeUrl ? [{ label: text.common.code, href: publication.codeUrl }] : []),
              ]}
            />
          ))}
          {projects.slice(0, 2).map((project) => (
            <WorkCard
              key={project.slug}
              eyebrow={text.common.project}
              title={project.title}
              subtitle={project.subtitle}
              summary={project.summary}
              tags={project.stack}
              meta={text.common.built}
              tagsLabel={text.common.tags}
              links={project.links}
            />
          ))}
        </div>
      </Reveal>

      <Reveal className="section-block" delay={120}>
        <div className="section-heading">
          <div>
            <h2>{text.home.focusTitle}</h2>
          </div>
        </div>
        <div className="focus-grid">
          {profile.focusAreas.map((area) => (
            <article key={area.title} className="focus-card">
              <h3>{area.title}</h3>
              <p>{area.description}</p>
              <ul>
                {area.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Reveal>

      <Reveal className="section-block" delay={160}>
        <div className="section-heading">
          <div>
            <h2>{text.home.timelineTitle}</h2>
          </div>
        </div>
        <div className="timeline">
          <section className="timeline-group">
            <div className="timeline-group__title">{text.common.experience}</div>
            {experienceEntries.map((entry) => (
              <article key={`${entry.period}-${entry.title}`} className="timeline-card">
                <div className="timeline-card__period">
                  <span>{entry.period}</span>
                  {entry.logoSrc ? (
                    <img
                      src={entry.logoSrc}
                      alt={entry.logoAlt ?? entry.subtitle}
                      className="timeline-card__logo"
                    />
                  ) : null}
                </div>
                <div className="timeline-card__body">
                  <h3>{entry.title}</h3>
                  <p className="timeline-card__subtitle">{entry.subtitle}</p>
                  {entry.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </article>
            ))}
          </section>
          <section className="timeline-group">
            <div className="timeline-group__title">{text.common.education}</div>
            {educationEntries.map((entry) => (
              <article key={`${entry.period}-${entry.title}`} className="timeline-card">
                <div className="timeline-card__period">
                  <span>{entry.period}</span>
                  {entry.logoSrc ? (
                    <img
                      src={entry.logoSrc}
                      alt={entry.logoAlt ?? entry.subtitle}
                      className="timeline-card__logo"
                    />
                  ) : null}
                </div>
                <div className="timeline-card__body">
                  <h3>{entry.title}</h3>
                  <p className="timeline-card__subtitle">{entry.subtitle}</p>
                  {entry.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </article>
            ))}
          </section>
        </div>
      </Reveal>

      <Reveal className="section-block" delay={200}>
        <div className="section-heading">
          <div>
            <h2>{text.home.writingTitle}</h2>
          </div>
          <Link to="/writing" className="text-link">
            {text.common.browseAllWriting}
          </Link>
        </div>
        <div className="three-up-grid">
          {writingEntries.map((entry) => (
            <WritingCard
              key={entry.slug}
              title={entry.title}
              date={entry.date}
              summary={entry.summary}
              tags={entry.tags}
              href={entry.href}
              cta={text.common.openDocument}
              tagsLabel={text.common.tags}
            />
          ))}
        </div>
      </Reveal>

      <Reveal className="section-block contact-panel" delay={240}>
        <div className="section-heading">
          <div>
            <h2>{text.home.contactTitle}</h2>
          </div>
        </div>
        <div className="contact-grid">
          {socialLinks.map((link) => (
            <a key={link.label} href={link.href} className="contact-card" target="_blank" rel="noreferrer">
              <strong>{link.label}</strong>
              <span>{link.note}</span>
            </a>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
