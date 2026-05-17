import React from "react";
import { LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUISettings } from "../../context/UIContext";

function Contact() {
  const navigate = useNavigate();
  const { t } = useUISettings();

  const cards = [
    {
      title: t("home.contact.loginTitle"),
      text: t("home.contact.loginText"),
      action: t("home.contact.loginAction"),
      icon: LogIn,
      outlined: true,
      onClick: () => navigate("/login"),
    },
    {
      title: t("home.contact.signupTitle"),
      text: t("home.contact.signupText"),
      action: t("home.contact.signupAction"),
      icon: UserPlus,
      badge: t("home.contact.badge"),
      onClick: () => navigate("/signup"),
    },
  ];

  return (
    <section className="section-shell">
      <div className="section-inner">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Next step</span>
          <h2 className="mt-5 text-3xl font-extrabold md:text-5xl" style={{ color: "var(--text)" }}>
            {t("home.contact.title")}
          </h2>
          <p className="mt-5 text-base leading-8 md:text-lg" style={{ color: "var(--text-muted)" }}>
            {t("home.contact.description")}
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {cards.map(({ title, text, action, icon: Icon, badge, outlined, onClick }) => {
            const iconElement = React.createElement(Icon, { size: 24 });
            return (
              <article
                key={title}
                className="surface-card relative rounded-[1.8rem] p-6 md:p-8"
                style={{
                  borderColor: outlined ? "var(--border)" : "rgba(37, 99, 235, 0.28)",
                  backgroundColor: outlined ? "var(--surface-strong)" : "var(--surface)",
                }}
              >
                {badge && (
                  <span
                    className="absolute end-4 top-4 rounded-full px-3 py-1 text-xs font-bold text-white"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    {badge}
                  </span>
                )}
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{
                    backgroundColor: outlined ? "var(--primary-soft)" : "var(--primary)",
                    color: outlined ? "var(--primary)" : "#ffffff",
                  }}
                >
                  {iconElement}
                </div>
                <h3 className="mt-6 text-2xl font-bold" style={{ color: "var(--text)" }}>
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 md:text-base" style={{ color: "var(--text-muted)" }}>
                  {text}
                </p>
                <button type="button" onClick={onClick} className={`mt-6 w-full ${outlined ? "btn-secondary" : "btn-primary"}`}>
                  {action}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Contact;
