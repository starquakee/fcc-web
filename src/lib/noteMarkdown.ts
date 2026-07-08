export type NoteInlineSegment =
  | {
      type: "text";
      text: string;
    }
  | {
      type: "emphasis";
      text: string;
    };

export type NoteMarkdownBlock =
  | {
      type: "paragraph";
      content: NoteInlineSegment[];
    }
  | {
      type: "heading";
      level: 2;
      text: string;
    }
  | {
      type: "image";
      alt: string;
      src: string;
    }
  | {
      type: "divider";
    };

type ParseNoteMarkdownOptions = {
  assetBasePath?: string;
};

const absolutePathPattern = /^(?:[a-z][a-z0-9+.-]*:|\/|#)/i;

function stripFrontMatter(markdown: string) {
  return markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
}

function trimSlashes(path: string) {
  return path.replace(/\/+$/, "");
}

function splitPathSuffix(path: string) {
  const suffixMatch = /([?#].*)$/.exec(path);
  const suffix = suffixMatch?.[1] ?? "";

  return {
    pathname: suffix ? path.slice(0, -suffix.length) : path,
    suffix,
  };
}

export function resolveNoteAsset(path: string, assetBasePath?: string) {
  const rawPath = path.trim();

  if (!assetBasePath || absolutePathPattern.test(rawPath)) {
    return rawPath;
  }

  const basePath = trimSlashes(assetBasePath);
  const { pathname, suffix } = splitPathSuffix(rawPath);
  const relativePath = pathname.startsWith("../")
    ? (pathname.split("/").pop() ?? pathname)
    : pathname.replace(/^\.\//, "");

  return `${basePath}/${relativePath.replace(/^\/+/, "")}${suffix}`;
}

function parseInline(text: string): NoteInlineSegment[] {
  const parts = text.split(/(\*[^*]+\*)/g);

  return parts
    .filter(Boolean)
    .map((part) =>
      part.startsWith("*") && part.endsWith("*") && part.length > 2
        ? { type: "emphasis", text: part.slice(1, -1) }
        : { type: "text", text: part },
    );
}

export function parseNoteMarkdown(markdown: string, options: ParseNoteMarkdownOptions = {}) {
  const lines = stripFrontMatter(markdown).split(/\r?\n/);
  const blocks: NoteMarkdownBlock[] = [];
  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    const text = paragraphBuffer.join(" ").trim();

    if (text) {
      blocks.push({ type: "paragraph", content: parseInline(text) });
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
      blocks.push({ type: "divider" });
      return;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      blocks.push({ type: "heading", level: 2, text: trimmed.slice(4) });
      return;
    }

    const imageMatch = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(trimmed);

    if (imageMatch) {
      flushParagraph();
      blocks.push({
        type: "image",
        alt: imageMatch[1] || "Note illustration",
        src: resolveNoteAsset(imageMatch[2], options.assetBasePath),
      });
      return;
    }

    paragraphBuffer.push(trimmed);
  });

  flushParagraph();

  return blocks;
}
