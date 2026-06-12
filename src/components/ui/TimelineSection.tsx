import type { TimelineEntry } from "../../types/content";

type TimelineSectionProps = {
  entries: TimelineEntry[];
  experienceLabel: string;
  educationLabel: string;
};

export function TimelineSection({ entries, experienceLabel, educationLabel }: TimelineSectionProps) {
  const groups = [
    { label: experienceLabel, items: entries.filter((entry) => entry.category === "experience") },
    { label: educationLabel, items: entries.filter((entry) => entry.category === "education") },
  ];

  return (
    <div className="timeline">
      {groups.map((group) => (
        <section key={group.label} className="timeline-group">
          <span className="timeline-group__title">{group.label}</span>
          {group.items.map((entry) => (
            <article key={`${entry.period}-${entry.title}`} className="timeline-row">
              <div className="timeline-row__period">{entry.period}</div>
              <div>
                {entry.logoSrc ? (
                  <img
                    src={entry.logoSrc}
                    alt={entry.logoAlt ?? entry.subtitle}
                    className="timeline-row__logo"
                  />
                ) : null}
              </div>
              <div className="timeline-row__body">
                <h3>{entry.title}</h3>
                <p className="timeline-row__subtitle">{entry.subtitle}</p>
                {entry.body.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </article>
          ))}
        </section>
      ))}
    </div>
  );
}
