import React from "react";
import { motion } from "framer-motion";
import { useUISettings } from "../../context/UIContext";

function HealthJourney() {
  const { t } = useUISettings();

  return (
    <section className="hero-shell section-shell pt-28 md:pt-32">
      <div className="section-inner">
        <motion.div
          className="rounded-[2.2rem] p-8 text-center md:p-14"
          style={{
            background:
              "linear-gradient(135deg, rgba(8, 17, 31, 0.96) 0%, rgba(29, 78, 216, 0.9) 55%, rgba(96, 165, 250, 0.82) 100%)",
            color: "#ffffff",
            boxShadow: "var(--shadow-lg)",
          }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65 }}
        >
          <span className="inline-flex rounded-full bg-white/12 px-4 py-2 text-sm font-bold">
            {t("aboutPage.hero.primary")}
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
            {t("aboutPage.hero.title")}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-100 md:text-lg">
            {t("aboutPage.hero.description")}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="#mission" className="btn-secondary">
              {t("aboutPage.hero.primary")}
            </a>
            <a href="#team" className="btn-ghost border-white/30 text-white">
              {t("aboutPage.hero.secondary")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HealthJourney;
