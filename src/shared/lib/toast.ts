import { toast } from "sonner";

export const appToast = {
  success: (message: string, description?: string) =>
    toast.success(message, {
      description,
      toasterId: "app-toast",
    }),

  error: (message: string, description?: string) =>
    toast.error(message, {
      description,
      toasterId: "app-toast",
    }),

  info: (message: string, description?: string) =>
    toast(message, {
      description,
      toasterId: "app-toast",
    }),

  loading: (message: string, description?: string) =>
    toast.loading(message, {
      description,
      toasterId: "app-toast",
    }),

  dismiss: (id?: string | number) => toast.dismiss(id),
};

export const notifToast = {
  success: (message: string, description?: string) =>
    toast.success(message, {
      description,
      toasterId: "notif-toast",
    }),

  error: (message: string, description?: string) =>
    toast.error(message, {
      description,
      toasterId: "notif-toast",
    }),

  info: (message: string, description?: string) =>
    toast(message, {
      description,
      toasterId: "notif-toast",
    }),

  warning: (message: string, description?: string) =>
    toast.warning(message, {
      description,
      toasterId: "notif-toast",
    }),

  dismiss: (id?: string | number) =>
    toast.dismiss(id),
};