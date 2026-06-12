import { createElement, useEffect, useRef, useState } from "react";
import type { CSSProperties, PropsWithChildren } from "react";

type RevealProps = PropsWithChildren<{
  className?: string;
  delay?: number;
  variant?: "rise" | "fade" | "stagger";
  stagger?: number;
  as?: "div" | "section" | "article" | "header" | "footer" | "ul" | "ol";
}>;

export function Reveal({
  children,
  className = "",
  delay = 0,
  variant = "rise",
  stagger,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      // threshold 0 + small bottom inset: fires as soon as the element's top
      // enters the viewport, regardless of element height (a ratio threshold
      // never fires for elements much taller than the viewport).
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const resolvedVariant = stagger !== undefined ? "stagger" : variant;
  const variantClass = resolvedVariant === "rise" ? "" : `reveal--${resolvedVariant}`;
  const style: CSSProperties = {
    // For stagger reveals the wrapper has `transition: none`, so the delay is
    // handed to the children via --reveal-delay instead of transitionDelay.
    ...(delay && resolvedVariant !== "stagger" ? { transitionDelay: `${delay}ms` } : {}),
    ...(stagger !== undefined
      ? {
          "--reveal-stagger": `${stagger}ms`,
          ...(delay ? { "--reveal-delay": `${delay}ms` } : {}),
        }
      : {}),
  };

  return createElement(
    as,
    {
      ref,
      className: `reveal ${variantClass} ${visible ? "is-visible" : ""} ${className}`
        .replace(/\s+/g, " ")
        .trim(),
      style,
    },
    children,
  );
}
