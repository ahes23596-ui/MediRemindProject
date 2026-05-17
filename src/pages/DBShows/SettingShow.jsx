import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Moon, Globe, Clock, MapPin } from "lucide-react";
import { getDashboardTheme } from "./dashboardTheme";
import { useUISettings } from "../../context/UIContext";

function SettingShow() {
  const theme = useTheme();
  const ui = getDashboardTheme(theme.palette.mode === "dark");
  const {
    isDark,
    toggleTheme,
    language,
    setLanguage,
    timezone,
    setTimezone,
    timeFormat,
    setTimeFormat,
    t,
  } = useUISettings();
  const [saved, setSaved] = useState("");

  const saveSettings = () => {
    setSaved(t("dashboard.settings.saved"));
  };

  return (
    <div className="p-6" style={{ color: ui.page.text }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t("dashboard.settings.title")}</h1>
        <p className="mt-1" style={{ color: ui.page.muted }}>{t("dashboard.settings.subtitle")}</p>
      </div>

      <div className="rounded-xl p-6 shadow-sm mb-6 transition-colors duration-300" style={{ backgroundColor: ui.page.panel, border: `1px solid ${ui.page.border}`, boxShadow: ui.page.shadow }}>
        <h2 className="text-lg font-semibold mb-4">{t("dashboard.settings.appearance")}</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: ui.page.panelAlt }}>
              <Moon className="w-5 h-5" style={{ color: ui.page.muted }} />
            </div>
            <span className="font-medium">{t("common.darkMode")}</span>
          </div>
          <button
            onClick={toggleTheme}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 ${
              isDark ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all duration-300 ${
                isDark ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="rounded-xl p-6 shadow-sm transition-colors duration-300" style={{ backgroundColor: ui.page.panel, border: `1px solid ${ui.page.border}`, boxShadow: ui.page.shadow }}>
        <h2 className="text-lg font-semibold mb-4">{t("dashboard.settings.localization")}</h2>
        <div className="flex items-center justify-between py-4 border-b" style={{ borderColor: ui.page.border }}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: ui.page.panelAlt }}>
              <MapPin className="w-5 h-5" style={{ color: ui.page.muted }} />
            </div>
            <span className="font-medium">{t("dashboard.settings.timeZone")}</span>
          </div>
          <input
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
            style={{ backgroundColor: ui.page.input, borderColor: ui.page.borderStrong, color: ui.page.text }}
          />
        </div>

        <div className="flex items-center justify-between py-4 border-b" style={{ borderColor: ui.page.border }}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: ui.page.panelAlt }}>
              <Clock className="w-5 h-5" style={{ color: ui.page.muted }} />
            </div>
            <span className="font-medium">{t("dashboard.settings.timeFormat")}</span>
          </div>
          <select
            value={timeFormat}
            onChange={(e) => setTimeFormat(e.target.value)}
            className="border rounded-lg px-3 py-2"
            style={{ backgroundColor: ui.page.input, borderColor: ui.page.borderStrong, color: ui.page.text }}
          >
            <option value="24-hour">{t("dashboard.settings.twentyFourHour")}</option>
            <option value="12-hour">{t("dashboard.settings.twelveHour")}</option>
          </select>
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: ui.page.panelAlt }}>
              <Globe className="w-5 h-5" style={{ color: ui.page.muted }} />
            </div>
            <span className="font-medium">{t("dashboard.settings.language")}</span>
          </div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border rounded-lg px-3 py-2"
            style={{ backgroundColor: ui.page.input, borderColor: ui.page.borderStrong, color: ui.page.text }}
          >
            <option value="en">{t("common.english")}</option>
            <option value="ar">{t("common.arabic")}</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={saveSettings}
          className="text-white px-6 py-3 rounded-lg transition-colors duration-300"
          style={{ backgroundColor: ui.page.accent }}
        >
          {t("common.save")}
        </button>
      </div>
      {saved && <p className="mt-4 text-sm" style={{ color: ui.page.success }}>{saved}</p>}
    </div>
  );
}

export default SettingShow;
