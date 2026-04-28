import { useState } from "react";

interface AuthState {
  isAuthenticated: boolean;
  user: { username: string; fullName: string } | null;
}

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [auth, setAuth] = useState<AuthState>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("keyboom_auth");
      if (stored) {
        return JSON.parse(stored);
      }
    }
    return { isAuthenticated: false, user: null };
  });

  const login = async (username: string, password: string) => {
    setIsLoading(true);

    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        // MVP ساده: هر username و password ای به جز خالی قبوله
        if (username && password && password.length >= 4) {
          const user = { username, fullName: "کاربر مهمان" };
          const newAuth = { isAuthenticated: true, user };
          localStorage.setItem("keyboom_auth", JSON.stringify(newAuth));
          setAuth(newAuth);
          resolve(true);
        } else {
          resolve(false);
        }
        setIsLoading(false);
      }, 800);
    });
  };

  const logout = () => {
    localStorage.removeItem("keyboom_auth");
    setAuth({ isAuthenticated: false, user: null });
  };

  return { ...auth, isLoading, login, logout };
};
