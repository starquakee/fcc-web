import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Reveal } from "../components/ui/Reveal";
import { memoryDetailsByLocale } from "../content/memoryDetails";
import { siteText } from "../content/siteText";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useLanguage } from "../i18n";
import { parseNoteMarkdown } from "../lib/noteMarkdown";
import type { NoteInlineSegment, NoteMarkdownBlock } from "../lib/noteMarkdown";
import { NotFoundPage } from "./NotFoundPage";

function renderInline(content: NoteInlineSegment[]) {
  return content.map((part, index) =>
    part.type === "emphasis" ? <em key={`emphasis-${index}`}>{part.text}</em> : part.text,
  );
}

function renderNoteBlock(block: NoteMarkdownBlock, index: number) {
  switch (block.type) {
    case "heading":
      return <h2 key={`heading-${index}`}>{block.text}</h2>;
    case "paragraph":
      return <p key={`paragraph-${index}`}>{renderInline(block.content)}</p>;
    case "image":
      return (
        <figure key={`image-${index}`} className="note-article__figure">
          <img src={block.src} alt={block.alt} loading="lazy" decoding="async" />
        </figure>
      );
    case "divider":
      return <hr key={`divider-${index}`} />;
  }
}

export function MemoryDetailPage() {
  const { slug } = useParams();
  const { locale } = useLanguage();
  const text = siteText[locale];
  const detail = memoryDetailsByLocale[locale].find((entry) => entry.slug === slug);
  const [content, setContent] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  useDocumentMeta({
    title: detail
      ? locale === "zh"
        ? `${detail.title} | 冯晨晨`
        : `${detail.title} | Chenchen Feng`
      : locale === "zh"
        ? "小记 | 冯晨晨"
        : "Notes | Chenchen Feng",
    description:
      detail?.summary ??
      (locale === "zh"
        ? "一些更私人一些的文化小记、兴趣记录与长期参照。"
        : "A quieter set of notes on culture, media, and long-term personal references."),
    image: detail?.socialImage ?? detail?.image,
    type: detail ? "article" : "website",
  });

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
      <Reveal as="header" className="page-header">
        <Link to="/memory" className="arrow-link arrow-link--back">
          {text.memory.backToList}
        </Link>
        <div className={detail.image ? "note-detail__hero" : "note-detail__hero note-detail__hero--text-only"}>
          <div className="note-detail__copy">
            <span className="eyebrow">
              {detail.year} · {detail.tags.join(" · ")}
            </span>
            <h1>{detail.title}</h1>
            <p>{detail.summary}</p>
          </div>
          {detail.image ? (
            <img
              src={detail.image}
              alt={detail.title}
              className="note-detail__hero-image"
              loading="eager"
              decoding="async"
            />
          ) : null}
        </div>
      </Reveal>

      <Reveal delay={120}>
        <article className="note-article">
          {content
            ? parseNoteMarkdown(content, { assetBasePath: detail.assetBasePath }).map(renderNoteBlock)
            : null}
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
