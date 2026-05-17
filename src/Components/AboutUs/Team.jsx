import React from "react";
import { motion } from "framer-motion";
import { useUISettings } from "../../context/UIContext";

const images = [
  "https://i.pravatar.cc/300?img=32",
  "https://i.pravatar.cc/300?img=12",
  "https://i.pravatar.cc/300?img=47",
  "https://i.pravatar.cc/300?img=20",
];

function Team() {
  const { t } = useUISettings();
  const team = t("aboutPage.team.members");

  return (
    <section id="team" className="section-shell" style={{ backgroundColor: "var(--bg-soft)" }}>
      <div className="section-inner">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">{t("aboutPage.team.title")}</span>
          <h2 className="mt-5 text-3xl font-extrabold md:text-5xl" style={{ color: "var(--text)" }}>
            {t("aboutPage.team.title")}
          </h2>
          <p className="mt-5 text-base leading-8 md:text-lg" style={{ color: "var(--text-muted)" }}>
            {t("aboutPage.team.description")}
          </p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {team.map((member, index) => (
            <motion.article
              key={member.name}
              whileHover={{ y: -6 }}
              className="surface-card rounded-[1.8rem] p-4"
            >
              <img
                src={images[index]}
                alt={member.name}
                className="h-56 w-full rounded-[1.4rem] object-cover"
              />
              <div className="mt-5">
                <h3 className="text-lg font-bold" style={{ color: "var(--text)" }}>
                  {member.name}
                </h3>
                <p className="mt-2 text-sm font-medium" style={{ color: "var(--primary)" }}>
                  {member.role}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Team;
