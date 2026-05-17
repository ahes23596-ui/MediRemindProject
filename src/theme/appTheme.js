const paletteTokens = {
  light: {
    primary: "#2563eb",
    primaryDark: "#1d4ed8",
    secondary: "#0f766e",
    background: "#f4f7fb",
    surface: "#ffffff",
    surfaceAlt: "#eef4ff",
    text: "#0f172a",
    muted: "#5b6b84",
    border: "#d8e1f0",
  },
  dark: {
    primary: "#60a5fa",
    primaryDark: "#3b82f6",
    secondary: "#2dd4bf",
    background: "#08111f",
    surface: "#0f1b2d",
    surfaceAlt: "#16243a",
    text: "#e5eefc",
    muted: "#9eb0ca",
    border: "#253753",
  },
};

export function buildAppTheme({ mode, direction, language }) {
  const tokens = paletteTokens[mode];

  return {
    direction,
    palette: {
      mode,
      primary: {
        main: tokens.primary,
        dark: tokens.primaryDark,
      },
      secondary: {
        main: tokens.secondary,
      },
      background: {
        default: tokens.background,
        paper: tokens.surface,
      },
      text: {
        primary: tokens.text,
        secondary: tokens.muted,
      },
      divider: tokens.border,
    },
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily:
        language === "ar"
          ? '"Cairo", "Segoe UI", sans-serif'
          : '"Plus Jakarta Sans", "Segoe UI", sans-serif',
      h1: { fontWeight: 800, letterSpacing: "-0.04em" },
      h2: { fontWeight: 800, letterSpacing: "-0.03em" },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { fontWeight: 700, textTransform: "none" },
    },
    customTokens: tokens,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          html: {
            scrollBehavior: "smooth",
          },
          body: {
            backgroundColor: tokens.background,
            color: tokens.text,
          },
          "::selection": {
            backgroundColor: mode === "dark" ? "rgba(96, 165, 250, 0.28)" : "rgba(37, 99, 235, 0.2)",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
      },
    },
  };
}
