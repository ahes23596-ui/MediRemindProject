import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import medicationService from "../../Https/medicationService";
import { getDashboardTheme } from "./dashboardTheme";
import { useUISettings } from "../../context/UIContext";

const isTakenToday = (medicine, time) => {
  const today = new Date().toDateString();
  return (medicine.history || []).some(
    (entry) =>
      new Date(entry.date).toDateString() === today &&
      entry.time === time &&
      entry.taken === true
  );
};

const getMedicineFrequency = (medicine, t) => {
  const schedule = medicine?.schedule || [];
  if (!schedule.length) return t("dashboard.medications.notSet");
  if (schedule.length === 1) return t("dashboard.medications.onceDaily");
  if (schedule.length === 2) return t("dashboard.medications.twiceDaily");
  return t("dashboard.medications.timesDaily", { count: schedule.length });
};

function StatusCard({ title, value, helper, ui, tone = "default" }) {
  const toneMap = {
    default: ui.page.accent,
    warning: "#f59e0b",
    danger: ui.page.danger,
    success: ui.page.success,
  };

  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        backgroundColor: ui.page.panel,
        borderColor: ui.page.border,
        boxShadow: ui.page.shadow,
      }}
    >
      <p className="text-sm" style={{ color: ui.page.muted }}>
        {title}
      </p>
      <p className="mt-3 text-3xl font-bold" style={{ color: toneMap[tone] }}>
        {value}
      </p>
      <p className="mt-2 text-sm" style={{ color: ui.page.muted }}>
        {helper}
      </p>
    </div>
  );
}

