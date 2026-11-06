import { Reveal } from "../components/ui/Reveal";
import { TimelineSection } from "../components/ui/TimelineSection";
import { profilesByLocale } from "../content/profile";
import { siteText } from "../content/siteText";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useLanguage } from "../i18n";

export function CvPage() {
  const { locale } = useLanguage();
  const text = siteText[locale];
  const profile = profilesByLocale[locale];

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
