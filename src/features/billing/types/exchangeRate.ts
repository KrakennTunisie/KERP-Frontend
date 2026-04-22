export type ExchangeRate = {
  idExchangeRate: string;      // UUID
  fromCurrency: string;        // e.g. "TND"
  toCurrency: string;          // e.g. "EUR"
  quote: number;               // exchange rate
  rateDate: Date;            // ISO date "YYYY-MM-DD"
  fetchedAt: string;           // ISO datetime
  source: string;              // e.g. "currencylayer"
  createdAt: string;           // ISO datetime
  updatedAt: string;           // ISO datetime
};