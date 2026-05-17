import React from "react";
import { useUISettings } from "../../context/UIContext";

function Works() {
  const { t } = useUISettings();
  const steps = t("home.works.steps");

  return (
    <section id="works" className="section-shell" style={{ backgroundColor: "var(--bg-soft)" }}>
      <div className="section-inner">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">{t("home.works.title")}</span>
          <h2 className="mt-5 text-3xl font-extrabold md:text-5xl" style={{ color: "var(--text)" }}>
            {t("home.works.title")}
          </h2>
          <p className="mt-5 text-base leading-8 md:text-lg" style={{ color: "var(--text-muted)" }}>
            {t("home.works.subtitle")}
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="surface-card rounded-[1.7rem] p-6">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-extrabold text-white"
                style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-strong))" }}
              >
                {index + 1}
              </div>
              <h3 className="mt-5 text-xl font-bold" style={{ color: "var(--text)" }}>
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Works;
