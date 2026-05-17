import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import IconButton from "@mui/material/IconButton";
import { useLocation, useNavigate, Link } from "react-router-dom";
import AxiosWrapper from "../Https/AxiosWrapper";
import { useAuth } from "../context/AuthContext";
import { useUISettings } from "../context/UIContext";

function LogIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { t } = useUISettings();

  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!form.username || !form.password) {
      setError(t("auth.login.emptyError"));
      setLoading(false);
      return;
    }

    try {
      const response = await AxiosWrapper.post("/auth/login", {
        username: form.username,
        password: form.password,
      });

      if (response.data?.success && response.data?.jwtToken) {
        login(response.data.user, response.data.jwtToken);
        navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
      } else {
        setError(t("auth.login.fallbackError"));
      }
    } catch (err) {
      setError(err.response?.data?.message || t("auth.login.invalidError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-28">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border lg:grid-cols-[0.92fr_1.08fr]" style={{ borderColor: "var(--border)", boxShadow: "var(--shadow-lg)" }}>
        <div className="hidden flex-col justify-between p-10 lg:flex" style={{ background: "linear-gradient(160deg, rgba(37, 99, 235, 0.96) 0%, rgba(14, 116, 144, 0.92) 100%)" }}>
          <div>
            <div className="flex items-center gap-3 text-white">
              <MedicalServicesOutlinedIcon sx={{ fontSize: 34 }} />
              <span className="text-2xl font-extrabold">{t("brand.name")}</span>
            </div>
            <h2 className="mt-10 text-4xl font-extrabold leading-tight text-white">
              {t("auth.login.title")}
            </h2>
            <p className="mt-5 max-w-md text-base leading-8 text-blue-50">
              {t("auth.login.subtitle")}
            </p>
          </div>
          <p className="max-w-md text-sm leading-7 text-blue-50/90">{t("brand.shortDescription")}</p>
        </div>

        <div className="p-6 md:p-10" style={{ backgroundColor: "var(--surface-strong)" }}>
          <div className="mb-8 flex flex-col items-center text-center lg:items-start lg:text-start">
            <IconButton color="primary" onClick={() => navigate("/")} size="large">
              <MedicalServicesOutlinedIcon color="primary" style={{ fontSize: 56 }} />
            </IconButton>
            <h1 className="mt-4 text-3xl font-extrabold" style={{ color: "var(--text)" }}>
              {t("auth.login.title")}
            </h1>
            <p className="mt-2 text-sm leading-7" style={{ color: "var(--text-muted)" }}>
              {t("auth.login.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block text-sm font-semibold" style={{ color: "var(--text)" }}>
              {t("auth.login.username")}
              <input
                type="text"
                name="username"
                placeholder={t("auth.login.usernamePlaceholder")}
                className="field-input mt-2"
                value={form.username}
                onChange={handleChange}
                required
              />
            </label>

            <label className="relative block text-sm font-semibold" style={{ color: "var(--text)" }}>
              {t("auth.login.password")}
              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder={t("auth.login.passwordPlaceholder")}
                className="field-input mt-2 pe-12"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((currentState) => !currentState)}
                className="absolute end-4 top-[3.1rem]"
                style={{ color: "var(--text-muted)" }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>

            <div className="text-sm text-end">
              <Link to="/forgot-password" style={{ color: "var(--primary)" }} className="font-semibold">
                {t("auth.login.forgot")}
              </Link>
            </div>

            {error && (
              <div className="rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: "rgba(220, 38, 38, 0.3)", backgroundColor: "rgba(220, 38, 38, 0.08)", color: "var(--danger)" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? t("auth.login.loading") : t("auth.login.action")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LogIn;
