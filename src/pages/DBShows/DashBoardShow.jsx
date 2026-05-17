import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import AxiosWrapper from "../../Https/AxiosWrapper";
import medicationService from "../../Https/medicationService";
import reminderService, { occursOnDate, sortRemindersByTime } from "../../Https/reminderService";
import { useAuth } from "../../context/AuthContext";
import { getDashboardTheme } from "./dashboardTheme";
import { useUISettings } from "../../context/UIContext";

const formatDate = (value, notSetLabel) => {
  if (!value) return notSetLabel;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return notSetLabel;

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getEstimatedEndDate = (medicine, notSetLabel) => {
  const createdAt = medicine?.createdAt ? new Date(medicine.createdAt) : null;
  if (!createdAt || Number.isNaN(createdAt.getTime())) return notSetLabel;

  const dailyDoses = medicine?.schedule?.length || 0;
  const quantity = Number(medicine?.quantity || 0);

  if (!dailyDoses || !quantity) {
    return notSetLabel;
  }

  const durationInDays = Math.ceil(quantity / dailyDoses);
  const estimatedEnd = new Date(createdAt);
  estimatedEnd.setDate(estimatedEnd.getDate() + Math.max(durationInDays - 1, 0));

  return formatDate(estimatedEnd, notSetLabel);
};

function DashBoardShow() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ui = getDashboardTheme(isDark);
  const { user } = useAuth();
  const { t } = useUISettings();
  const [summary, setSummary] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [calendarSchedule, setCalendarSchedule] = useState([]);
  const [apiReminders, setApiReminders] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      const [summaryResult, medicinesResult, scheduleResult, remindersResult] = await Promise.allSettled([
        AxiosWrapper.get("/medicines/daily-summary"),
        AxiosWrapper.get("/medicines"),
        medicationService.getCalendarSchedule(),
        reminderService.getReminders(),
      ]);

      if (summaryResult.status === "fulfilled") {
        setSummary(summaryResult.value.data || null);
      } else {
        console.error("Daily summary load error:", summaryResult.reason);
      }

      if (medicinesResult.status === "fulfilled") {
        const medicinesData = medicinesResult.value.data;
        setMedicines(Array.isArray(medicinesData) ? medicinesData : medicinesData?.data || []);
      } else {
        console.error("Medicines load error:", medicinesResult.reason);
      }

      if (scheduleResult.status === "fulfilled") {
        setCalendarSchedule(Array.isArray(scheduleResult.value) ? scheduleResult.value : []);
      } else {
        console.error("Calendar schedule load error:", scheduleResult.reason);
      }

      if (remindersResult.status === "fulfilled") {
        setApiReminders(Array.isArray(remindersResult.value) ? remindersResult.value : []);
      } else {
        console.error("API reminders load error:", remindersResult.reason);
      }
    };

    loadDashboard();
  }, []);

  const todayMedicineReminders = useMemo(
    () => {
      const scheduleEntries = [...calendarSchedule]
        .filter((entry) => {
          const entryDate = new Date(entry.fullDate || entry.date);
          return !Number.isNaN(entryDate.getTime()) && entryDate.toDateString() === new Date().toDateString();
        })
        .map((entry) => ({
          id: `medicine-${entry.medicineId}-${entry.scheduledTime}-${entry.fullDate || entry.date}`,
          time: entry.scheduledTime || "",
          title: entry.medicine,
          subtitle: entry.dosage || "",
        }));

      const reminderEntries = sortRemindersByTime(
        apiReminders.filter((reminder) => occursOnDate(reminder, new Date()))
      ).map((reminder) => ({
        id: `reminder-${reminder._id}`,
        time: reminder.time || "",
        title: reminder.medicineName,
        subtitle: reminder.dose || "",
      }));

      return [...scheduleEntries, ...reminderEntries].sort((firstEntry, secondEntry) =>
        firstEntry.time.localeCompare(secondEntry.time)
      );
    },
    [apiReminders, calendarSchedule]
  );

  const adherenceValue = summary?.dailyStats?.overallAdherence ?? 0;
  const adherenceMedicines = summary?.medicines || [];

  return (
    <div className="p-6" style={{ color: ui.page.text }}>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {t("dashboard.overview.greeting", { name: user?.firstname || "there" })}
          </h1>
          <p className="mt-1 text-sm" style={{ color: ui.page.muted }}>
            {t("dashboard.overview.subtitle")}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="medications"
            className="px-4 py-2 rounded-lg text-white transition"
            style={{ backgroundColor: ui.page.accent }}
          >
            + {t("dashboard.overview.addMedication")}
          </Link>
          <Link
            to="prescriptions"
            className="px-4 py-2 rounded-lg transition"
            style={{
              backgroundColor: ui.page.panel,
              color: ui.page.text,
              border: `1px solid ${ui.page.border}`,
            }}
          >
            {t("dashboard.overview.uploadPrescription")}
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div
          className="rounded-xl p-5 transition"
          style={{
            backgroundColor: ui.page.panel,
            border: `1px solid ${ui.page.border}`,
            boxShadow: ui.page.shadow,
          }}
        >
          <h2 className="font-semibold mb-3">{t("dashboard.overview.remindersTitle")}</h2>
          <p className="mb-3 text-sm" style={{ color: ui.page.muted }}>
            {todayMedicineReminders.length
              ? t(
                  todayMedicineReminders.length > 1
                    ? "dashboard.overview.remindersCountPlural"
                    : "dashboard.overview.remindersCount",
                  { count: todayMedicineReminders.length }
                )
              : t("dashboard.overview.remindersEmpty")}
          </p>

          {!!todayMedicineReminders.length && (
            <div className="space-y-2">
              {todayMedicineReminders.map((reminder) => (
                <div key={reminder.id} className="text-sm" style={{ color: ui.page.muted }}>
                  <span style={{ color: ui.page.text }}>{reminder.time}</span>
                  {` - ${reminder.title}`}
                  {reminder.subtitle ? ` (${reminder.subtitle})` : ""}
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className="rounded-xl p-5 transition"
          style={{
            backgroundColor: ui.page.panel,
            border: `1px solid ${ui.page.border}`,
            boxShadow: ui.page.shadow,
          }}
        >
          <h2 className="font-semibold mb-3">{t("dashboard.overview.adherenceTitle")}</h2>
          <div className="text-3xl font-bold" style={{ color: ui.page.success }}>
            {adherenceValue}%
          </div>
          <p className="mt-2 text-sm" style={{ color: ui.page.muted }}>
            {t("dashboard.overview.adherenceText")}
          </p>

          {!!adherenceMedicines.length && (
            <div className="mt-3 space-y-2">
              {adherenceMedicines.map((medicine) => (
                <div key={medicine.medicineId} className="text-sm" style={{ color: ui.page.muted }}>
                  <span style={{ color: ui.page.text }}>{medicine.medicineName}</span>
                  {` - ${medicine.taken}/${medicine.total} doses taken today`}
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          className="rounded-xl p-5 transition"
          style={{
            backgroundColor: ui.page.panel,
            border: `1px solid ${ui.page.border}`,
            boxShadow: ui.page.shadow,
          }}
        >
          <h2 className="font-semibold mb-3">{t("dashboard.overview.inventoryTitle")}</h2>
          <p className="mb-3 text-sm" style={{ color: ui.page.muted }}>
            {medicines.length
              ? t(
                  medicines.length > 1
                    ? "dashboard.overview.inventoryCountPlural"
                    : "dashboard.overview.inventoryCount",
                  { count: medicines.length }
                )
              : t("dashboard.overview.inventoryEmpty")}
          </p>

          {!!medicines.length && (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {medicines.map((medicine) => (
                <div key={medicine._id} className="text-sm" style={{ color: ui.page.muted }}>
                  <div style={{ color: ui.page.text }}>
                    {medicine.name}
                    {medicine.dosage ? ` - ${medicine.dosage}` : ""}
                  </div>
                  <div>{t("dashboard.overview.started")}: {formatDate(medicine.createdAt, t("dashboard.overview.notSet"))}</div>
                  <div>{t("dashboard.overview.estimatedEnd")}: {getEstimatedEndDate(medicine, t("dashboard.overview.notSet"))}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashBoardShow;
