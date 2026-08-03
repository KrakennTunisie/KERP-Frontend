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


export type ExchangeRateParams = {
  fromCurrency: string,
  toCurrency : string,
}

export const defaultExchangeRateParams: ExchangeRateParams = {
  fromCurrency: "TND",
  toCurrency: "EUR",
};