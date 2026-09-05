import { Reveal } from "../components/ui/Reveal";
import { TimelineSection } from "../components/ui/TimelineSection";
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

  useDocumentMeta({ route: "cv" });

  return (
    <div className="page-stack">
      <Reveal as="header" className="page-header">
        <div className="page-header__row">
          <div>
            <h1>{text.cv.title}</h1>
          </div>
          <a className="button button--primary" href="/docs/resume.pdf" target="_blank" rel="noreferrer">
            {text.cv.download}
          </a>
        </div>
      </Reveal>

      <Reveal className="note-duo">
        <article>
          <span className="eyebrow">{text.common.overview}</span>
          <h2>{profile.shortRole}</h2>
          <p>{profile.description}</p>
        </article>
        <article>
          <span className="eyebrow">{text.common.contact}</span>
          <h2>{profile.email}</h2>
          <div className="list-links">
            {socialLinks.map((link) => (
              <a key={link.label} href={link.href} className="arrow-link" target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        </article>
      </Reveal>

      <Reveal>
        <TimelineSection
          entries={profile.timeline}
          experienceLabel={text.common.experience}
          educationLabel={text.common.education}
        />
      </Reveal>

      <Reveal>
        <div className="pdf-frame">
          <iframe title="Chenchen Feng CV PDF" src="/docs/resume.pdf" />
        </div>
      </Reveal>
    </div>
  );
}
