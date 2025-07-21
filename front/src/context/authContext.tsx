"use client";

import { createContext, useContext, useEffect, useState } from "react";

type SaveUserPayLoad = {
  user: UserGoogle;
  accessToken: string;
  isAuth: boolean;
};
type AuthContextType = {
  user: UserGoogle | null;
  token?: string | null;
  isAuth: boolean | null;
  loading: boolean | null;
  saveUserData: (data: SaveUserPayLoad) => void;
  resetUserData: () => void;
};

const authContext = createContext<AuthContextType | undefined>(undefined);
const USER_LOCAL_KEY = "user";
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuth, setIsAuth] = useState<AuthContextType["isAuth"]>(null);
  const [loading, setLoading] = useState(true);

  const saveUserData = (data: SaveUserPayLoad) => {
    setUser(data.user);
    setToken(data.accessToken);
    setIsAuth(data.isAuth);
    localStorage.setItem(USER_LOCAL_KEY, JSON.stringify(data));
  };
  const resetUserData = () => {
    setUser(null);
    setToken(null);
    setIsAuth(false);
    localStorage.removeItem(USER_LOCAL_KEY);
  };
  useEffect(() => {
    try {
      const storage = JSON.parse(localStorage.getItem(USER_LOCAL_KEY) || "{}");
      if (storage === undefined || !Object.keys(storage).length) {
        setIsAuth(false);
      } else {
        const storageType = storage as any;
        setUser(storage?.user);
        setIsAuth(storage?.isAuth);
        setToken(storageType?.accessToken);
      }
    } catch (err) {
      console.error("Error leyendo localStorage:", err);
      setIsAuth(false);
    } finally {
      setLoading(false); // ✅ siempre se ejecuta
    }
  }, []);

  return (
    <authContext.Provider
      value={{
        user,
        token,
        isAuth,
        loading,
        saveUserData,
        resetUserData,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return context;
};
