import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useUISettings } from "../../context/UIContext";

export default function TrustSection() {
  const { t } = useUISettings();
  const points = t("home.trust.points");

  return (
    <section className="section-shell">
      <div className="section-inner">
        <div className="surface-card grid gap-8 rounded-[2rem] p-6 md:p-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <span className="eyebrow">{t("home.trust.badge")}</span>
            <h2 className="mt-5 text-3xl font-extrabold md:text-4xl" style={{ color: "var(--text)" }}>
              {t("home.trust.title")}
            </h2>
            <div className="mt-6 space-y-4">
              {points.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle2 size={20} style={{ color: "var(--success)" }} className="mt-1 shrink-0" />
                  <p className="text-sm leading-7 md:text-base" style={{ color: "var(--text-muted)" }}>
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.8rem] p-6" style={{ backgroundColor: "var(--surface-muted)", border: "1px solid var(--border)" }}>
            <p className="text-lg font-medium leading-8 italic" style={{ color: "var(--text)" }}>
              “{t("home.trust.quote")}”
            </p>
            <div className="mt-6 flex items-center gap-4">
              <img
                src="https://i.pravatar.cc/100?img=32"
                alt={t("home.trust.author")}
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <p className="font-bold" style={{ color: "var(--text)" }}>
                  {t("home.trust.author")}
                </p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {t("home.trust.role")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
