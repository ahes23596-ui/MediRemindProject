import React from "react";
import { BarChart3, CalendarCheck, FileText, Pill } from "lucide-react";
import { useUISettings } from "../../context/UIContext";

const icons = [Pill, CalendarCheck, FileText, BarChart3];

export default function FeaturesOverview() {
  const { t } = useUISettings();
  const items = t("featuresPage.overview.items");

  return (
    <section className="section-shell">
      <div className="section-inner">
        <div className="max-w-3xl">
          <span className="eyebrow">{t("featuresPage.overview.eyebrow")}</span>
          <h2 className="mt-5 text-3xl font-extrabold md:text-5xl" style={{ color: "var(--text)" }}>
            {t("featuresPage.overview.title")}
          </h2>
          <p className="mt-5 text-base leading-8 md:text-lg" style={{ color: "var(--text-muted)" }}>
            {t("featuresPage.overview.description")}
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {items.map((feature, index) => {
            const Icon = icons[index];
            return (
              <article key={feature.title} className="surface-card rounded-[1.8rem] p-6">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: "var(--primary-soft)", color: "var(--primary)" }}
                >
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-xl font-bold" style={{ color: "var(--text)" }}>
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 md:text-base" style={{ color: "var(--text-muted)" }}>
                  {feature.desc}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
