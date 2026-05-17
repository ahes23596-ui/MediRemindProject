import React from "react";
import { Link } from "react-router-dom";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";
import { useUISettings } from "../../context/UIContext";

function Footer() {
  const { t } = useUISettings();

  const quickLinks = [
    { label: t("footer.links.home"), to: "/" },
    { label: t("footer.links.features"), to: "/features" },
    { label: t("footer.links.about"), to: "/aboutus" },
  ];

  const projectLinks = [
    { label: t("footer.links.login"), to: "/login" },
    { label: t("footer.links.signup"), to: "/signup" },
    { label: t("footer.links.dashboard"), to: "/dashboard" },
  ];

  const socialLinks = [
    { href: "https://github.com", label: "GitHub", icon: Github },
    { href: "https://linkedin.com", label: "LinkedIn", icon: Linkedin },
    { href: "https://instagram.com", label: "Instagram", icon: Instagram },
    { href: "mailto:support@mediremind.app", label: "Email", icon: Mail },
  ];

  return (
    <footer className="section-shell app-shell border-t" style={{ borderColor: "var(--border)" }}>
      <div className="section-inner">
        <div className="surface-card rounded-[2rem] p-6 md:p-8" style={{ backgroundColor: "var(--surface-strong)" }}>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.9fr]">
            <div className="max-w-md">
              <p className="text-2xl font-extrabold" style={{ color: "var(--text)" }}>
                {t("brand.name")}
              </p>
              <p className="mt-4 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                {t("footer.description")}
              </p>
              <p className="mt-4 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                {t("brand.shortDescription")}
              </p>
            </div>

            <FooterLinks title={t("footer.quickLinks")} links={quickLinks} />
            <FooterLinks title={t("footer.product")} links={projectLinks} />

            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-[0.2em]" style={{ color: "var(--text)" }}>
                {t("footer.contact")}
              </h3>
              <div className="mt-4 space-y-3 text-sm" style={{ color: "var(--text-muted)" }}>
                <p>{t("footer.email")}</p>
                <p>{t("footer.phone")}</p>
                <p>{t("footer.location")}</p>
              </div>
              <h3 className="mt-6 text-sm font-extrabold uppercase tracking-[0.2em]" style={{ color: "var(--text)" }}>
                {t("footer.connect")}
              </h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "var(--surface-muted)",
                      color: "var(--text)",
                    }}
                  >
                    {React.createElement(Icon, { size: 18 })}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div
            className="mt-8 flex flex-col gap-3 border-t pt-6 text-sm md:flex-row md:items-center md:justify-between"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            <p>
              © {new Date().getFullYear()} {t("brand.name")}. {t("footer.copyright")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/features" className="hover:opacity-80">
                {t("footer.links.features")}
              </Link>
              <Link to="/aboutus" className="hover:opacity-80">
                {t("footer.links.about")}
              </Link>
              <Link to="/login" className="hover:opacity-80">
                {t("footer.links.login")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-extrabold uppercase tracking-[0.2em]" style={{ color: "var(--text)" }}>
        {title}
      </h3>
      <div className="mt-4 flex flex-col gap-3 text-sm" style={{ color: "var(--text-muted)" }}>
        {links.map((link) => (
          <Link key={link.to} to={link.to} className="hover:opacity-80">
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Footer;
