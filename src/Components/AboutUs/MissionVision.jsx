import React from "react";
import { motion } from "framer-motion";
import { Eye, Target } from "lucide-react";
import { useUISettings } from "../../context/UIContext";

function MissionVision() {
  const { t } = useUISettings();

  const cards = [
    { icon: Target, title: t("aboutPage.mission.missionTitle"), text: t("aboutPage.mission.missionText") },
    { icon: Eye, title: t("aboutPage.mission.visionTitle"), text: t("aboutPage.mission.visionText") },
  ];

  return (
    <section id="mission" className="section-shell">
      <div className="section-inner">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">{t("aboutPage.mission.title")}</span>
          <h2 className="mt-5 text-3xl font-extrabold md:text-5xl" style={{ color: "var(--text)" }}>
            {t("aboutPage.mission.title")}
          </h2>
          <p className="mt-5 text-base leading-8 md:text-lg" style={{ color: "var(--text-muted)" }}>
            {t("aboutPage.mission.description")}
          </p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {cards.map(({ icon: Icon, title, text }) => {
            const iconElement = React.createElement(Icon, { size: 24 });
            return (
              <motion.article
                key={title}
                whileHover={{ y: -6 }}
                className="surface-card rounded-[1.8rem] p-6 md:p-8"
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: "var(--primary-soft)", color: "var(--primary)" }}
                >
                  {iconElement}
                </div>
                <h3 className="mt-6 text-2xl font-bold" style={{ color: "var(--text)" }}>
                  {title}
                </h3>
                <p className="mt-4 text-sm leading-8 md:text-base" style={{ color: "var(--text-muted)" }}>
                  {text}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default MissionVision;
