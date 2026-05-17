import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../context/AuthContext";
import { getDashboardTheme } from "./dashboardTheme";
import { useUISettings } from "../../context/UIContext";

export default function AccountShow() {
  const { user, updateProfileName } = useAuth();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ui = getDashboardTheme(isDark);
  const { t } = useUISettings();
  const [fullName, setFullName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);

  const resolvedFullName = useMemo(
    () => [user?.firstname, user?.lastname].filter(Boolean).join(" ").trim(),
    [user?.firstname, user?.lastname]
  );

  useEffect(() => {
    setFullName(resolvedFullName);
  }, [resolvedFullName]);

  const handleSaveName = async () => {
    const trimmedName = fullName.trim();
    const nameParts = trimmedName.split(/\s+/).filter(Boolean);

    if (nameParts.length < 2) {
      setStatusMessage(t("dashboard.account.fullNameValidation"));
      return;
    }

    const firstname = nameParts.shift();
    const lastname = nameParts.join(" ");

    try {
      setIsSavingName(true);
      await updateProfileName({ firstname, lastname });
      setStatusMessage(t("dashboard.account.fullNameSaved"));
      setIsEditingName(false);
    } catch (error) {
      setStatusMessage(error.response?.data?.message || error.message || "Could not update full name.");
    } finally {
      setIsSavingName(false);
    }
  };

  return (
    <div
      className="max-w-2xl rounded-2xl border p-8 shadow-sm"
      style={{
        backgroundColor: ui.page.panel,
        borderColor: ui.page.border,
        color: ui.page.text,
        boxShadow: ui.page.shadow,
      }}
    >
      <h1 className="text-2xl font-bold">{t("dashboard.account.title")}</h1>
      <p className="mt-2" style={{ color: ui.page.muted }}>
        {t("dashboard.account.subtitle")}
      </p>

      <div className="mt-8 grid gap-4">
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: ui.page.panelAlt, border: `1px solid ${ui.page.border}` }}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex-1">
              <p className="text-sm" style={{ color: ui.page.muted }}>
                {t("dashboard.account.fullName")}
              </p>
              {isEditingName ? (
                <div className="mt-3 space-y-3">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => {
                      setFullName(event.target.value);
                      if (statusMessage) setStatusMessage("");
                    }}
                    className="w-full rounded-lg border px-3 py-2"
                    style={{
                      backgroundColor: ui.page.input,
                      borderColor: ui.page.borderStrong,
                      color: ui.page.text,
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleSaveName}
                      disabled={isSavingName}
                      className="rounded-lg px-4 py-2 text-sm text-white"
                      style={{ backgroundColor: ui.page.accent }}
                    >
                      {isSavingName ? t("dashboard.medications.saving") : t("dashboard.account.saveFullName")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFullName(resolvedFullName);
                        setStatusMessage("");
                        setIsEditingName(false);
                      }}
                      disabled={isSavingName}
                      className="rounded-lg px-4 py-2 text-sm"
                      style={{
                        backgroundColor: ui.page.panel,
                        color: ui.page.text,
                        border: `1px solid ${ui.page.border}`,
                      }}
                    >
                      {t("common.cancel")}
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-lg font-semibold">{resolvedFullName || t("dashboard.account.unavailable")}</p>
              )}
            </div>
            {!isEditingName && (
              <button
                type="button"
                onClick={() => {
                  setFullName(resolvedFullName);
                  setStatusMessage("");
                  setIsEditingName(true);
                }}
                className="rounded-lg px-4 py-2 text-sm text-white"
                style={{ backgroundColor: ui.page.accent }}
              >
                {t("dashboard.account.editFullName")}
              </button>
            )}
          </div>
          {statusMessage && (
            <p
              className="mt-3 text-sm"
              style={{
                color:
                  statusMessage === t("dashboard.account.fullNameSaved") ? ui.page.success : ui.page.danger,
              }}
            >
              {statusMessage}
            </p>
          )}
        </div>
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: ui.page.panelAlt, border: `1px solid ${ui.page.border}` }}
        >
          <p className="text-sm" style={{ color: ui.page.muted }}>
            {t("dashboard.account.username")}
          </p>
          <p className="text-lg font-semibold">{user?.username || t("dashboard.account.unavailable")}</p>
        </div>
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: ui.page.panelAlt, border: `1px solid ${ui.page.border}` }}
        >
          <p className="text-sm" style={{ color: ui.page.muted }}>
            {t("dashboard.account.status")}
          </p>
          <p className="text-lg font-semibold text-emerald-600">{t("dashboard.account.authenticated")}</p>
        </div>
      </div>
    </div>
  );
}
