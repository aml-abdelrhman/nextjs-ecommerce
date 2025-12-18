"use client";

import { Suspense } from "react";
import EditAddressClient from "./";

export default function EditAddressPage() {
  return (
    <Suspense fallback={<p className="loadingText">Loading address...</p>}>
      <EditAddressClient />
    </Suspense>
  );
}
