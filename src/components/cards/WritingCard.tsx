import styles from "./WritingCard.module.scss";

type WritingCardProps = {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  href: string;
  cta: string;
  tagsLabel?: string;
};

export function WritingCard({
  title,
  date,
  summary,
  tags,
  href,
  cta,
  tagsLabel = "Tags",
}: WritingCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.headline}>
        <span className={styles.date}>{date}</span>
        <h3 className={styles.title}>{title}</h3>
      </div>
      <p className={styles.summary}>{summary}</p>
      <div className={styles.tags} aria-label={tagsLabel}>
        {tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
      <a
        className={styles.link}
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
      >
        {cta}
      </a>
    </article>
  );
}
