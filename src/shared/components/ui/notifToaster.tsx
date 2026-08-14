"use client";

import { Toaster } from "sonner";

export default function NotifToaster() {
  return (
    <Toaster
      id="notif-toast"
      position="bottom-left"
      expand
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "rounded-[20px] shadow-xl border border-gray-100 p-4 w-[420px] bg-white",
          title:
            "text-sm font-black text-gray-900",
          description:
            "text-xs font-semibold text-gray-500 mt-1",
          closeButton:
            "bg-gray-100 border-none hover:bg-gray-200",
        },
      }}
    />
  );
}