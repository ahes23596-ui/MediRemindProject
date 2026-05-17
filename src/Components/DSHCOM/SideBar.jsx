import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MuiDrawer from "@mui/material/Drawer";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MedicationIcon from "@mui/icons-material/Medication";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SettingsIcon from "@mui/icons-material/Settings";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate } from "react-router-dom";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import { useAuth } from "../../context/AuthContext";
import { getDashboardTheme } from "../../pages/DBShows/dashboardTheme";
import { useUISettings } from "../../context/UIContext";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "isrtl",
})(({ theme, open, isrtl }) => {
  const ui = getDashboardTheme(theme.palette.mode === "dark");
  return {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    "& .MuiDrawer-paper": {
      backgroundColor: ui.nav.sideBar,
      color: ui.page.text,
      boxShadow: ui.nav.shadow,
      left: isrtl ? "auto" : 0,
      right: isrtl ? 0 : "auto",
      borderRight: isrtl ? "none" : `1px solid ${ui.page.border}`,
      borderLeft: isrtl ? `1px solid ${ui.page.border}` : "none",
    },
    ...(open
      ? {
          ...openedMixin(theme),
          "& .MuiDrawer-paper": {
            ...openedMixin(theme),
            backgroundColor: ui.nav.sideBar,
            color: ui.page.text,
            boxShadow: ui.nav.shadow,
            left: isrtl ? "auto" : 0,
            right: isrtl ? 0 : "auto",
            borderRight: isrtl ? "none" : `1px solid ${ui.page.border}`,
            borderLeft: isrtl ? `1px solid ${ui.page.border}` : "none",
          },
        }
      : {
          ...closedMixin(theme),
          "& .MuiDrawer-paper": {
            ...closedMixin(theme),
            backgroundColor: ui.nav.sideBar,
            color: ui.page.text,
            boxShadow: ui.nav.shadow,
            left: isrtl ? "auto" : 0,
            right: isrtl ? 0 : "auto",
            borderRight: isrtl ? "none" : `1px solid ${ui.page.border}`,
            borderLeft: isrtl ? `1px solid ${ui.page.border}` : "none",
          },
        }),
  };
});

const DrawerHeader = styled("div")(({ theme, isrtl }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: isrtl ? "flex-start" : "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function SideBar({ open, handleDrawerClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { user } = useAuth();
  const { t, direction } = useUISettings();
  const ui = getDashboardTheme(theme.palette.mode === "dark");
  const isRtl = direction === "rtl";
  const isActive = (path) => location.pathname === path;

  const primaryItems = [
    { text: t("dashboard.sidebar.overview"), icon: <HomeOutlinedIcon />, path: "/dashboard" },
    { text: t("dashboard.sidebar.medications"), icon: <MedicationIcon />, path: "/dashboard/medications" },
    { text: t("dashboard.sidebar.prescriptions"), icon: <DescriptionOutlinedIcon />, path: "/dashboard/prescriptions" },
    { text: t("dashboard.sidebar.reminders"), icon: <NotificationsActiveOutlinedIcon />, path: "/dashboard/reminders" },
  ];

  const secondaryItems = [
    { text: t("dashboard.sidebar.settings"), icon: <SettingsIcon />, path: "/dashboard/settings" },
    { text: t("dashboard.sidebar.account"), icon: <AccountCircleOutlinedIcon />, path: "/dashboard/account" },
  ];

  return (
    <Drawer variant="permanent" open={open} anchor={isRtl ? "right" : "left"} isrtl={isRtl ? 1 : 0}>
      <DrawerHeader isrtl={isRtl ? 1 : 0}>
        <IconButton onClick={handleDrawerClose}>
          {isRtl ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>

      <Divider sx={{ borderColor: ui.page.border }} />

      <Avatar
        sx={{
          mx: "auto",
          width: open ? 88 : 45,
          height: open ? 88 : 45,
          transition: "0.25s",
          my: 2,
          border: `2px solid ${ui.nav.activeBorder}`,
          bgcolor: ui.page.panelAlt,
          color: ui.page.text,
        }}
        alt={user?.firstname || "User"}
      />

      <Typography align="center" sx={{ fontSize: open ? 17 : 0, transition: "0.25s", color: ui.page.text, fontWeight: 700 }}>
        {user ? `${user.firstname} ${user.lastname}` : ""}
      </Typography>

      <Typography align="center" sx={{ fontSize: open ? 15 : 0, transition: "0.25s", color: ui.nav.muted }}>
        {user?.username || ""}
      </Typography>

      <Divider sx={{ borderColor: ui.page.border, mt: 2 }} />

      <List>
        {primaryItems.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            open={open}
            isRtl={isRtl}
            ui={ui}
            active={isActive(item.path)}
            onClick={() => navigate(item.path)}
          />
        ))}
      </List>

      <Divider sx={{ borderColor: ui.page.border }} />

      <List>
        {secondaryItems.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            open={open}
            isRtl={isRtl}
            ui={ui}
            active={isActive(item.path)}
            onClick={() => navigate(item.path)}
          />
        ))}
      </List>
    </Drawer>
  );
}

function SidebarItem({ item, open, isRtl, ui, active, onClick }) {
  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <ListItemButton
        onClick={onClick}
        sx={{
          minHeight: 48,
          justifyContent: open ? "initial" : "center",
          px: 3,
          mx: 1,
          my: 0.5,
          borderRadius: 2,
          color: active ? ui.nav.activeText : ui.page.text,
          bgcolor: active ? ui.nav.activeBg : "transparent",
          border: active ? `1px solid ${ui.nav.activeBorder}` : "1px solid transparent",
          "&:hover": {
            bgcolor: ui.nav.activeBg,
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            justifyContent: "center",
            color: active ? ui.nav.activeText : ui.nav.icon,
            mr: open && !isRtl ? 3 : 0,
            ml: open && isRtl ? 3 : 0,
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.text}
          sx={{
            opacity: open ? 1 : 0,
            textAlign: isRtl ? "right" : "left",
          }}
        />
      </ListItemButton>
    </ListItem>
  );
}
