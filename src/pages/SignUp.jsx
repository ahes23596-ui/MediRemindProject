import React, { useState } from "react";
import { Eye, EyeOff, UserRoundPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AxiosWrapper from "../Https/AxiosWrapper";
import { useAuth } from "../context/AuthContext";
import { useUISettings } from "../context/UIContext";

function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useUISettings();

  const [showPass, setShowPass] = useState(false);
  const [showCpass, setShowCpass] = useState(false);
  const [form, setForm] = useState({
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    cpassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const { username, firstname, lastname, password, cpassword } = form;

    if (!username || !firstname || !lastname || !password || !cpassword) {
      setError(t("auth.signup.emptyError"));
      return;
    }

    if (password !== cpassword) {
      setError(t("auth.signup.passwordError"));
      return;
    }

    try {
      setLoading(true);
      const { data } = await AxiosWrapper.post("/auth/register", form);
      if (data.success) {
        login(data.user, data.jwtToken);
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || t("auth.signup.fallbackError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-24">
      <div className="surface-card w-full max-w-2xl rounded-[2rem] p-6 md:p-10" style={{ backgroundColor: "var(--surface-strong)" }}>
        <div className="mx-auto mb-8 max-w-xl text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl"
            style={{ backgroundColor: "var(--primary-soft)", color: "var(--primary)" }}
          >
            <UserRoundPlus size={28} />
          </div>
          <h1 className="mt-5 text-3xl font-extrabold" style={{ color: "var(--text)" }}>
            {t("auth.signup.title")}
          </h1>
          <p className="mt-3 text-sm leading-7 md:text-base" style={{ color: "var(--text-muted)" }}>
            {t("auth.signup.subtitle")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            {t("auth.signup.username")}
            <input name="username" value={form.username} onChange={handleChange} className="field-input mt-2" />
          </label>
          <label className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            {t("auth.signup.firstName")}
            <input name="firstname" value={form.firstname} onChange={handleChange} className="field-input mt-2" />
          </label>
          <label className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            {t("auth.signup.lastName")}
            <input name="lastname" value={form.lastname} onChange={handleChange} className="field-input mt-2" />
          </label>
          <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
            <label className="relative text-sm font-semibold" style={{ color: "var(--text)" }}>
              {t("auth.signup.password")}
              <input type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange} className="field-input mt-2 pe-12" />
              <button type="button" onClick={() => setShowPass((currentState) => !currentState)} className="absolute end-4 top-[3.1rem]" style={{ color: "var(--text-muted)" }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>
            <label className="relative text-sm font-semibold" style={{ color: "var(--text)" }}>
              {t("auth.signup.confirmPassword")}
              <input type={showCpass ? "text" : "password"} name="cpassword" value={form.cpassword} onChange={handleChange} className="field-input mt-2 pe-12" />
              <button type="button" onClick={() => setShowCpass((currentState) => !currentState)} className="absolute end-4 top-[3.1rem]" style={{ color: "var(--text-muted)" }}>
                {showCpass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </label>
          </div>

          {error && (
            <div className="md:col-span-2 rounded-2xl border px-4 py-3 text-sm" style={{ borderColor: "rgba(220, 38, 38, 0.3)", backgroundColor: "rgba(220, 38, 38, 0.08)", color: "var(--danger)" }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary md:col-span-2 w-full disabled:opacity-60">
            {loading ? t("auth.signup.loading") : t("auth.signup.action")}
          </button>
        </form>

        <p className="mt-5 text-center text-sm" style={{ color: "var(--text-muted)" }}>
          {t("auth.signup.footer")}{" "}
          <Link to="/login" style={{ color: "var(--primary)" }} className="font-semibold">
            {t("auth.signup.footerAction")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
