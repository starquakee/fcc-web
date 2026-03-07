import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { profilesByLocale } from "../../content/profile";
import { siteText } from "../../content/siteText";
import { useVisitCounter } from "../../hooks/useVisitCounter";
import { useLanguage } from "../../i18n";
import styles from "./SiteShell.module.scss";

export function SiteShell() {
  const location = useLocation();
  const { locale, setLocale } = useLanguage();
  const text = siteText[locale];
  const profile = profilesByLocale[locale];
  const { count, hasError, isLocalPreview } = useVisitCounter();
  const primaryLinks = [
    { to: "/", label: text.nav.home, end: true },
    { to: "/publications", label: text.nav.publications },
    { to: "/projects", label: text.nav.projects },
    { to: "/writing", label: text.nav.writing },
    { to: "/cv", label: text.nav.cv },
  ] as const;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  const visitCountText =
    count !== null
      ? `${text.footer.visits}: ${new Intl.NumberFormat(locale === "zh" ? "zh-CN" : "en-US").format(count)}`
      : isLocalPreview
        ? text.footer.visitsPreview
        : hasError
          ? text.footer.visitsUnavailable
          : `${text.footer.visits}: ...`;

  return (
    <div className={styles.shell}>
      <a href="#main-content" className={styles.skip}>
        {text.skipToContent}
      </a>
      <div className={styles.headerWrap}>
        <header className={styles.header}>
          <Link to="/" className={styles.brand} aria-label={text.nav.home}>
            <span className={styles.brandTitle}>{profile.name}</span>
          </Link>
          <div className={styles.headerActions}>
            <nav className={styles.nav} aria-label="Primary">
              {primaryLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={"end" in link ? link.end : undefined}
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`.trim()
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink
                to="/memory"
                className={({ isActive }) =>
                  `${styles.navLink} ${styles.memoryLink} ${isActive ? styles.navLinkActive : ""}`.trim()
                }
              >
                {text.nav.memory}
              </NavLink>
            </nav>
            <div className={styles.localeSwitch} role="group" aria-label={text.languageSwitchLabel}>
              <button
                type="button"
                className={`${styles.localeButton} ${locale === "en" ? styles.localeButtonActive : ""}`.trim()}
                onClick={() => setLocale("en")}
              >
                EN
              </button>
              <button
                type="button"
                className={`${styles.localeButton} ${locale === "zh" ? styles.localeButtonActive : ""}`.trim()}
                onClick={() => setLocale("zh")}
              >
                中文
              </button>
            </div>
          </div>
        </header>
      </div>
      <main id="main-content" className={styles.main}>
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerTitle}>{text.footer.title}</div>
        <p>{text.footer.description}</p>
        <div className={styles.footerCounter} aria-live="polite">
          {visitCountText}
        </div>
        <div className={styles.footerLinks}>
          <a href="mailto:chenchenfengcn@gmail.com">{text.footer.email}</a>
          <a href="https://github.com/starquakee" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://orcid.org/0009-0000-1072-8183" target="_blank" rel="noreferrer">
            ORCID
          </a>
          <a href="https://bangumi.tv/user/846860" target="_blank" rel="noreferrer">
            Bangumi
          </a>
        </div>
      </footer>
    </div>
  );
}
