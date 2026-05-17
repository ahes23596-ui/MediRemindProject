/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AxiosWrapper from "../Https/AxiosWrapper";

const AuthContext = createContext(null);
const PROFILE_NAME_OVERRIDE_KEY = "profileNameOverride";

const readProfileNameOverride = () => {
  const storedOverride = localStorage.getItem(PROFILE_NAME_OVERRIDE_KEY);
  if (!storedOverride) return null;

  try {
    return JSON.parse(storedOverride);
  } catch {
    return null;
  }
};

const readStoredUser = () => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;

  try {
    const parsedUser = JSON.parse(storedUser);
    const override = readProfileNameOverride();

    return override
      ? { ...parsedUser, firstname: override.firstname, lastname: override.lastname }
      : parsedUser;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => readStoredUser());
  const [loading, setLoading] = useState(true);

  const clearSession = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem(PROFILE_NAME_OVERRIDE_KEY);
    setToken(null);
    setUser(null);
  };

  const persistSession = (nextUser, nextToken) => {
    localStorage.removeItem(PROFILE_NAME_OVERRIDE_KEY);
    localStorage.setItem("token", nextToken);
    localStorage.setItem("user", JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const refreshProfile = useCallback(async () => {
    if (!localStorage.getItem("token")) {
      clearSession();
      setLoading(false);
      return null;
    }

    try {
      const { data } = await AxiosWrapper.get("/auth/profile");
      if (data?.success && data?.user) {
        const override = readProfileNameOverride();
        const nextUser = override
          ? { ...data.user, firstname: override.firstname, lastname: override.lastname }
          : data.user;

        localStorage.setItem("user", JSON.stringify(nextUser));
        setUser(nextUser);
        setToken(localStorage.getItem("token"));
        return nextUser;
      }
      clearSession();
      return null;
    } catch {
      clearSession();
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = useCallback((nextUser, nextToken) => {
    persistSession(nextUser, nextToken);
  }, []);

  const updateProfileName = useCallback(async ({ firstname, lastname }) => {
    const nextOverride = {
      firstname: firstname.trim(),
      lastname: lastname.trim(),
    };

    const updatedUser = {
      ...(user || {}),
      firstname: nextOverride.firstname,
      lastname: nextOverride.lastname,
    };

    localStorage.setItem(PROFILE_NAME_OVERRIDE_KEY, JSON.stringify(nextOverride));
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    return updatedUser;
  }, [user]);

  const logout = useCallback(async () => {
    try {
      await AxiosWrapper.post("/auth/logout");
    } catch {
      // Ignore logout API failures and still clear the local session.
    } finally {
      clearSession();
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      updateProfileName,
      logout,
      refreshProfile,
    }),
    [loading, token, user, login, logout, refreshProfile, updateProfileName]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
