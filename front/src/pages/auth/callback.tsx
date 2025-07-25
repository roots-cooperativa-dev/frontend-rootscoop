// pages/auth/callback.tsx
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "@/src/context/authContext";
import { getUserById } from "@/src/services/auth";
import Loading from "@/src/components/loading/pantallaCargando";

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
          user: {
            id: userId,
            name: userData.name,
            username: userData.username,
            birthdate: userData.birthdate,
            phone: userData.phone,
            email: userData.email,
            isAdmin: userData.isAdmin,
            isDonator: userData.isDonator
          },
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
    <Loading/>
  );
}
