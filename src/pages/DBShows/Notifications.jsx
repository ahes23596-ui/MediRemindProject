import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
} from "@mui/material";
import MedicationIcon from "@mui/icons-material/Medication";
import EventIcon from "@mui/icons-material/Event";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import CampaignIcon from "@mui/icons-material/Campaign";
import AxiosWrapper from "../../Https/AxiosWrapper";
import { getDashboardTheme } from "./dashboardTheme";
import { useUISettings } from "../../context/UIContext";

export default function Notifications() {
  const { isDark, t } = useUISettings();
  const ui = getDashboardTheme(isDark);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const [{ data: missedData }, { data: refillData }, { data: reminderData }] =
          await Promise.all([
            AxiosWrapper.get("/medicines/missed-doses"),
            AxiosWrapper.get("/medicines/refill-alerts"),
            AxiosWrapper.get("/reminders"),
          ]);

        const reminderNotifications = (reminderData?.data || []).slice(0, 5).map((reminder) => ({
          title: reminder.isDone ? t("dashboard.notifications.completedReminder") : t("dashboard.notifications.medicationReminder"),
          description: `${reminder.medicineName} ${reminder.dose} at ${reminder.time}.`,
          time: reminder.time,
          icon: <MedicationIcon />,
        }));

        const refillNotifications = (refillData?.alerts || []).map((alert) => ({
          title: t("dashboard.notifications.refillAlert"),
          description: alert.message,
          time: t("dashboard.notifications.stock"),
          icon: <LocalPharmacyIcon />,
        }));

        const missedNotifications = (missedData?.missedDoses || []).map((missed) => ({
          title: t("dashboard.notifications.missedDose"),
          description: missed.message,
          time: missed.scheduledTime,
          icon: <CampaignIcon />,
        }));

        setNotifications([
          ...reminderNotifications,
          ...refillNotifications,
          ...missedNotifications,
        ]);
      } catch (error) {
        console.error("Notification load error:", error);
        setNotifications([]);
      }
    };

    loadNotifications();
  }, [t]);

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        backgroundColor: ui.page.background,
        color: ui.page.text,
      }}
    >
      <Paper
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          backgroundColor: ui.page.panel,
          border: `1px solid ${ui.page.border}`,
          boxShadow: ui.page.shadow,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          {t("dashboard.notifications.title")}
        </Typography>

        <Button
          variant="contained"
          onClick={() => setNotifications([])}
          sx={{
            backgroundColor: ui.page.accent,
          }}
        >
          {t("common.clearAll")}
        </Button>
      </Paper>

      <Stack spacing={3}>
        {notifications.map((item, index) => (
          <Paper
            key={`${item.title}-${index}`}
            sx={{
              p: 3,
              borderRadius: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: ui.page.panel,
              border: `1px solid ${ui.page.border}`,
              boxShadow: ui.page.shadow,
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: ui.page.panelAlt,
                }}
              >
                {item.icon}
              </Box>

              <Box>
                <Typography fontWeight="bold">{item.title}</Typography>
                <Typography variant="body2" sx={{ color: ui.page.muted }}>
                  {item.description}
                </Typography>
              </Box>
            </Stack>

            <Typography variant="body2" sx={{ color: ui.page.muted }}>
              {item.time}
            </Typography>
          </Paper>
        ))}

        {!notifications.length && (
          <Paper sx={{ p: 4, borderRadius: 3, textAlign: "center", backgroundColor: ui.page.panel, border: `1px solid ${ui.page.border}` }}>
            <Typography>{t("dashboard.notifications.empty")}</Typography>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}
