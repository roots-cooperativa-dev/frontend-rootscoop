import { Suspense } from "react";
import ClientPage from "./ClientPage";

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<p>Conectando...</p>}>
      <ClientPage/>
    </Suspense>
  );
}
