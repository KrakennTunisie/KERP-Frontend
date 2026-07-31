type EndpointValue = string | ((...args: any[]) => string);

type EndpointMap = Record<string, EndpointValue>;

export function withPrefix<T extends EndpointMap>(
  prefix: string,
  endpoints: T
): T {
  return Object.fromEntries(
    Object.entries(endpoints).map(([key, value]) => [
      key,
      typeof value === "function"
        ? (...args: any[]) => prefix + value(...args)
        : prefix + value,
    ])
  ) as T;
}