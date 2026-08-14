// components/notifications/notification-provider.tsx
'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner'; // or your shadcn toast setup
import { useNotificationStore } from '@/store/notification-store';
import { NotificationDto } from '@/shared/api/types';
import { connectNotificationSocket, disconnectNotificationSocket } from '@/shared/lib/notifications/client';
import { Client } from '@stomp/stompjs';
import { showNotificationToast } from '@/shared/lib/notifcationToastHelper';

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const addNotification = useNotificationStore((s) => s.addNotification);
  const setConnected = useNotificationStore((s) => s.setConnected);

 useEffect(() => {
  let active = true;
  let localClient: Client | null = null;

  fetch('/api/auth/ws-token')
    .then((r) => r.json())
    .then(({ token }) => {
      if (!active || !token) return;

      localClient = connectNotificationSocket(
        token,
        (notif: NotificationDto) => {
          addNotification(notif);
          /* toast(notif.title, {
            description: notif.message,
            action: getDeepLinkAction(notif),
          }); */
          showNotificationToast(notif);
        },
        setConnected
      );
    })
    .catch((e) => console.error('Failed to fetch WS token', e));

  return () => {
    active = false;
    localClient?.deactivate();
  };
}, [addNotification, setConnected]);

  return children;
}

function getDeepLinkAction(notif: NotificationDto) {
  if (notif.channel === 'INVOICE' && notif.metadata?.invoiceId) {
    return {
      label: 'View invoice',
      onClick: () => {
        window.location.href = `/invoices/${notif.metadata.invoiceId}`;
      },
    };
  }
  if (notif.channel === 'PAYMENT' && notif.metadata?.paymentId) {
    return {
      label: 'View payment',
      onClick: () => {
        window.location.href = `/payments/${notif.metadata.paymentId}`;
      },
    };
  }
  return undefined;
}