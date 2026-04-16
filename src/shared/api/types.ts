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
