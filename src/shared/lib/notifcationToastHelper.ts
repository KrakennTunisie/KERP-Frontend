import { NotificationDto } from "../api/types";
import { notifToast } from "./toast";

export function showNotificationToast(notification: NotificationDto) {
  switch (notification.eventType) {
    case "INVOICE_STATUS_UPDATED":
      notifToast.success(
        notification.title,
        notification.message
      );
      break;

    case "INVOICE_STATUS_UPDATED":
      notifToast.info(
        notification.title,
        notification.message
      );
      break;

    case "INVOICE_CANCELLED":
      notifToast.error(
        notification.title,
        notification.message
      );
      break;

    default:
      notifToast.info(
        notification.title,
        notification.message
      );
  }
}