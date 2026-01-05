import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

// Hardcoded credentials for the tutorial
const VALID_CREDENTIALS = {
  username: "chef",
  password: "recipe123",
};

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user was previously logged in
    return localStorage.getItem("recipe_auth") === "true";
  });
  const [username, setUsername] = useState<string | null>(() => {
    return localStorage.getItem("recipe_username");
  });

  const login = useCallback(
    (inputUsername: string, inputPassword: string): boolean => {
      if (
        inputUsername === VALID_CREDENTIALS.username &&
        inputPassword === VALID_CREDENTIALS.password
      ) {
        setIsAuthenticated(true);
        setUsername(inputUsername);
        localStorage.setItem("recipe_auth", "true");
        localStorage.setItem("recipe_username", inputUsername);
        return true;
      }
      return false;
    },
    []
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.removeItem("recipe_auth");
    localStorage.removeItem("recipe_username");
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
