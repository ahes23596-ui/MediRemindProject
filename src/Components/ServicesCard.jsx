import React from "react";
import { BellRing, FileSearch, Pill } from "lucide-react";
import { motion } from "framer-motion";
import { useUISettings } from "../context/UIContext";

const icons = [Pill, FileSearch, BellRing];

function ServicesCard() {
  const { t } = useUISettings();
  const services = t("home.services.items");

  return (
    <section className="section-shell" style={{ backgroundColor: "var(--bg-soft)" }}>
      <div className="section-inner">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">{t("home.services.title")}</span>
          <h2 className="mt-5 text-3xl font-extrabold md:text-5xl" style={{ color: "var(--text)" }}>
            {t("home.services.title")}
          </h2>
          <p className="mt-5 text-base leading-8 md:text-lg" style={{ color: "var(--text-muted)" }}>
            {t("home.services.subtitle")}
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {services.map((service, index) => {
            const Icon = icons[index];
            return (
              <motion.article
                key={service.title}
                whileHover={{ y: -6 }}
                className="surface-card rounded-[1.8rem] p-6 text-start"
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: "var(--primary-soft)", color: "var(--primary)" }}
                >
                  <Icon size={24} />
                </div>
                <h3 className="mt-5 text-xl font-bold" style={{ color: "var(--text)" }}>
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-7 md:text-base" style={{ color: "var(--text-muted)" }}>
                  {service.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServicesCard;
