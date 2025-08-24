// app/upload/page.tsx
import { Suspense } from "react";
import { UploadPageClient } from "./upload-page-client";

export default function UploadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UploadPageClient />
    </Suspense>
  );
}
