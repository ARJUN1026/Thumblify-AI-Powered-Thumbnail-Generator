import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // state: user, loading

  // useEffect → on mount, checks localStorage for token
  //   if no token → setLoading(false) and return
  //   fetchUser() → calls api.getMe(), sets user
  //                 on error → removes token, sets user null
  //                 finally → setLoading(false)

  // saveAuth(data)         → saves token to localStorage, sets user
  // logout()               → removes token from localStorage, sets user null
  // updateCredits(credits) → updates credits field in user state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("thumblify_token");

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const data = await api.getMe();
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem("thumblify_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const saveAuth = (data) => {
    localStorage.setItem("thumblify_token", data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("thumblify_token");
    setUser(null);
  };

  const updateCredits = (credits) => {
    setUser((prev) => (prev ? { ...prev, credits } : prev));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        saveAuth,
        logout,
        updateCredits,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
