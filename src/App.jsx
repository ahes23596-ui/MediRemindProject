import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Navbar from "./Components/General/Navbar.jsx";
import Footer from "./Components/General/Footer.jsx";
import ProtectedRoute from "./Components/General/ProtectedRoute.jsx";
import PublicOnlyRoute from "./Components/General/PublicOnlyRoute";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import DashBoard from "./pages/DBShows/DashBoard.jsx";
import DashBoardShow from "./pages/DBShows/DashBoardShow";
import MedicationsShow from "./pages/DBShows/MedicationsShow";
import PrescriptionUploadShow from "./pages/DBShows/PrescriptionUploadShow";
import MyRmindersShow from "./pages/DBShows/MyRmindersShow";
import SettingShow from "./pages/DBShows/SettingShow";
import AccountShow from "./pages/DBShows/AccountShow";
import Notifications from "./pages/DBShows/Notifications";
import ForgotPassword from "./pages/DBShows/ForgotPassword.jsx";
import ScrollToTop from "./Components/General/ScrollToTop.jsx";
import { AuthProvider } from "./context/AuthContext";
import Features from "./pages/Features";
import AboutUsPage from "./pages/AboutUsPage";
import { useUISettings } from "./context/UIContext";

function App() {
  const location = useLocation();
  const isDashboard = location.pathname.toLowerCase().includes("/dashboard");
  const { theme, direction } = useUISettings();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ScrollToTop />
      <AuthProvider>
        {!isDashboard && <Navbar />}

        <Box
          component="main"
          dir={direction}
          className={isDashboard ? "" : "pt-16 md:pt-18"}
          sx={{
            minHeight: isDashboard ? "auto" : "100vh",
            backgroundColor: isDashboard ? "transparent" : "background.default",
            color: "text.primary",
            transition: "background-color 0.3s ease, color 0.3s ease",
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/aboutus" element={<AboutUsPage />} />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LogIn />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicOnlyRoute>
                  <SignUp />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicOnlyRoute>
                  <ForgotPassword />
                </PublicOnlyRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashBoard />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashBoardShow />} />
              <Route path="medications" element={<MedicationsShow />} />
              <Route path="prescriptions" element={<PrescriptionUploadShow />} />
              <Route path="reminders" element={<MyRmindersShow />} />
              <Route path="settings" element={<SettingShow />} />
              <Route path="account" element={<AccountShow />} />
              <Route path="notifications" element={<Notifications />} />
            </Route>
          </Routes>
        </Box>

        {!isDashboard && <Footer />}
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
