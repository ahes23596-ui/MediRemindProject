import React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { useTheme } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import TopBar from "../../Components/DSHCOM/TopBar";
import SideBar from "../../Components/DSHCOM/SideBar";
import { useUISettings } from "../../context/UIContext";

export default function DashBoard() {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const { direction } = useUISettings();

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: theme.palette.mode === "dark" ? "#0f172a" : "#f8fafc",
        color: theme.palette.text.primary,
        overflowX: "hidden",
      }}
    >
      <CssBaseline />
      <TopBar open={open} handleDrawerOpen={handleDrawerOpen} />
      <SideBar open={open} handleDrawerClose={handleDrawerClose} />
      <Box
        component="main"
        dir={direction}
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: { xs: 2, md: 3 },
          mt: 10,
          transition: theme.transitions.create(["padding"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
