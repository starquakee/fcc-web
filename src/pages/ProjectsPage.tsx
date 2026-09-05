import { WorkCard } from "../components/cards/WorkCard";
import { Reveal } from "../components/ui/Reveal";
import { projectsByLocale } from "../content/projects";
import { siteText } from "../content/siteText";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useLanguage } from "../i18n";

function formatIndex(value: number) {
  return String(value).padStart(2, "0");
}

export function ProjectsPage() {
  const { locale } = useLanguage();
  const text = siteText[locale];
  const projects = projectsByLocale[locale];

  useDocumentMeta({ route: "projects" });

  return (
    <div className="page-stack">
      <Reveal as="header" className="page-header">
        <h1>{text.projects.title}</h1>
        <p className="page-header__lede">{text.projects.body}</p>
      </Reveal>

      <Reveal stagger={90} className="work-index">
        {projects.map((project, i) => (
          <WorkCard
            key={project.slug}
            index={formatIndex(i + 1)}
            title={project.title}
            subtitle={project.subtitle}
            summary={`${project.summary} ${project.impact}`}
            tags={project.stack}
            meta={text.common.implementation}
            tagsLabel={text.common.tags}
            links={project.links}
          />
        ))}
      </Reveal>
    </div>
  );
}
