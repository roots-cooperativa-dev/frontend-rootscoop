// src/hooks/useLogout.ts
"use client";

import { useRouter } from "next/navigation";
import { useAuthContext } from "@/src/context/authContext";

const useLogout = () => {
  const { resetUserData } = useAuthContext();
  const router = useRouter();

  const logout = () => {
    resetUserData();
    router.push("/");
  };

  return logout;
};

export default useLogout;
