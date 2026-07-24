import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");

    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() =>
    localStorage.getItem("accessToken"),
  );

  const [isInitializing, setIsInitializing] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("currentUser");

    setToken(null);
    setUser(null);
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();

      localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser),
      );

      setUser(currentUser);

      return currentUser;
    } catch (error) {
      logout();
      throw error;
    }
  }, [logout]);

  const login = useCallback(async (credentials) => {
    const data = await authService.login(credentials);

    const accessToken = data.access_token;

    if (!accessToken) {
      throw new Error("Authentication token was not returned.");
    }

    localStorage.setItem("accessToken", accessToken);
    setToken(accessToken);

    const currentUser = await authService.getCurrentUser();

    localStorage.setItem(
      "currentUser",
      JSON.stringify(currentUser),
    );

    setUser(currentUser);

    return currentUser;
  }, []);

  useEffect(() => {
    const initializeAuthentication = async () => {
      if (!token) {
        setIsInitializing(false);
        return;
      }

      try {
        await fetchCurrentUser();
      } catch {
        logout();
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuthentication();
  }, [fetchCurrentUser, logout, token]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isInitializing,
      login,
      logout,
      fetchCurrentUser,
    }),
    [
      user,
      token,
      isInitializing,
      login,
      logout,
      fetchCurrentUser,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;