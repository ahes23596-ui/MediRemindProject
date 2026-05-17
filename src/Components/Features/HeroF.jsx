import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useUISettings } from "../../context/UIContext";

function HeroF() {
  const { t } = useUISettings();

  return (
    <section className="hero-shell section-shell overflow-hidden pt-28 md:pt-32">
      <div className="section-inner grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
          <span className="eyebrow">{t("featuresPage.overview.eyebrow")}</span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-6xl" style={{ color: "var(--text)" }}>
            {t("featuresPage.hero.title")}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 md:text-lg" style={{ color: "var(--text-muted)" }}>
            {t("featuresPage.hero.description")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/signup" className="btn-primary">
              {t("featuresPage.hero.primary")}
            </Link>
            <Link to="/aboutus" className="btn-secondary">
              {t("featuresPage.hero.secondary")}
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
          <div className="surface-card rounded-[2rem] p-3">
            <img
              src="https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1400&auto=format&fit=crop"
              alt="Feature preview"
              className="h-[420px] w-full rounded-[1.5rem] object-cover md:h-[520px]"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroF;
