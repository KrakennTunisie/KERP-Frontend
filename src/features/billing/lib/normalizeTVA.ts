export const  normalizeVatRatePercentage = (rawVatRate: number | null | undefined): number | null => {
  if (rawVatRate == null) {
    return null;
  }

  return rawVatRate > 0 && rawVatRate < 1
    ? Math.round(rawVatRate * 100)
    : rawVatRate;
};