/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    window.localStorage.getItem("accessToken" ?? false)
  );

  const login = useCallback(function () {
    setIsAuthenticated(true);
  }, []);
  
  const logout = useCallback(function () {
    window.localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      login,
      logout,
      isAuthenticated,
    }),
    [login, logout, isAuthenticated]
  );

 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  return useContext(AuthContext);
}