function SectionCard({ title, subtitle, children, ui, action }) {
  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        backgroundColor: ui.page.panel,
        borderColor: ui.page.border,
        boxShadow: ui.page.shadow,
      }}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-sm" style={{ color: ui.page.muted }}>
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function StateBlock({ loading, error, onRetry, emptyMessage, hasItems, children, ui }) {
  if (loading) {
    return <p style={{ color: ui.page.muted }}>Loading...</p>;
  }

  if (error) {
    return (
      <div
        className="rounded-xl border p-4"
        style={{ borderColor: ui.page.border, backgroundColor: ui.page.panelAlt }}
      >
        <p className="text-sm" style={{ color: ui.page.danger }}>
          {error}
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-lg px-4 py-2 text-sm text-white"
          style={{ backgroundColor: ui.page.accent }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!hasItems) {
    return (
      <div
        className="rounded-xl border p-5 text-sm"
        style={{ borderColor: ui.page.border, backgroundColor: ui.page.panelAlt, color: ui.page.muted }}
      >
        {emptyMessage}
      </div>
    );
  }

  return children;
}

export default function MedicationsShow() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ui = getDashboardTheme(isDark);
  const { t } = useUISettings();

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [times, setTimes] = useState(["08:00"]);
  const [medicines, setMedicines] = useState([]);
  const [missedDoses, setMissedDoses] = useState([]);
  const [refillAlerts, setRefillAlerts] = useState([]);
  const [formLoading, setFormLoading] = useState(false);
  const [medicinesLoading, setMedicinesLoading] = useState(true);
  const [missedLoading, setMissedLoading] = useState(true);
  const [refillLoading, setRefillLoading] = useState(true);
  const [medicinesError, setMedicinesError] = useState("");
  const [missedError, setMissedError] = useState("");
  const [refillError, setRefillError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [markingDoseKey, setMarkingDoseKey] = useState("");

  const inputStyle = {
    backgroundColor: ui.page.input,
    borderColor: ui.page.borderStrong,
    color: ui.page.text,
  };

  const resetForm = () => {
    setName("");
    setDosage("");
    setQuantity(0);
    setTimes(["08:00"]);
  };

  const loadMedicines = async () => {
    setMedicinesLoading(true);
    setMedicinesError("");

    try {
      const data = await medicationService.getMedicines();
      setMedicines(data);
    } catch (err) {
      console.error("Medicines load error:", err);
      setMedicinesError("Could not load medications.");
    } finally {
      setMedicinesLoading(false);
    }
  };

  const loadMissedDoses = async () => {
    setMissedLoading(true);
    setMissedError("");

    try {
      const data = await medicationService.getMissedDoses();
      setMissedDoses(data);
    } catch (err) {
      console.error("Missed doses load error:", err);
      setMissedError("Could not load missed doses.");
    } finally {
      setMissedLoading(false);
    }
  };

  const loadRefillAlerts = async () => {
    setRefillLoading(true);
    setRefillError("");

    try {
      const data = await medicationService.getRefillAlerts();
      setRefillAlerts(data);
    } catch (err) {
      console.error("Refill alerts load error:", err);
      setRefillError("Could not load refill alerts.");
    } finally {
      setRefillLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
    loadMissedDoses();
    loadRefillAlerts();
  }, []);

  const todayTakenCount = useMemo(
    () =>
      medicines.reduce(
        (count, medicine) =>
          count + (medicine.schedule || []).filter((time) => isTakenToday(medicine, time)).length,
        0
      ),
    [medicines]
  );

  const handleAddMedication = async () => {
    setFormLoading(true);
    setFormError("");
    setSuccess("");

    const payload = {
      name: name.trim(),
      dosage: dosage.trim(),
      schedule: times.filter(Boolean),
      quantity,
    };

    if (!payload.name || !payload.dosage || payload.schedule.length === 0) {
      setFormError(t("dashboard.medications.requiredError"));
      setFormLoading(false);
      return;
    }

    try {
      const data = await medicationService.addMedicine(payload);
      setSuccess(t("dashboard.medications.successAdd"));
      resetForm();
      if (data?.medicine) {
        setMedicines((currentMedicines) => [data.medicine, ...currentMedicines]);
      } else {
        await loadMedicines();
      }
    } catch (err) {
      console.error("Add medication error:", err);
      setFormError(err.response?.data?.message || t("dashboard.medications.addError"));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteMedication = async (medicineId) => {
    setFormError("");

    try {
      await medicationService.deleteMedicine(medicineId);
      await loadMedicines();
      await loadRefillAlerts();
    } catch (err) {
      console.error("Delete medication error:", err);
      setFormError(t("dashboard.medications.deleteError"));
    }
  };

  const markDoseTaken = async (medicineId, time) => {
    const optimisticDate = new Date().toISOString();
    const optimisticKey = `${medicineId}-${time}`;
    const previousMedicines = medicines;

    setFormError("");
    setSuccess("");
    setMarkingDoseKey(optimisticKey);
    setMedicines((currentMedicines) =>
      currentMedicines.map((medicine) =>
        medicine._id !== medicineId
          ? medicine
          : {
              ...medicine,
              history: [
                ...(medicine.history || []),
                {
                  time,
                  date: optimisticDate,
                  taken: true,
                },
              ],
            }
      )
    );

    try {
      await medicationService.markTaken(medicineId, time);
      setSuccess(t("dashboard.medications.doseSaved"));
      await Promise.all([loadMedicines(), loadMissedDoses(), loadRefillAlerts()]);
    } catch (err) {
      console.error("Mark dose error:", err);
      setMedicines(previousMedicines);
      setFormError(err.response?.data?.message || t("dashboard.medications.doseError"));
    } finally {
      setMarkingDoseKey("");
    }
  };

  return (
    <div
      className="min-h-screen p-6 flex justify-center"
      style={{ backgroundColor: ui.page.background }}
    >
      <div
        className="w-full max-w-5xl rounded-2xl shadow-lg p-8"
        style={{
          backgroundColor: ui.page.panel,
          color: ui.page.text,
          border: `1px solid ${ui.page.border}`,
          boxShadow: ui.page.shadow,
        }}
      >
        <h1 className="text-3xl font-bold mb-2">{t("dashboard.medications.title")}</h1>
        <p className="mb-8 opacity-70">
          {t("dashboard.medications.subtitle")}
        </p>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <StatusCard
            title={t("dashboard.medications.active")}
            value={medicines.length}
            helper={t("dashboard.medications.trackedHelper")}
            ui={ui}
          />
          <StatusCard
            title={t("dashboard.medications.takenToday")}
            value={todayTakenCount}
            helper={t("dashboard.medications.takenHelper")}
            ui={ui}
            tone="success"
          />
          <StatusCard
            title={t("dashboard.medications.refillAlerts")}
            value={refillAlerts.length}
            helper={t("dashboard.medications.refillHelper")}
            ui={ui}
            tone="warning"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <SectionCard
              title={t("dashboard.medications.addTitle")}
              subtitle={t("dashboard.medications.addSubtitle")}
              ui={ui}
            >
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <input
                  type="text"
                  placeholder={t("dashboard.medications.medicationName")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-3 rounded-lg border"
                  style={inputStyle}
                />
                <input
                  type="text"
                  placeholder={t("dashboard.medications.dosage")}
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="p-3 rounded-lg border"
                  style={inputStyle}
                />
                <input
                  type="number"
                  placeholder={t("dashboard.medications.quantity")}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="p-3 rounded-lg border"
                  style={inputStyle}
                />
              </div>

              <div
                className="rounded-xl p-5"
                style={{ backgroundColor: ui.page.panelAlt, border: `1px solid ${ui.page.border}` }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{t("dashboard.medications.schedule")}</h3>
                  <button
                    type="button"
                    onClick={() => setTimes([...times, "08:00"])}
                    className="px-4 py-2 rounded-lg text-white transition"
                    style={{ backgroundColor: ui.page.accent }}
                  >
                    {t("dashboard.medications.addTime")}
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {times.map((time, idx) => (
                    <div key={idx} className="flex gap-3">
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => {
                          const newTimes = [...times];
                          newTimes[idx] = e.target.value;
                          setTimes(newTimes);
                        }}
                        className="flex-1 p-3 rounded-lg border"
                        style={inputStyle}
                      />
                      {times.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setTimes(times.filter((_, timeIndex) => timeIndex !== idx))}
                          className="px-4 rounded-lg text-white"
                          style={{ backgroundColor: ui.page.danger }}
                        >
                          X
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {formError && <p className="mt-4 text-sm text-red-500">{formError}</p>}
              {success && <p className="mt-4 text-sm text-green-500">{success}</p>}
              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className={`${isDark ? "text-white" : "text-black"} px-6 py-2 rounded-lg transition`}
                  style={{
                    backgroundColor: ui.page.panelAlt,
                    color: ui.page.text,
                    border: `1px solid ${ui.page.border}`,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddMedication}
                  disabled={formLoading}
                  className="px-6 py-2 rounded-lg text-white transition disabled:opacity-50"
                  style={{ backgroundColor: ui.page.accent }}
                >
                  {formLoading ? "Saving..." : "Add Medication"}
                  
                </button>
              </div>
            </SectionCard>

            <SectionCard
              title={t("dashboard.medications.listTitle")}
              subtitle={t("dashboard.medications.listSubtitle")}
              ui={ui}
              action={
                <button
                  type="button"
                  onClick={loadMedicines}
                  className="rounded-lg px-4 py-2 text-sm text-white"
                  style={{ backgroundColor: ui.page.accent }}
                >
                  {t("common.refresh")}
                </button>
              }
            >
              <StateBlock
                loading={medicinesLoading}
                error={medicinesError}
                onRetry={loadMedicines}
                emptyMessage={t("dashboard.medications.emptyList")}
                hasItems={medicines.length > 0}
                ui={ui}
              >
                <div className="grid gap-4">
                  {medicines.map((medicine) => (
                    <div
                      key={medicine._id}
                      className="rounded-xl border p-4"
                      style={{
                        backgroundColor: ui.page.panelAlt,
                        borderColor: ui.page.border,
                        color: ui.page.text,
                      }}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-semibold">{medicine.name}</h3>
                            <span
                              className="rounded-full px-3 py-1 text-xs font-medium"
                              style={{
                                backgroundColor: ui.nav.activeBg,
                                color: ui.page.accent,
                              }}
                            >
                              {getMedicineFrequency(medicine, t)}
                            </span>
                          </div>
                          <p className="mt-1 opacity-70">{medicine.dosage}</p>
                          <p className="mt-2 text-sm opacity-70">
                            {t("dashboard.medications.quantityValue")}: {medicine.quantity || 0}
                          </p>
                          <p className="mt-1 text-sm opacity-70">
                            {t("dashboard.medications.times")}: {(medicine.schedule || []).join(", ") || t("dashboard.medications.notSet")}
                          </p>
                          {medicine.notes && <p className="mt-2 text-sm opacity-80">{medicine.notes}</p>}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteMedication(medicine._id)}
                          className="rounded-lg px-4 py-2 text-sm text-white"
                          style={{ backgroundColor: ui.page.danger }}
                        >
                          {t("dashboard.medications.deleteAction")}
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {(medicine.schedule || []).map((time) => {
                          const doseTaken = isTakenToday(medicine, time);
                          const actionKey = `${medicine._id}-${time}`;

                          return (
                            <button
                              key={actionKey}
                              type="button"
                              onClick={() => markDoseTaken(medicine._id, time)}
                              disabled={doseTaken || markingDoseKey === actionKey}
                              className="rounded-full px-4 py-2 text-sm text-white transition disabled:opacity-60"
                              style={{
                                backgroundColor: doseTaken ? ui.page.success : ui.page.accent,
                              }}
                            >
                              {markingDoseKey === actionKey
                                ? t("dashboard.medications.saving")
                                : doseTaken
                                  ? t("dashboard.medications.takenAt", { time })
                                  : t("dashboard.medications.markTaken", { time })}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </StateBlock>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard
              title={t("dashboard.medications.missedTitle")}
              subtitle={t("dashboard.medications.missedSubtitle")}
              ui={ui}
              action={
                <button
                  type="button"
                  onClick={loadMissedDoses}
                  className="rounded-lg px-4 py-2 text-sm text-white"
                  style={{ backgroundColor: ui.page.accent }}
                >
                  {t("common.refresh")}
                </button>
              }
            >
              <StateBlock
                loading={missedLoading}
                error={missedError}
                onRetry={loadMissedDoses}
                emptyMessage={t("dashboard.medications.missedEmpty")}
                hasItems={missedDoses.length > 0}
                ui={ui}
              >
                <div className="space-y-3">
                  {missedDoses.map((missed, index) => (
                    <div
                      key={`${missed.medicineId || missed.name || "missed"}-${index}`}
                      className="rounded-xl border p-4"
                      style={{
                        borderColor: "#fecaca",
                        backgroundColor: isDark ? "rgba(127, 29, 29, 0.18)" : "#fef2f2",
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{missed.medicineName || missed.name || "Medication"}</p>
                          <p className="mt-1 text-sm" style={{ color: ui.page.muted }}>
                            {t("dashboard.medications.missedTime")}: {missed.scheduledTime || missed.time || t("dashboard.medications.notSet")}
                          </p>
                        </div>
                        <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                          {t("dashboard.medications.missedLabel")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </StateBlock>
            </SectionCard>

            <SectionCard
              title={t("dashboard.medications.refillTitle")}
              subtitle={t("dashboard.medications.refillSubtitle")}
              ui={ui}
              action={
                <button
                  type="button"
                  onClick={loadRefillAlerts}
                  className="rounded-lg px-4 py-2 text-sm text-white"
                  style={{ backgroundColor: ui.page.accent }}
                >
                  {t("common.refresh")}
                </button>
              }
            >
              <StateBlock
                loading={refillLoading}
                error={refillError}
                onRetry={loadRefillAlerts}
                emptyMessage={t("dashboard.medications.refillEmpty")}
                hasItems={refillAlerts.length > 0}
                ui={ui}
              >
                <div className="space-y-3">
                  {refillAlerts.map((alert, index) => (
                    <div
                      key={`${alert.medicineId || alert.name || "refill"}-${index}`}
                      className="rounded-xl border p-4"
                      style={{
                        borderColor: "#fcd34d",
                        backgroundColor: isDark ? "rgba(120, 53, 15, 0.18)" : "#fffbeb",
                      }}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold">{alert.medicineName || alert.name || "Medication"}</p>
                          <p className="mt-1 text-sm" style={{ color: ui.page.muted }}>
                            {t("dashboard.medications.remaining")}: {alert.remainingQuantity ?? alert.quantity ?? t("dashboard.medications.notSet")}
                          </p>
                        </div>
                        <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
                          {t("dashboard.medications.refillLabel")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </StateBlock>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}
