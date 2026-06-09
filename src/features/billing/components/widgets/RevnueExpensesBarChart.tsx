import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { RefreshCw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,  ResponsiveContainer } from 'recharts';
import { PartnerRevenueStats } from "../../types/partnerRevenueStats";
import { useMemo } from "react";

export type ChartMode = "revenues" | "expenses" | "both";


type RevenueExpenseBarChartProps = {
  title?: string;
  description?: string;
  data: PartnerRevenueStats[];
  mode: ChartMode;
  selectedPeriod: number;
  onPeriodChange: (period: number) => void;
  onRefresh?: () => void;
  currency?: string;
  totalLabel?: string;
  totalValue?: number;
};

export default function RevenueExpenseBarChart({
  title,
  description = "Ce graphique est affiché dans la devise de base de l'organisation.",
  data,
  mode,
  selectedPeriod,
  onPeriodChange,
  onRefresh,
  currency = "TND",
  totalLabel,
  totalValue,
}: RevenueExpenseBarChartProps) {
  const showRevenues = mode === "revenues" || mode === "both";
  const showExpenses = mode === "expenses" || mode === "both";

  const chartTitle =
    title ??
    (mode === "revenues"
      ? "Revenus"
      : mode === "expenses"
        ? "Dépenses"
        : "Revenus et Dépenses");
        
  const chartData = useMemo(() => {
  const transformed = data.map((item) => ({
    month: item.monthLabel,
    revenus: item.revenueTTC ?? 0,
  }));
  return transformed;
}, [data]);


  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base font-black text-slate-900">
              {chartTitle}
            </CardTitle>

            <CardDescription className="text-xs mt-0.5">
              {description}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <select
              value={selectedPeriod}
              onChange={(e) => onPeriodChange(Number(e.target.value))}
              className="h-8 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none transition hover:bg-slate-100 focus:border-blue-300 focus:ring-2 focus:ring-blue-100 cursor-pointer"
            >
              <option value={1}>1 mois dernier</option>
              <option value={2}>2 mois derniers</option>
              <option value={6}>6 mois derniers</option>
            </select>

            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                title="Actualiser le graphique"
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 hover:border-blue-200 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} barCategoryGap={mode === "both" ? "35%" : "55%"}>
            <defs>
              <linearGradient id="gradRevenus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#bfdbfe" />
              </linearGradient>

              <linearGradient id="gradDepenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="100%" stopColor="#fecaca" />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              cursor={{ fill: "#f8fafc" }}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.08)",
                fontSize: "13px",
                fontWeight: 600,
              }}
              formatter={(value, name) => {
                const label = name === "revenus" ? "Revenus" : "Dépenses";
                const colorClass = name === "revenus" ? "text-blue-400" : "text-red-400";

                return [
                  <span key={String(name)} className={colorClass}>
                    {Number(value ?? 0).toLocaleString()} {currency}
                  </span>,
                  label,
                ];
              }}
            />

            {showRevenues && (
              <Bar
                dataKey="revenus"
                name="revenus"
                fill="url(#gradRevenus)"
                radius={[6, 6, 0, 0]}
                maxBarSize={mode === "both" ? 22 : 18}
              />
            )}

            {showExpenses && (
              <Bar
                dataKey="depenses"
                name="depenses"
                fill="url(#gradDepenses)"
                radius={[6, 6, 0, 0]}
                maxBarSize={mode === "both" ? 22 : 18}
              />
            )}
          </BarChart>
        </ResponsiveContainer>

        {totalLabel && totalValue !== undefined && (
          <div className="mt-4 px-4 py-3 bg-blue-50 rounded-xl">
            <p className="text-sm font-semibold text-slate-600">
              {totalLabel} —{" "}
              <span className="text-blue-600 font-black text-base">
                {totalValue.toLocaleString()} {currency}
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}