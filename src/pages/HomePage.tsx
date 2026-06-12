import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { WorkCard } from "../components/cards/WorkCard";
import { Reveal } from "../components/ui/Reveal";
import { TimelineSection } from "../components/ui/TimelineSection";
import { socialLinksByLocale } from "../content/links";
import { profilesByLocale } from "../content/profile";
import { projectsByLocale } from "../content/projects";
import { publicationsByLocale } from "../content/publications";
import { siteText } from "../content/siteText";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useLanguage } from "../i18n";

function formatIndex(value: number) {
  return String(value).padStart(2, "0");
}

export function HomePage() {
  const { locale } = useLanguage();
  const text = siteText[locale];
  const profile = profilesByLocale[locale];
  const socialLinks = socialLinksByLocale[locale];
  const publications = publicationsByLocale[locale];
  const projects = projectsByLocale[locale];
  const selectedProjects = projects.slice(0, 2);

  useDocumentMeta(locale === "zh" ? "冯晨晨" : "Chenchen Feng", profile.seoDescription);

  const heroFacts = [
    {
      label: locale === "zh" ? "所属机构" : "Institution",
      value: profile.institution,
    },
    {
      label: locale === "zh" ? "当前状态" : "Currently",
      value: profile.availability,
    },
    {
      label: locale === "zh" ? "联系方式" : "Contact",
      value: profile.email,
    },
  ];

  return (
    <div className="page-stack">
      <header className="hero">
        <Reveal variant="fade" className="hero__topline">
          <span className="eyebrow">{text.home.eyebrow}</span>
          <span className="mono-label">{profile.location}</span>
        </Reveal>
        <h1 className="hero__title">
          {profile.heroTitle.split("\n").map((line, i) => (
            <span key={i} className="line-mask">
              <span className="line" style={{ "--line-i": i } as CSSProperties}>
                {line}
              </span>
            </span>
          ))}
        </h1>
        <Reveal delay={250} className="hero__grid">
          <div>
            <p className="hero__lede">{profile.description}</p>
            <div className="hero__actions">
              <Link to="/projects" className="button button--primary">
                {text.home.ctaPrimary}
              </Link>
              <Link to="/cv" className="button button--ghost">
                {text.home.ctaSecondary}
              </Link>
            </div>
          </div>
          <dl className="hero-facts">
            {heroFacts.map((fact) => (
              <div key={fact.label} className="hero-facts__row">
                <dt className="mono-label">{fact.label}</dt>
                <dd className="hero-facts__value">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <figure className="hero__portrait">
            <img
              src={profile.portrait}
              alt={locale === "zh" ? "冯晨晨头像" : "Portrait of Chenchen Feng"}
            />
          </figure>
        </Reveal>
        <Reveal delay={400} stagger={90} className="stats-strip">
          {profile.heroStats.map((item) => (
            <div key={item.label} className="stats-strip__cell">
              <span className="stats-strip__value">{item.value}</span>
              <span className="stats-strip__label">{item.label}</span>
            </div>
          ))}
        </Reveal>
      </header>

      <section>
        <Reveal className="section-header">
          <span className="section-header__index">01</span>
          <h2 className="section-header__title">{text.home.selectedWorkTitle}</h2>
          <span className="section-header__meta">
            {formatIndex(publications.length + selectedProjects.length)}
          </span>
        </Reveal>
        <Reveal stagger={90} className="work-index">
          {publications.map((publication, i) => (
            <WorkCard
              key={publication.slug}
              index={formatIndex(i + 1)}
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
          {selectedProjects.map((project, i) => (
            <WorkCard
              key={project.slug}
              index={formatIndex(publications.length + i + 1)}
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
        </Reveal>
      </section>

      <section>
        <Reveal className="section-header">
          <span className="section-header__index">02</span>
          <h2 className="section-header__title">{text.home.focusTitle}</h2>
        </Reveal>
        <Reveal stagger={110} className="focus-grid">
          {profile.focusAreas.map((area) => (
            <article key={area.title} className="focus-col">
              <h3>{area.title}</h3>
              <p>{area.description}</p>
              <ul>
                {area.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </Reveal>
      </section>

      <section>
        <Reveal className="section-header">
          <span className="section-header__index">03</span>
          <h2 className="section-header__title">{text.home.timelineTitle}</h2>
        </Reveal>
        <Reveal>
          <TimelineSection
            entries={profile.timeline}
            experienceLabel={text.common.experience}
            educationLabel={text.common.education}
          />
        </Reveal>
      </section>

      <section>
        <Reveal className="section-header">
          <span className="section-header__index">04</span>
          <h2 className="section-header__title">{text.home.contactTitle}</h2>
        </Reveal>
        <Reveal stagger={90} className="contact-list">
          {socialLinks.map((link) => (
            <a key={link.label} href={link.href} className="contact-row" target="_blank" rel="noreferrer">
              <strong>{link.label}</strong>
              <span>{link.note}</span>
              <span className="contact-row__arrow" aria-hidden="true">
                →
              </span>
            </a>
          ))}
        </Reveal>
      </section>
    </div>
  );
}
