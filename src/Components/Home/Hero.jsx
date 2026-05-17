import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { useUISettings } from "../../context/UIContext";

export default function Hero() {
  const { t } = useUISettings();

  return (
    <section className="hero-shell section-shell overflow-hidden pt-28 md:pt-32">
      <div className="section-inner grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <span className="eyebrow">
            <ShieldCheck size={16} />
            {t("home.hero.badge")}
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl" style={{ color: "var(--text)" }}>
            {t("home.hero.title")}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 md:text-lg" style={{ color: "var(--text-muted)" }}>
            {t("home.hero.description")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/signup" className="btn-primary">
              {t("home.hero.primary")}
              <ArrowRight size={18} className="rtl-flip" />
            </Link>
            <a href="#works" className="btn-secondary">
              {t("home.hero.secondary")}
            </a>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <div className="flex -space-x-3">
              <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Patient 1" className="h-11 w-11 rounded-full border-2 border-white object-cover" />
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Patient 2" className="h-11 w-11 rounded-full border-2 border-white object-cover" />
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Patient 3" className="h-11 w-11 rounded-full border-2 border-white object-cover" />
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              <span className="text-lg font-extrabold" style={{ color: "var(--text)" }}>
                10,000+
              </span>{" "}
              {t("home.hero.stat")}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative"
        >
          <div className="surface-card overflow-hidden rounded-[2rem] p-3">
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1400&auto=format&fit=crop"
              alt="Healthcare dashboard"
              className="h-[420px] w-full rounded-[1.5rem] object-cover md:h-[520px]"
            />
          </div>
          <div
            className="surface-card absolute -bottom-6 start-4 max-w-xs rounded-[1.5rem] p-4 md:start-8"
            style={{ backgroundColor: "var(--surface-strong)" }}
          >
            <p className="text-sm font-bold" style={{ color: "var(--text)" }}>
              {t("home.hero.goalTitle")}
            </p>
            <p className="mt-2 text-sm leading-6" style={{ color: "var(--text-muted)" }}>
              {t("home.hero.goalText")}
            </p>
            <div className="mt-4 h-2 overflow-hidden rounded-full" style={{ backgroundColor: "var(--surface-muted)" }}>
              <div className="h-full w-[82%] rounded-full" style={{ background: "linear-gradient(90deg, var(--primary), var(--primary-strong))" }} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
