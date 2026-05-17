import React from "react";
import { BellRing, Star, Users } from "lucide-react";
import { useUISettings } from "../../context/UIContext";

function Rate() {
  const { t } = useUISettings();

  const stats = [
    { icon: Users, value: "10k+", label: t("home.stats.patients") },
    { icon: BellRing, value: "1M+", label: t("home.stats.reminders") },
    { icon: Star, value: "4.9/5", label: t("home.stats.rating") },
  ];

  return (
    <section className="section-shell py-10">
      <div className="section-inner">
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map(({ icon: Icon, value, label }) => {
            const iconElement = React.createElement(Icon, { size: 24 });
            return (
              <div key={label} className="surface-card rounded-[1.6rem] p-6">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: "var(--primary-soft)", color: "var(--primary)" }}
                >
                  {iconElement}
                </div>
                <h3 className="mt-5 text-3xl font-extrabold" style={{ color: "var(--text)" }}>
                  {value}
                </h3>
                <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-muted)" }}>
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Rate;
