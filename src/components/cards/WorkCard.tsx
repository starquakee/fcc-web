import styles from "./WorkCard.module.scss";

type WorkCardProps = {
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
    <article className={styles.card}>
      <div className={styles.meta}>
        <span>{eyebrow}</span>
        <span>{meta}</span>
      </div>
      <div>
        <h3 className={styles.title}>{title}</h3>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>
      <p className={styles.summary}>{summary}</p>
      <div className={styles.footer}>
        <div className={styles.chips} aria-label={tagsLabel}>
          {tags.map((tag) => (
            <span key={tag} className={styles.chip}>
              {tag}
            </span>
          ))}
        </div>
        {links.length > 0 ? (
          <div className={styles.links}>
            {links.map((link) => (
              <a
                key={link.href}
                className={styles.link}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}
