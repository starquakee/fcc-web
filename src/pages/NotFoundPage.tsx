import { Link } from "react-router-dom";
import { siteText } from "../content/siteText";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useLanguage } from "../i18n";

export function NotFoundPage() {
  const { locale } = useLanguage();
  const text = siteText[locale];

  useDocumentMeta(
    locale === "zh" ? "页面未找到 | 冯晨晨" : "Page Not Found | Chenchen Feng",
    locale === "zh" ? "请求的页面不存在。" : "The requested page could not be found.",
  );

  return (
    <section className="page-hero page-hero--compact">
      <span className="eyebrow">404</span>
      <h1>{text.notFound.title}</h1>
      <p>{text.notFound.body}</p>
      <div className="hero__actions">
        <Link to="/" className="button button--primary">
          {text.notFound.cta}
        </Link>
      </div>
    </section>
  );
}
