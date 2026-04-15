export interface StatCardConfig {
  bg: string;
  border: string;
  iconBg: string;
  labelColor: string;
}

export const STAT_CARD_STYLES = {
  blue: {
    bg: "bg-blue-50",
    border: "border border-blue-200",
    iconBg: "bg-blue-100",
    labelColor: "text-blue-600",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border border-amber-200",
    iconBg: "bg-amber-100",
    labelColor: "text-amber-600",
  },
  emerald: {
    bg: "bg-emerald-50",
    border: "border border-emerald-200",
    iconBg: "bg-emerald-100",
    labelColor: "text-emerald-600",
  },
} as const;

export type StatCardVariant = keyof typeof STAT_CARD_STYLES;