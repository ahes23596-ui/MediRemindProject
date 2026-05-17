import React from "react";
import { Link } from "react-router-dom";
import { useUISettings } from "../../context/UIContext";

export default function CTASection() {
  const { t } = useUISettings();

  return (
    <section className="section-shell">
      <div className="section-inner">
        <div
          className="rounded-[2rem] p-8 text-center md:p-12"
          style={{
            background: "linear-gradient(135deg, rgba(37, 99, 235, 0.14) 0%, rgba(37, 99, 235, 0.04) 100%)",
            border: "1px solid var(--border)",
          }}
        >
          <span className="eyebrow">{t("common.getStarted")}</span>
          <h2 className="mt-5 text-3xl font-extrabold md:text-5xl" style={{ color: "var(--text)" }}>
            {t("featuresPage.cta.title")}
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 md:text-lg" style={{ color: "var(--text-muted)" }}>
            {t("featuresPage.cta.description")}
          </p>
          <Link to="/signup" className="btn-primary mt-8">
            {t("common.getStartedFree")}
          </Link>
          <p className="mt-4 text-sm" style={{ color: "var(--text-muted)" }}>
            {t("featuresPage.cta.note")}
          </p>
        </div>
      </div>
    </section>
  );
}
