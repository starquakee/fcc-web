import { WorkCard } from "../components/cards/WorkCard";
import { Reveal } from "../components/ui/Reveal";
import { projectsByLocale } from "../content/projects";
import { siteText } from "../content/siteText";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useLanguage } from "../i18n";

export function ProjectsPage() {
  const { locale } = useLanguage();
  const text = siteText[locale];
  const projects = projectsByLocale[locale];

  useDocumentMeta(
    locale === "zh" ? "项目 | 冯晨晨" : "Projects | Chenchen Feng",
    locale === "zh" ? "冯晨晨的系统与工程项目。" : "Selected systems and engineering projects by Chenchen Feng.",
  );

  return (
    <div className="page-stack">
      <Reveal className="page-hero">
        <h1>{text.projects.title}</h1>
        <p>{text.projects.body}</p>
      </Reveal>

      <Reveal className="section-block" delay={80}>
        <div className="bento-grid">
          {projects.map((project) => (
            <WorkCard
              key={project.slug}
              eyebrow={text.common.project}
              title={project.title}
              subtitle={project.subtitle}
              summary={`${project.summary} ${project.impact}`}
              tags={project.stack}
              meta={text.common.implementation}
              tagsLabel={text.common.tags}
              links={project.links}
            />
          ))}
        </div>
      </Reveal>
    </div>
  );
}
