import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useUISettings } from "../../context/UIContext";

function Faq() {
  const [openIndex, setOpenIndex] = useState(0);
  const { t } = useUISettings();
  const faqs = t("home.faq.items");

  return (
    <section className="section-shell" style={{ backgroundColor: "var(--bg-soft)" }}>
      <div className="section-inner max-w-4xl">
        <div className="text-center">
          <span className="eyebrow">{t("home.faq.eyebrow")}</span>
          <h2 className="mt-5 text-3xl font-extrabold md:text-5xl" style={{ color: "var(--text)" }}>
            {t("home.faq.title")}
          </h2>
          <p className="mt-5 text-base leading-8 md:text-lg" style={{ color: "var(--text-muted)" }}>
            {t("home.faq.description")}
          </p>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <button
                key={faq.question}
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="surface-card w-full rounded-[1.5rem] p-5 text-start"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-base font-bold md:text-lg" style={{ color: "var(--text)" }}>
                    {faq.question}
                  </h3>
                  <ChevronDown
                    size={18}
                    style={{
                      color: "var(--text-muted)",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  />
                </div>
                {isOpen && (
                  <p className="mt-4 text-sm leading-7 md:text-base" style={{ color: "var(--text-muted)" }}>
                    {faq.answer}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Faq;
