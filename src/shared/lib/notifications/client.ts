import { NotificationDto } from '@/shared/api/types';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let client: Client | null = null;

export function connectNotificationSocket(
  token: string,
  onNotification: (n: NotificationDto) => void,
  onStatusChange?: (connected: boolean) => void
): Client {
  client = new Client({
    webSocketFactory: () =>
      new SockJS(`${process.env.NEXT_PUBLIC_NOTIFICATION_WS_URL}`),

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    reconnectDelay: 0,

    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    onConnect: () => {
      console.log('WebSocket connected');

      onStatusChange?.(true);

      client!.subscribe(
        '/user/queue/notifications',
        (message: IMessage) => {
                console.log('📩 MESSAGE RECEIVED:', message.body);

          try {
            const notif: NotificationDto = JSON.parse(message.body);

            onNotification(notif);
          } catch (e) {
            console.error(
              'Failed to parse notification payload',
              e
            );
          }
        }
      );
    },

    onDisconnect: () => {
      console.log('WebSocket disconnected');
      onStatusChange?.(false);
    },

    onStompError: (frame) => {
      console.error(
        'STOMP error:',
        frame.headers['message'],
        frame.body
      );
    },

    onWebSocketError: (error) => {
      console.error('WebSocket error:', error);
      onStatusChange?.(false);
    },
  });

  client.activate();

  return client;
}

export function disconnectNotificationSocket() {
  client?.deactivate();
  client = null;
}