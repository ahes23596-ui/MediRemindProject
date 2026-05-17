import React, { useState } from "react";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";
import { useUISettings } from "../../context/UIContext";

function ForgotPassword() {
  const { t } = useUISettings();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage(t("auth.forgot.success", { email }));
  };

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-24">
      <div className="surface-card w-full max-w-xl rounded-[2rem] p-6 text-center md:p-10" style={{ backgroundColor: "var(--surface-strong)" }}>
        <div className="flex justify-center">
          <IconButton color="primary" size="large">
            <AddBoxIcon color="primary" style={{ fontSize: 56 }} />
          </IconButton>
        </div>
        <h1 className="mt-4 text-3xl font-extrabold" style={{ color: "var(--text)" }}>
          {t("auth.forgot.title")}
        </h1>
        <p className="mt-4 text-sm leading-7 md:text-base" style={{ color: "var(--text-muted)" }}>
          {t("auth.forgot.subtitle")}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 text-start">
          <label className="block text-sm font-semibold" style={{ color: "var(--text)" }}>
            {t("auth.forgot.email")}
            <input
              type="email"
              required
              placeholder={t("auth.forgot.placeholder")}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field-input mt-2"
            />
          </label>
          <button type="submit" className="btn-primary mt-5 w-full">
            {t("auth.forgot.action")}
          </button>
        </form>

        {message && (
          <p className="mt-5 rounded-2xl border px-4 py-3 text-sm leading-7" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-muted)", color: "var(--text-muted)" }}>
            {message}
          </p>
        )}

        <Link to="/login" className="mt-5 inline-flex text-sm font-semibold" style={{ color: "var(--primary)" }}>
          {t("auth.forgot.back")}
        </Link>
      </div>
    </div>
  );
}

export default ForgotPassword;
