"use client";

import { Toaster } from "sonner";

export default function AppToaster() {
  return (
    <Toaster
      id="app-toast"
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        className: "rounded-2xl",
      }}
    />
  );
}