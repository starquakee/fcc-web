import { Reveal } from "../components/ui/Reveal";
import { socialLinksByLocale } from "../content/links";
import { profilesByLocale } from "../content/profile";
import { siteText } from "../content/siteText";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useLanguage } from "../i18n";

export function CvPage() {
  const { locale } = useLanguage();
  const text = siteText[locale];
  const profile = profilesByLocale[locale];
  const socialLinks = socialLinksByLocale[locale];
  const experienceEntries = profile.timeline.filter((entry) => entry.category === "experience");
  const educationEntries = profile.timeline.filter((entry) => entry.category === "education");

  useDocumentMeta(
    locale === "zh" ? "简历 | 冯晨晨" : "CV | Chenchen Feng",
    locale === "zh" ? "冯晨晨的教育背景、经历和 PDF 简历下载。" : "Experience, education, and CV download for Chenchen Feng.",
  );

    return (
    <div className="page-stack">
      <Reveal className="page-hero page-hero--cv">
        <div className="page-hero__header">
          <h1>{text.cv.title}</h1>
          <div className="hero__actions">
            <a className="button button--primary" href="/docs/resume.pdf" target="_blank" rel="noreferrer">
              {text.cv.download}
            </a>
          </div>
        </div>
      </Reveal>

      <Reveal className="section-block note-grid" delay={80}>
        <article className="note-card">
          <span className="eyebrow">{text.common.overview}</span>
          <h2>{profile.shortRole}</h2>
          <p>{profile.description}</p>
        </article>
        <article className="note-card">
          <span className="eyebrow">{text.common.contact}</span>
          <h2>{profile.email}</h2>
          <div className="list-links">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </article>
      </Reveal>

      <Reveal className="section-block" delay={120}>
        <div className="timeline">
          <section className="timeline-group">
            <div className="timeline-group__title">{text.common.experience}</div>
            {experienceEntries.map((entry) => (
              <article key={`${entry.period}-${entry.title}`} className="timeline-card">
                <div className="timeline-card__period">{entry.period}</div>
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
                <div className="timeline-card__period">{entry.period}</div>
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

      <Reveal className="section-block" delay={160}>
        <div className="pdf-frame">
          <iframe title="Chenchen Feng CV PDF" src="/docs/resume.pdf" />
        </div>
      </Reveal>
    </div>
  );
}
