// pages/auth/callback.tsx
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "@/src/context/authContext";
import { getUserById } from "@/src/services/auth";

export default function Callback() {
  const router = useRouter();
  const { saveUserData } = useAuthContext();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!router.isReady || hasRun.current) return;

    const accessToken = router.query.token as string;
    const userId = router.query.userId as string;

    if (!accessToken || !userId) return;

    hasRun.current = true;

    const fetchUser = async () => {
      try {
        const userData = await getUserById(userId, accessToken);

        saveUserData({
          user: { id: userId, name: userData.name, email: userData.email },
          accessToken: accessToken,
          isAuth: true,
        });

        router.push("/");
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    fetchUser();
  }, [router.isReady, router.query, saveUserData]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#017d74] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-700 text-sm">Autenticando...</p>
      </div>
    </div>
  );
}
