import dynamic from "next/dynamic";
import { Suspense } from "react";

const GoogleCallbackClient = dynamic(() => import("./GoogleCallbackClient"), { ssr: false });

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<p>Conectando...</p>}>
      <GoogleCallbackClient />
    </Suspense>
  );
}
