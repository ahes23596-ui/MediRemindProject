export const getDashboardTheme = (isDark) => ({
  page: {
    background: isDark ? "#0f172a" : "#f8fafc",
    panel: isDark ? "#162033" : "#ffffff",
    panelAlt: isDark ? "#1e293b" : "#f8fafc",
    input: isDark ? "#0f172a" : "#ffffff",
    border: isDark ? "#334155" : "#e2e8f0",
    borderStrong: isDark ? "#475569" : "#cbd5e1",
    text: isDark ? "#e2e8f0" : "#0f172a",
    muted: isDark ? "#94a3b8" : "#64748b",
    accent: "#2563eb",
    accentHover: "#1d4ed8",
    success: "#059669",
    danger: "#dc2626",
    shadow: isDark
      ? "0 18px 40px rgba(2, 6, 23, 0.35)"
      : "0 18px 40px rgba(148, 163, 184, 0.18)",
  },
  nav: {
    topBar: isDark ? "rgba(15, 23, 42, 0.92)" : "rgba(255, 255, 255, 0.92)",
    sideBar: isDark ? "#111827" : "#ffffff",
    sideBarAlt: isDark ? "#0f172a" : "#f8fafc",
    icon: isDark ? "#e2e8f0" : "#334155",
    muted: isDark ? "#94a3b8" : "#64748b",
    activeBg: isDark ? "rgba(37, 99, 235, 0.18)" : "rgba(37, 99, 235, 0.10)",
    activeBorder: "#2563eb",
    activeText: isDark ? "#dbeafe" : "#1d4ed8",
    shadow: isDark
      ? "0 20px 50px rgba(2, 6, 23, 0.45)"
      : "0 20px 40px rgba(148, 163, 184, 0.18)",
  },
});
