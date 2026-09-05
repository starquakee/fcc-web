import { Link } from "react-router-dom";
import { siteText } from "../content/siteText";
import { useDocumentMeta } from "../hooks/useDocumentMeta";
import { useLanguage } from "../i18n";
import { getRoutePath } from "../routeManifest";

export function NotFoundPage() {
  const { locale } = useLanguage();
  const text = siteText[locale];

  useDocumentMeta({ route: "notFound" });

  return (
    <section className="page-stack">
      <div className="notfound">
        <span className="eyebrow">404</span>
        <h1 className="notfound__title">{text.notFound.title}</h1>
        <p className="notfound__body">{text.notFound.body}</p>
        <Link to={getRoutePath("home")} className="button button--primary">
          {text.notFound.cta}
        </Link>
      </div>
    </section>
  );
}
