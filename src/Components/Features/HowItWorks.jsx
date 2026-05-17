import React from "react";
import { Bell, Clock3, Plus } from "lucide-react";
import { useUISettings } from "../../context/UIContext";

const icons = [Plus, Clock3, Bell];

function HowItWorks() {
  const { t } = useUISettings();
  const steps = t("featuresPage.how.steps");

  return (
    <section className="section-shell" style={{ backgroundColor: "var(--bg-soft)" }}>
      <div className="section-inner max-w-5xl">
        <div className="text-center">
          <span className="eyebrow">{t("featuresPage.how.title")}</span>
          <h2 className="mt-5 text-3xl font-extrabold md:text-5xl" style={{ color: "var(--text)" }}>
            {t("featuresPage.how.title")}
          </h2>
          <p className="mt-5 text-base leading-8 md:text-lg" style={{ color: "var(--text-muted)" }}>
            {t("featuresPage.how.subtitle")}
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = icons[index];
            return (
              <article key={step.title} className="surface-card rounded-[1.7rem] p-6">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: "var(--primary-soft)", color: "var(--primary)" }}
                >
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 text-xl font-bold" style={{ color: "var(--text)" }}>
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 md:text-base" style={{ color: "var(--text-muted)" }}>
                  {step.desc}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
