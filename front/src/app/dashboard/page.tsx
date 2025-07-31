"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/authContext";
import { HomeComponent } from "@/src/components/dashboard/HomeComponent";

const DashboardPage = () => {
  const { isAuth, loading } = useAuthContext();
  const router = useRouter();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (isAuth === false) {
        router.push("/login");
      } else if (isAuth === true) {
        setCanRender(true);
      }
    }
  }, [isAuth, loading, router]);

  if (!canRender) {
    return null;
  }

  return <HomeComponent />;
};

export default DashboardPage;
