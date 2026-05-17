import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import TranslateIcon from "@mui/icons-material/Translate";
import IconButton from "@mui/material/IconButton";
import { useUISettings } from "../../context/UIContext";

const NavLink = ({ to, label, active, onClick }) => (
  <Link
    to={to}f
    onClick={onClick}
    className="rounded-full px-3 py-2 text-sm font-semibold"
    style={{
      color: active ? "var(--primary)" : "var(--text-muted)",
      backgroundColor: active ? "var(--primary-soft)" : "transparent",
    }}
  >
    {label}
  </Link>
);

function Navbar() {
  const location = useLocation();
  const { t, isDark, toggleTheme, language, setLanguage, direction } = useUISettings();
  const [isScrolled, setIsScrolled] = useState(false);

  const links = useMemo(
    () => [
      { label: t("nav.home"), path: "/" },
      { label: t("nav.features"), path: "/features" },
      { label: t("nav.about"), path: "/aboutus" },
    ],
    [t]
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 14);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 px-3 py-3 md:px-6" dir={direction}>
      <div
        className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 rounded-[1.4rem] px-4 py-3 md:px-6"
        style={{
          backgroundColor: isScrolled ? "var(--surface)" : "rgba(255,255,255,0.08)",
          border: `1px solid ${isScrolled ? "var(--border)" : "transparent"}`,
          boxShadow: isScrolled ? "var(--shadow-md)" : "none",
          backdropFilter: "blur(18px)",
        }}
      >
        <Link to="/" className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "var(--primary-soft)", color: "var(--primary)" }}
          >
            <AddBoxIcon sx={{ fontSize: 28 }} />
          </div>
          <div>
            <p className="text-base font-extrabold" style={{ color: "var(--text)" }}>
              {t("brand.name")}
            </p>
            <p className="hidden text-xs md:block" style={{ color: "var(--text-muted)" }}>
              Smart medication support
            </p>
          </div>
        </Link>

        <div className="order-3 flex w-full flex-wrap items-center justify-center gap-2 md:order-2 md:w-auto">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              label={link.label}
              active={location.pathname === link.path}
            />
          ))}
        </div>

        <div className="order-2 flex items-center gap-2 md:order-3">
          <IconButton
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            aria-label={t("nav.switchLanguage")}
            sx={{
              border: "1px solid var(--border)",
              color: "var(--text)",
              backgroundColor: "var(--surface)",
            }}
          >
            <TranslateIcon />
          </IconButton>
          <IconButton
            onClick={toggleTheme}
            aria-label={t("nav.switchTheme")}
            sx={{
              border: "1px solid var(--border)",
              color: "var(--text)",
              backgroundColor: "var(--surface)",
            }}
          >
            {isDark ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <Link to="/login" className="btn-ghost">
            {t("nav.login")}
          </Link>
          <Link to="/signup" className="btn-primary">
            {t("nav.signup")}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
