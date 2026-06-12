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
    <section className="page-stack">
      <div className="notfound">
        <span className="eyebrow">404</span>
        <h1 className="notfound__title">{text.notFound.title}</h1>
        <p className="notfound__body">{text.notFound.body}</p>
        <Link to="/" className="button button--primary">
          {text.notFound.cta}
        </Link>
      </div>
    </section>
  );
}
