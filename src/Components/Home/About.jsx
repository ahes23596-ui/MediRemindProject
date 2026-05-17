import React from "react";
import { motion } from "framer-motion";
import { useUISettings } from "../../context/UIContext";

function About() {
  const { t } = useUISettings();
  const paragraphs = t("home.about.paragraphs");

  return (
    <section className="section-shell">
      <div className="section-inner grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <span className="eyebrow">About MediRemind</span>
          <h2 className="mt-5 text-3xl font-extrabold md:text-5xl" style={{ color: "var(--text)" }}>
            {t("home.about.title")}
          </h2>
          <p className="mt-5 text-base leading-8 md:text-lg" style={{ color: "var(--text-muted)" }}>
            {t("home.about.subtitle")}
          </p>
        </motion.div>

        <motion.div
          className="surface-card rounded-[2rem] p-8 md:p-10"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="space-y-5 text-base leading-8 md:text-lg" style={{ color: "var(--text-muted)" }}>
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
