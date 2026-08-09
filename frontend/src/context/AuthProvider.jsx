import { useState, useCallback } from "react";
import { AuthContext } from "./AuthContext";
import { loginUser, logout as logoutRequest } from "../lib/authApi";

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));

  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);
    setToken(data.token);
    setRole(data.user?.role ?? "user");
    return data;
  }, []);

  const logout = useCallback(() => {
    logoutRequest();
    setToken(null);
    setRole(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        isAuthenticated: !!token,
        isAdmin: role === "admin",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
