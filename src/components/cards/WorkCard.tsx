import styles from "./WorkCard.module.scss";

type WorkCardProps = {
  index?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  summary: string;
  tags: string[];
  meta: string;
  tagsLabel?: string;
  links?: Array<{ label: string; href: string }>;
};

export function WorkCard({
  index,
  eyebrow,
  title,
  subtitle,
  summary,
  tags,
  meta,
  tagsLabel = "Tags",
  links = [],
}: WorkCardProps) {
  return (
    <article className={styles.row}>
      <div className={styles.marker}>
        {index ? <span className={styles.index}>{index}</span> : null}
        <span className={styles.meta}>{eyebrow}</span>
        <span className={styles.meta}>{meta}</span>
      </div>
      <div className={styles.heading}>
        <h3 className={styles.title}>{title}</h3>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
      <div className={styles.detail}>
        <p className={styles.summary}>{summary}</p>
        <p className={styles.tags} aria-label={tagsLabel}>
          {tags.join(" · ")}
        </p>
      </div>
      {links.length > 0 ? (
        <div className={styles.links}>
          {links.map((link) => (
            <a
              key={link.href}
              className="arrow-link"
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}
