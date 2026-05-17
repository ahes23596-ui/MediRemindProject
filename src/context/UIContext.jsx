/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createTheme } from "@mui/material/styles";
import { getTranslation } from "../content/translations";
import { buildAppTheme } from "../theme/appTheme";

const STORAGE_KEYS = {
  themeMode: "themeMode",
  language: "language",
  timezone: "timezone",
  timeFormat: "timeFormat",
};

const UIContext = createContext(null);

const getInitialThemeMode = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.themeMode);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  const legacyDarkMode = localStorage.getItem("darkMode");
  if (legacyDarkMode === "true") return "dark";
  return "light";
};

const getInitialLanguage = () => {
  const stored = localStorage.getItem(STORAGE_KEYS.language);
  if (stored === "ar" || stored === "en") {
    return stored;
  }

  if (stored === "Arabic") return "ar";
  return "en";
};

export function UIProvider({ children }) {
  const [themeMode, setThemeMode] = useState(getInitialThemeMode);
  const [language, setLanguage] = useState(getInitialLanguage);
  const [timezone, setTimezone] = useState(
    () => localStorage.getItem(STORAGE_KEYS.timezone) || "Africa/Cairo"
  );
  const [timeFormat, setTimeFormat] = useState(
    () => localStorage.getItem(STORAGE_KEYS.timeFormat) || "24-hour"
  );

  const direction = language === "ar" ? "rtl" : "ltr";
  const isDark = themeMode === "dark";

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.themeMode, themeMode);
    localStorage.setItem("darkMode", String(isDark));
    document.documentElement.dataset.theme = themeMode;
  }, [themeMode, isDark]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.language, language);
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    document.body.dir = direction;
  }, [direction, language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.timezone, timezone);
  }, [timezone]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.timeFormat, timeFormat);
  }, [timeFormat]);

  const theme = useMemo(
    () => createTheme(buildAppTheme({ mode: themeMode, direction, language })),
    [direction, language, themeMode]
  );

  const value = useMemo(
    () => ({
      theme,
      themeMode,
      language,
      direction,
      timezone,
      timeFormat,
      isDark,
      setThemeMode,
      toggleTheme: () => setThemeMode((currentMode) => (currentMode === "dark" ? "light" : "dark")),
      setLanguage,
      setTimezone,
      setTimeFormat,
      t: (path, params) => getTranslation(language, path, params),
    }),
    [direction, isDark, language, theme, themeMode, timeFormat, timezone]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUISettings() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUISettings must be used within UIProvider");
  }
  return context;
}
