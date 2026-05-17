import React from "react";
import { alpha, styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import TranslateIcon from "@mui/icons-material/Translate";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDashboardTheme } from "../../pages/DBShows/dashboardTheme";
import { useUISettings } from "../../context/UIContext";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "isrtl",
})(({ theme, open, isrtl }) => {
  const ui = getDashboardTheme(theme.palette.mode === "dark");
  return {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: alpha(ui.nav.topBar, 1),
    color: ui.page.text,
    backdropFilter: "blur(8px)",
    borderBottom: `1px solid ${ui.page.border}`,
    boxShadow: ui.nav.shadow,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      ...(isrtl
        ? {
            marginRight: drawerWidth,
          }
        : {
            marginLeft: drawerWidth,
          }),
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  };
});

export default function TopBar({ open, handleDrawerOpen }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isDark, toggleTheme, language, setLanguage, t, direction } = useUISettings();
  const ui = getDashboardTheme(isDark);
  const isRtl = direction === "rtl";

  const iconButtonSx = {
    color: ui.nav.icon,
    border: `1px solid ${ui.page.border}`,
    backgroundColor: ui.page.panelAlt,
    "&:hover": {
      backgroundColor: ui.nav.activeBg,
      borderColor: ui.nav.activeBorder,
    },
  };

  return (
    <AppBar position="fixed" open={open} isrtl={isRtl ? 1 : 0}>
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 72 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={handleDrawerOpen} sx={{ ...iconButtonSx, ...(open && { display: "none" }) }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ fontWeight: 700, color: ui.page.text }}>
            {t("brand.name")}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton sx={iconButtonSx} onClick={() => navigate("/dashboard/notifications")}>
            <NotificationsIcon />
          </IconButton>

          <IconButton sx={iconButtonSx} onClick={() => setLanguage(language === "en" ? "ar" : "en")}>
            <TranslateIcon />
          </IconButton>

          <IconButton sx={iconButtonSx} onClick={toggleTheme}>
            {isDark ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          <IconButton sx={iconButtonSx} onClick={() => navigate("/dashboard/settings")}>
            <SettingsIcon />
          </IconButton>

          <IconButton
            sx={iconButtonSx}
            onClick={async () => {
              await logout();
              navigate("/login", { replace: true });
            }}
          >
            <LogoutIcon />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
