// src/shared/api/api-client.ts
import { ApiError } from "./api-error";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type JsonBody = Record<string, unknown> | unknown[] | null;
export type RequestBody = JsonBody | FormData | undefined;

type RequestOptions = {
  method?: HttpMethod;
  body?: RequestBody;
  headers?: HeadersInit;
  token?: string;
  signal?: AbortSignal;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

function isFormData(body: RequestBody): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

function normalizeHeaders(headers?: HeadersInit): Record<string, string> {
  if (!headers) return {};

  if (headers instanceof Headers) {
    return Object.fromEntries(headers.entries());
  }

  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }

  return { ...headers };
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method , body, headers, token, signal } = options;

  const multipart = isFormData(body);
  const finalHeaders = normalizeHeaders(headers);
  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  if (multipart) {
    delete finalHeaders["Content-Type"];
    delete finalHeaders["content-type"];
  } else if (body !== undefined && body !== null) {
    if (!finalHeaders["Content-Type"] && !finalHeaders["content-type"]) {
      finalHeaders["Content-Type"] = "application/json";
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: finalHeaders,
    body:
      body == null
        ? undefined
        : multipart
        ? body
        : JSON.stringify(body),
    signal,
    credentials: "include",
    cache: "no-store",
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as { message?: string }).message)
        : `HTTP error ${response.status}`;

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(
    endpoint: string,
    body?: RequestBody,
    options?: Omit<RequestOptions, "method" | "body">
  ) => apiRequest<T>(endpoint, { ...options, method: "POST", body }),

  put: <T>(
    endpoint: string,
    body?: RequestBody,
    options?: Omit<RequestOptions, "method" | "body">
  ) => apiRequest<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T>(
    endpoint: string,
    body?: RequestBody,
    options?: Omit<RequestOptions, "method" | "body">
  ) => apiRequest<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T>(endpoint: string, options?: Omit<RequestOptions, "method" | "body">) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};