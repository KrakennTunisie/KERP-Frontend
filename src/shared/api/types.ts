export type PageResponse<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;// current page 0-indexed
};

export type GetListParams = {
  keyword?: string;
  filter?: string;
  page?: number;
};

export type GetExtendedListParams = {
  keyword?: string;
  statusFilter?: string;
  roleFilter?:string;
  page?: number;
};

export type GetAuditLogsParams = {
  resourceType?: string;
  resourceId?: string;
  keyword?: string;
  status?: string;
  date?: string;
  page?: number;
  size?: number;
};

export type GetAuditActivityParams = {
  userId: string;
};


export type ExchangeRateParams = {
  fromCurrency: string,
  toCurrency : string,
}

export const defaultExchangeRateParams: ExchangeRateParams = {
  fromCurrency: "TND",
  toCurrency: "EUR",
};

// types/notification.ts
export type NotificationStatus = 'UNREAD' | 'READ';

export interface NotificationDto {
  id: string;
  eventId: string;
  eventType: string;
  channel: string;
  userId: string;
  title: string;
  message: string;
  metadata: Record<string, unknown>;
  status: NotificationStatus;
  occurredAt: string;
  createdAt: string;
}