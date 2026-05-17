import React from "react";
import { ClipboardCheck, Heart, Shield, Zap } from "lucide-react";
import { useUISettings } from "../../context/UIContext";

const icons = [Shield, ClipboardCheck, Heart, Zap];

export default function CoreValuesSection() {
  const { t } = useUISettings();
  const values = t("aboutPage.values.items");

  return (
    <section className="section-shell" style={{ backgroundColor: "var(--bg-soft)" }}>
      <div className="section-inner">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">{t("aboutPage.values.title")}</span>
          <h2 className="mt-5 text-3xl font-extrabold md:text-5xl" style={{ color: "var(--text)" }}>
            {t("aboutPage.values.title")}
          </h2>
          <p className="mt-5 text-base leading-8 md:text-lg" style={{ color: "var(--text-muted)" }}>
            {t("aboutPage.values.description")}
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {values.map((value, index) => {
            const Icon = icons[index];
            return (
              <article key={value.title} className="surface-card rounded-[1.7rem] p-6 text-center">
                <div
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: "var(--primary-soft)", color: "var(--primary)" }}
                >
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-xl font-bold" style={{ color: "var(--text)" }}>
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
                  {value.desc}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
