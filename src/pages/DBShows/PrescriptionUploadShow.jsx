import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Tesseract from "tesseract.js";
import AxiosWrapper from "../../Https/AxiosWrapper";
import medicationService from "../../Https/medicationService";
import { getDashboardTheme } from "./dashboardTheme";
import { useUISettings } from "../../context/UIContext";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const SAVE_ENDPOINT = "/save-prescription";
const ACCEPTED_TYPES = ["image/png", "image/jpeg"];

const createMedicationRow = (medicine = {}) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  name: medicine.name || "",
  dosage: medicine.dosage || "",
  frequency: medicine.frequency || "",
  duration: medicine.duration || "",
});

const parseScannedTextToRows = (text) => {
  const cleanedLines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const uniqueRows = [];

  cleanedLines.forEach((line) => {
    if (line.length < 4) return;

    const dosageMatch = line.match(/(\d+\s?(mg|ml|mcg|g|tab|tabs|tablet|tablets|capsule|capsules|cap))/i);
    const frequencyMatch = line.match(/(once daily|twice daily|daily|weekly|every \d+ hours?|\d+\s?times?\s?(daily)?|morning|evening|night)/i);
    const durationMatch = line.match(/(\d+\s?(day|days|week|weeks|month|months))/i);

    const name = line
      .replace(dosageMatch?.[0] || "", "")
      .replace(frequencyMatch?.[0] || "", "")
      .replace(durationMatch?.[0] || "", "")
      .replace(/[-:]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!name || uniqueRows.some((row) => row.name.toLowerCase() === name.toLowerCase())) return;

    uniqueRows.push(
      createMedicationRow({
        name,
        dosage: dosageMatch?.[0] || "",
        frequency: frequencyMatch?.[0] || "",
        duration: durationMatch?.[0] || "",
      })
    );
  });

  return uniqueRows;
};

