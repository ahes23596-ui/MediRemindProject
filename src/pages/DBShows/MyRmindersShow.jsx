import React, { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useTheme } from "@mui/material/styles";
import medicationService from "../../Https/medicationService";
import reminderService, { occursOnDate } from "../../Https/reminderService";
import { getDashboardTheme } from "./dashboardTheme";
import { useUISettings } from "../../context/UIContext";

const toIsoDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().split("T")[0];
};

function MyRmindersShow() {
  const theme = useTheme();
  const { direction, t } = useUISettings();
  const ui = getDashboardTheme(theme.palette.mode === "dark");
  const [calendarEntries, setCalendarEntries] = useState([]);
  const [apiReminders, setApiReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleRange, setVisibleRange] = useState(() => {
    const now = new Date();
    return {
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end: new Date(now.getFullYear(), now.getMonth() + 1, 1),
    };
  });

  useEffect(() => {
    const loadCalendar = async () => {
      setLoading(true);
      setError("");

      try {
        const [schedule, reminders] = await Promise.all([
          medicationService.getCalendarSchedule(),
          reminderService.getReminders(),
        ]);

        setCalendarEntries(Array.isArray(schedule) ? schedule : []);
        setApiReminders(Array.isArray(reminders) ? reminders : []);
      } catch (err) {
        console.error("Calendar load error:", err);
        setError(t("dashboard.calendar.error"));
      } finally {
        setLoading(false);
      }
    };

    loadCalendar();
  }, [t]);

  const events = useMemo(
    () => {
      const medicineEvents = calendarEntries
        .filter((entry) => {
          const entryDate = new Date(entry.fullDate || entry.date);
          return !Number.isNaN(entryDate.getTime()) && entryDate >= visibleRange.start && entryDate < visibleRange.end;
        })
        .map((entry, index) => {
          const start = toIsoDate(entry.fullDate || entry.date);
          if (!start) return null;

          return {
            id: `${entry.medicineId || entry.medicine}-${entry.scheduledTime || index}-${start}`,
            title: `${entry.medicine}${entry.scheduledTime ? ` - ${entry.scheduledTime}` : ""}`,
            start,
            allDay: true,
            backgroundColor: entry.taken ? "#16a34a" : ui.page.accent,
            borderColor: entry.taken ? "#16a34a" : ui.page.accent,
            textColor: "#ffffff",
            extendedProps: {
              dose: entry.dosage,
              status: entry.taken ? t("dashboard.calendar.completed") : t("dashboard.calendar.pending"),
              important: "",
              repeat: "",
              note: entry.status,
            },
          };
        })
        .filter(Boolean);

      const reminderEvents = [];
      const activeDate = new Date(visibleRange.start);

      while (activeDate < visibleRange.end) {
        apiReminders.forEach((entry) => {
          if (!occursOnDate(entry, activeDate)) return;

          const start = toIsoDate(activeDate);
          if (!start) return;

          reminderEvents.push({
            id: `reminder-${entry._id}-${start}`,
            title: `${entry.medicineName}${entry.time ? ` - ${entry.time}` : ""}`,
            start,
            allDay: true,
            backgroundColor: entry.isDone ? "#16a34a" : entry.isImportant ? "#dc2626" : "#7c3aed",
            borderColor: entry.isDone ? "#16a34a" : entry.isImportant ? "#dc2626" : "#7c3aed",
            textColor: "#ffffff",
            extendedProps: {
              dose: entry.dose,
              status: entry.isDone ? t("dashboard.calendar.completed") : t("dashboard.calendar.pending"),
              important: entry.isImportant ? t("dashboard.calendar.important") : "",
              repeat: entry.repeat,
              note: entry.note,
            },
          });
        });

        activeDate.setDate(activeDate.getDate() + 1);
      }

      return [...medicineEvents, ...reminderEvents];
    },
    [apiReminders, calendarEntries, t, ui.page.accent, visibleRange]
  );

  return (
    <div className="p-6" style={{ color: ui.page.text }}>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{t("dashboard.calendar.title")}</h1>
        <p className="text-sm opacity-70">
          {t("dashboard.calendar.subtitle")}
        </p>
      </div>

      {loading && <p className="mb-4 text-sm opacity-70">{t("dashboard.calendar.loading")}</p>}
      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
      {!loading && !error && calendarEntries.length === 0 && apiReminders.length === 0 && (
        <p className="mb-4 text-sm opacity-70">{t("dashboard.calendar.empty")}</p>
      )}

      <div className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: ui.page.panel, border: `1px solid ${ui.page.border}` }}>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          direction={direction}
          height="auto"
          events={events}
          datesSet={(dateInfo) => {
            setVisibleRange({
              start: new Date(dateInfo.start),
              end: new Date(dateInfo.end),
            });
          }}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
          }}
          eventDidMount={(info) => {
            const { dose, note, repeat, status, important } = info.event.extendedProps;
            info.el.title = [info.event.title, dose, repeat, status, important, note].filter(Boolean).join(" | ");
          }}
        />
      </div>
    </div>
  );
}

export default MyRmindersShow;
