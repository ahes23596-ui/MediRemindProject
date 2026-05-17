import React from "react";
import { motion } from "framer-motion";
import { useUISettings } from "../../context/UIContext";

function OurFounding() {
  const { t } = useUISettings();

  return (
    <section className="section-shell">
      <div className="section-inner grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <span className="eyebrow">{t("aboutPage.founding.title")}</span>
          <h2 className="mt-5 text-3xl font-extrabold md:text-5xl" style={{ color: "var(--text)" }}>
            {t("aboutPage.founding.title")}
          </h2>
          <p className="mt-6 text-base leading-8 md:text-lg" style={{ color: "var(--text-muted)" }}>
            {t("aboutPage.founding.body")}
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <div className="surface-card rounded-[2rem] p-3">
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1400&auto=format&fit=crop"
              alt={t("aboutPage.founding.title")}
              className="h-[420px] w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default OurFounding;