function UploadDropzone({
  ui,
  isDragging,
  isUploading,
  selectedFile,
  previewUrl,
  error,
  onDragEvents,
  onBrowseClick,
}) {
  return (
    <div
      className="rounded-3xl border-2 border-dashed p-8 transition"
      style={{
        backgroundColor: isDragging ? ui.nav.activeBg : ui.page.panelAlt,
        borderColor: isDragging ? ui.page.accent : ui.page.borderStrong,
      }}
      onDragEnter={onDragEvents.onDragEnter}
      onDragOver={onDragEvents.onDragOver}
      onDragLeave={onDragEvents.onDragLeave}
      onDrop={onDragEvents.onDrop}
    >
      <div className="mx-auto max-w-2xl text-center">
        <div
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-2xl"
          style={{
            backgroundColor: ui.nav.activeBg,
            color: ui.page.accent,
          }}
        >
          +
        </div>
        <h2 className="text-2xl font-semibold">Upload Prescription</h2>
        <p className="mt-3 text-sm" style={{ color: ui.page.muted }}>
          Drag and drop a PNG or JPG file here, or browse from your device.
        </p>
        <p className="mt-2 text-xs" style={{ color: ui.page.muted }}>
          Maximum file size: 5MB
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onBrowseClick}
            disabled={isUploading}
            className="rounded-xl px-5 py-3 text-sm font-medium text-white transition disabled:opacity-60"
            style={{ backgroundColor: ui.page.accent }}
          >
            Choose File
          </button>
        </div>

        {error && (
          <p className="mt-4 text-sm" style={{ color: ui.page.danger }}>
            {error}
          </p>
        )}

        {!selectedFile && !error && (
          <div
            className="mt-6 rounded-2xl border p-6 text-sm"
            style={{ borderColor: ui.page.border, color: ui.page.muted }}
          >
            No prescription uploaded yet. Once parsed, your medications will appear below for review.
          </div>
        )}

        {selectedFile && (
          <div
            className="mt-6 rounded-2xl border p-4 text-left"
            style={{
              borderColor: ui.page.border,
              backgroundColor: ui.page.panel,
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="mt-1 text-sm" style={{ color: ui.page.muted }}>
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <div
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  backgroundColor: ui.nav.activeBg,
                  color: ui.page.accent,
                }}
              >
                Image
              </div>
            </div>

            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Prescription preview"
                className="mt-4 max-h-72 w-full rounded-2xl object-contain"
                style={{ backgroundColor: ui.page.input }}
              />
            ) : (
              <div
                className="mt-4 rounded-2xl border px-4 py-8 text-center text-sm"
                style={{
                  borderColor: ui.page.border,
                  backgroundColor: ui.page.input,
                  color: ui.page.muted,
                }}
              >
                Image preview is unavailable, but the file is ready to upload.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EditableMedicationTable({ ui, rows, onChange, onAddRow, onRemoveRow }) {
  return (
    <div
      className="rounded-3xl border p-6"
      style={{
        borderColor: ui.page.border,
        backgroundColor: ui.page.panel,
        boxShadow: ui.page.shadow,
      }}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Extracted Medications</h2>
          <p className="mt-1 text-sm" style={{ color: ui.page.muted }}>
            Review the parsed results, edit any field, or add medications manually before saving.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddRow}
          className="rounded-xl px-4 py-2 text-sm font-medium text-white transition"
          style={{ backgroundColor: ui.page.accent }}
        >
          Add Medication
        </button>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border md:block" style={{ borderColor: ui.page.border }}>
        <table className="w-full border-collapse">
          <thead style={{ backgroundColor: ui.page.panelAlt }}>
            <tr>
              {["Medication", "Dosage", "Frequency", "Duration", "Actions"].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-sm font-semibold"
                  style={{ color: ui.page.text }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} style={{ borderTop: `1px solid ${ui.page.border}` }}>
                {["name", "dosage", "frequency", "duration"].map((field) => (
                  <td key={field} className="px-4 py-3 align-top">
                    <input
                      type="text"
                      value={row[field]}
                      onChange={(event) => onChange(row.id, field, event.target.value)}
                      className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
                      style={{
                        backgroundColor: ui.page.input,
                        borderColor: ui.page.borderStrong,
                        color: ui.page.text,
                      }}
                    />
                  </td>
                ))}
                <td className="px-4 py-3 align-top">
                  <button
                    type="button"
                    onClick={() => onRemoveRow(row.id)}
                    className="rounded-xl px-3 py-2 text-sm font-medium text-white"
                    style={{ backgroundColor: ui.page.danger }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:hidden">
        {rows.map((row, index) => (
          <div
            key={row.id}
            className="rounded-2xl border p-4"
            style={{ borderColor: ui.page.border, backgroundColor: ui.page.panelAlt }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-medium">Medication {index + 1}</h3>
              <button
                type="button"
                onClick={() => onRemoveRow(row.id)}
                className="rounded-lg px-3 py-2 text-sm text-white"
                style={{ backgroundColor: ui.page.danger }}
              >
                Remove
              </button>
            </div>

            <div className="grid gap-3">
              {[
                { key: "name", label: "Medication" },
                { key: "dosage", label: "Dosage" },
                { key: "frequency", label: "Frequency" },
                { key: "duration", label: "Duration" },
              ].map((field) => (
                <label key={field.key} className="text-sm">
                  <span className="mb-1 block" style={{ color: ui.page.muted }}>
                    {field.label}
                  </span>
                  <input
                    type="text"
                    value={row[field.key]}
                    onChange={(event) => onChange(row.id, field.key, event.target.value)}
                    className="w-full rounded-xl border px-3 py-2 outline-none"
                    style={{
                      backgroundColor: ui.page.input,
                      borderColor: ui.page.borderStrong,
                      color: ui.page.text,
                    }}
                  />
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PrescriptionUploadShow() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const ui = getDashboardTheme(isDark);
  const { t } = useUISettings();
  const inputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicineId, setSelectedMedicineId] = useState("");

  useEffect(() => {
    const loadMedicines = async () => {
      try {
        const medicinesData = await medicationService.getMedicines();
        setMedicines(medicinesData);
        if (medicinesData[0]?._id) {
          setSelectedMedicineId(medicinesData[0]._id);
        }
      } catch (err) {
        console.error("Could not load medicines for prescription upload:", err);
      }
    };

    loadMedicines();
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const hasRows = rows.length > 0;

  const stats = useMemo(
    () => ({
      total: rows.length,
      completed: rows.filter((row) => row.name.trim()).length,
    }),
    [rows]
  );

  const validateFile = (file) => {
    if (!file) {
      return "Please choose a prescription file.";
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "The current API accepts images only. Please upload a PNG or JPG file.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "File size must be 5MB or less.";
    }

    return "";
  };

  const handleSelectFile = (file) => {
    const validationError = validateFile(file);
    setError(validationError);
    setSuccess("");

    if (validationError) {
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleInputChange = (event) => {
    handleSelectFile(event.target.files?.[0] || null);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    handleSelectFile(event.dataTransfer.files?.[0] || null);
  };

  const parseResponseRows = (data) => {
    if (Array.isArray(data)) {
      return data.map(createMedicationRow);
    }

    if (Array.isArray(data?.medications)) {
      return data.medications.map(createMedicationRow);
    }

    if (Array.isArray(data?.data)) {
      return data.data.map(createMedicationRow);
    }

    return [];
  };

  const handleUploadAndParse = async () => {
    const validationError = validateFile(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!selectedMedicineId) {
      setError("Please choose a medication first before uploading a prescription image.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("prescription", selectedFile);

    try {
      const { data } = await AxiosWrapper.post(`/medicines/upload-prescription/${selectedMedicineId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return;
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(Math.min(progress, 40));
        },
      });

      const scannedResult = await Tesseract.recognize(selectedFile, "eng", {
        logger: (message) => {
          if (message.status === "recognizing text" && typeof message.progress === "number") {
            setUploadProgress(40 + Math.round(message.progress * 60));
          }
        },
      });

      const nextRows = parseResponseRows(data).length
        ? parseResponseRows(data)
        : parseScannedTextToRows(scannedResult.data?.text || "");

      if (!nextRows.length) {
        setUploadProgress(100);
        setSuccess("Prescription image uploaded successfully.");
        setError("The OCR scan could not extract clear medication rows from this image. Try a clearer, straight image.");
        return;
      }

      setRows(nextRows);
      setUploadProgress(100);
      setSuccess("Prescription parsed successfully. Review the extracted medications below.");
    } catch (err) {
      console.error("Prescription upload error:", err);
      setError(err.response?.data?.message || "Could not upload and parse the prescription.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRowChange = (rowId, field, value) => {
    setRows((currentRows) =>
      currentRows.map((row) => (row.id === rowId ? { ...row, [field]: value } : row))
    );
  };

  const handleAddRow = () => {
    setRows((currentRows) => [...currentRows, createMedicationRow()]);
  };

  const handleRemoveRow = (rowId) => {
    setRows((currentRows) => currentRows.filter((row) => row.id !== rowId));
  };

  const handleSavePrescription = async () => {
    const cleanedRows = rows
      .map((row) => ({
        name: row.name.trim(),
        dosage: row.dosage.trim(),
        frequency: row.frequency.trim(),
        duration: row.duration.trim(),
      }))
      .filter((row) => row.name);

    if (!cleanedRows.length) {
      setError(t("dashboard.prescriptions.saveValidation"));
      setSuccess("");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      await AxiosWrapper.post(SAVE_ENDPOINT, cleanedRows);
      setSuccess("Prescription medications saved successfully.");
    } catch (err) {
      console.error("Save prescription error:", err);
      setError(err.response?.data?.message || "Could not save prescription medications.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: ui.page.background }}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: ui.page.text }}>{t("dashboard.prescriptions.title")}</h1>
            <p className="mt-2 text-sm" style={{ color: ui.page.muted }}>
              {t("dashboard.prescriptions.subtitle")}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleUploadAndParse}
              disabled={!selectedFile || isUploading}
              className="rounded-xl px-5 py-3 text-sm font-medium text-white transition disabled:opacity-60"
              style={{ backgroundColor: ui.page.accent }}
            >
              {isUploading ? t("dashboard.medications.saving") : t("dashboard.prescriptions.uploadParse")}
            </button>
            <button
              type="button"
              onClick={handleSavePrescription}
              disabled={!hasRows || isSaving || isUploading}
              className="rounded-xl px-5 py-3 text-sm font-medium text-white transition disabled:opacity-60"
              style={{ backgroundColor: ui.page.success }}
            >
              {isSaving ? t("dashboard.medications.saving") : t("dashboard.prescriptions.savePrescription")}
            </button>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg"
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <UploadDropzone
            ui={ui}
            isDragging={isDragging}
            isUploading={isUploading}
            selectedFile={selectedFile}
            previewUrl={previewUrl}
            error={error}
            onDragEvents={{
              onDragEnter: handleDragEnter,
              onDragOver: handleDragOver,
              onDragLeave: handleDragLeave,
              onDrop: handleDrop,
            }}
            onBrowseClick={() => inputRef.current?.click()}
          />

          <div className="grid gap-6">
            <div
              className="rounded-3xl border p-6"
              style={{
                borderColor: ui.page.border,
                backgroundColor: ui.page.panel,
                boxShadow: ui.page.shadow,
              }}
            >
              <h2 className="text-lg font-semibold">Attach to medication</h2>
              <p className="mt-2 text-sm" style={{ color: ui.page.muted }}>
                The current upload API stores the prescription image on an existing medication record.
              </p>
              <select
                value={selectedMedicineId}
                onChange={(event) => setSelectedMedicineId(event.target.value)}
                className="mt-4 w-full rounded-xl border px-3 py-3 outline-none"
                style={{
                  backgroundColor: ui.page.input,
                  borderColor: ui.page.borderStrong,
                  color: ui.page.text,
                }}
              >
                <option value="">Select medication</option>
                {medicines.map((medicine) => (
                  <option key={medicine._id} value={medicine._id}>
                    {medicine.name}{medicine.dosage ? ` - ${medicine.dosage}` : ""}
                  </option>
                ))}
              </select>
            </div>

            <div
              className="rounded-3xl border p-6"
              style={{
                borderColor: ui.page.border,
                backgroundColor: ui.page.panel,
                boxShadow: ui.page.shadow,
              }}
            >
              <h2 className="text-lg font-semibold">Processing Status</h2>
              <div className="mt-4 overflow-hidden rounded-full" style={{ backgroundColor: ui.page.panelAlt }}>
                <div
                  className="h-3 rounded-full transition-all"
                  style={{
                    width: `${uploadProgress}%`,
                    backgroundColor: ui.page.accent,
                  }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span style={{ color: ui.page.muted }}>
                  {isUploading ? "Uploading and parsing prescription..." : "Ready"}
                </span>
                <span style={{ color: ui.page.text }}>{uploadProgress}%</span>
              </div>
            </div>

            <div
              className="rounded-3xl border p-6"
              style={{
                borderColor: ui.page.border,
                backgroundColor: ui.page.panel,
                boxShadow: ui.page.shadow,
              }}
            >
              <h2 className="text-lg font-semibold">Summary</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div
                  className="rounded-2xl p-4"
                  style={{ backgroundColor: ui.page.panelAlt, border: `1px solid ${ui.page.border}` }}
                >
                  <p className="text-sm" style={{ color: ui.page.muted }}>
                    Extracted rows
                  </p>
                  <p className="mt-2 text-2xl font-bold">{stats.total}</p>
                </div>
                <div
                  className="rounded-2xl p-4"
                  style={{ backgroundColor: ui.page.panelAlt, border: `1px solid ${ui.page.border}` }}
                >
                  <p className="text-sm" style={{ color: ui.page.muted }}>
                    Rows with names
                  </p>
                  <p className="mt-2 text-2xl font-bold">{stats.completed}</p>
                </div>
              </div>

              {success && (
                <p className="mt-4 text-sm" style={{ color: ui.page.success }}>
                  {success}
                </p>
              )}
            </div>
          </div>
        </div>

        {hasRows ? (
          <div className="mt-6">
            <EditableMedicationTable
              ui={ui}
              rows={rows}
              onChange={handleRowChange}
              onAddRow={handleAddRow}
              onRemoveRow={handleRemoveRow}
            />
          </div>
        ) : (
          <div
            className="mt-6 rounded-3xl border p-10 text-center"
            style={{
              borderColor: ui.page.border,
              backgroundColor: ui.page.panel,
              boxShadow: ui.page.shadow,
            }}
          >
            <h2 className="text-xl font-semibold">No extracted medications yet</h2>
            <p className="mt-3 text-sm" style={{ color: ui.page.muted }}>
              Upload a prescription to see parsed medications here, then edit and save them.
            </p>
            <button
              type="button"
              onClick={handleAddRow}
              className="mt-5 rounded-xl px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: ui.page.accent }}
            >
              Add Manually
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
