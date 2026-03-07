import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Reveal } from "../components/ui/Reveal";
import { memoryDetailsByLocale } from "../content/memoryDetails";
import { siteText } from "../content/siteText";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useLanguage } from "../i18n";
import { NotFoundPage } from "./NotFoundPage";

function resolveNoteImage(path: string) {
  const filename = path.split("/").pop();

  return filename ? `/media/notes/henpri/${filename}` : path;
}

function stripFrontMatter(markdown: string) {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}

function renderInline(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={`em-${index}`}>{part.slice(1, -1)}</em>;
    }

    return part;
  });
}

function renderNoteMarkdown(markdown: string) {
  const lines = stripFrontMatter(markdown).split(/\r?\n/);
  const nodes: ReactNode[] = [];
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    const text = paragraphBuffer.join(" ").trim();

    if (text) {
      nodes.push(
        <p key={`paragraph-${nodes.length}`}>
          {renderInline(text)}
        </p>,
      );
    }

    paragraphBuffer = [];
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      return;
    }

    if (trimmed.startsWith("[//]:")) {
      flushParagraph();
      return;
    }

    if (/^-{6,}$/.test(trimmed)) {
      flushParagraph();
      nodes.push(<hr key={`divider-${nodes.length}`} />);
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      nodes.push(<h2 key={`heading-${nodes.length}`}>{trimmed.slice(4)}</h2>);
      return;
    }

    const imageMatch = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(trimmed);

    if (imageMatch) {
      flushParagraph();
      nodes.push(
        <figure key={`image-${nodes.length}`} className="note-article__figure">
          <img src={resolveNoteImage(imageMatch[2])} alt={imageMatch[1] || "Note illustration"} />
        </figure>,
      );
      return;
    }

    paragraphBuffer.push(trimmed);
  });

  flushParagraph();

  return nodes;
}

export function MemoryDetailPage() {
  const { slug } = useParams();
  const { locale } = useLanguage();
  const text = siteText[locale];
  const detail = memoryDetailsByLocale[locale].find((entry) => entry.slug === slug);
  const [content, setContent] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  useDocumentMeta(
    detail
      ? locale === "zh"
        ? `${detail.title} | 冯晨晨`
        : `${detail.title} | Chenchen Feng`
      : locale === "zh"
        ? "小记 | 冯晨晨"
        : "Notes | Chenchen Feng",
    detail?.summary ??
      (locale === "zh"
        ? "一些更私人一些的文化小记、兴趣记录与长期参照。"
        : "A quieter set of notes on culture, media, and long-term personal references."),
  );

  useEffect(() => {
    if (!detail) {
      return;
    }

    const detailPath = detail.contentPath;
    const controller = new AbortController();

    async function loadContent() {
      try {
        setLoadError(false);
        setContent(null);

        const response = await fetch(detailPath, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Failed to load note content: ${response.status}`);
        }

        setContent(await response.text());
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setLoadError(true);
      }
    }

    void loadContent();

    return () => {
      controller.abort();
    };
  }, [detail]);

  if (!detail) {
    return <NotFoundPage />;
  }

  return (
    <div className="page-stack">
      <Reveal className="page-hero page-hero--memory">
        <Link to="/memory" className="text-link detail-back-link">
          {text.memory.backToList}
        </Link>
        <div className="note-detail__hero">
          <div className="note-detail__copy">
            <span className="eyebrow">{detail.year}</span>
            <h1>{detail.title}</h1>
            <p>{detail.summary}</p>
            <div className="memory-card__tags">
              {detail.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
          <img src={detail.image} alt={detail.title} className="note-detail__hero-image" />
        </div>
      </Reveal>

      <Reveal className="section-block" delay={80}>
        <article className="note-article">
          {content ? renderNoteMarkdown(content) : null}
          {!content && !loadError ? (
            <p>{locale === "zh" ? "正在加载原始小记内容..." : "Loading original note content..."}</p>
          ) : null}
          {loadError ? (
            <p>{locale === "zh" ? "原始小记内容加载失败。" : "Failed to load the original note content."}</p>
          ) : null}
        </article>
      </Reveal>
    </div>
  );
}
