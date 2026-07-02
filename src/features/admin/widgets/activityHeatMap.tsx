import { useMemo } from "react";

export const mockHeatmap = [
  { date: "2026-05-25", count: 0 },
  { date: "2026-05-26", count: 2 },
  { date: "2026-05-27", count: 5 },
  { date: "2026-05-28", count: 3 },
  { date: "2026-05-29", count: 7 },
  { date: "2026-05-30", count: 1 },
  { date: "2026-05-31", count: 0 },
  { date: "2026-06-01", count: 4 },
  { date: "2026-06-02", count: 6 },
  { date: "2026-06-03", count: 8 },
  { date: "2026-06-04", count: 5 },
  { date: "2026-06-05", count: 2 },
  { date: "2026-06-06", count: 1 },
  { date: "2026-06-07", count: 0 },
  { date: "2026-06-08", count: 3 },
  { date: "2026-06-09", count: 9 },
  { date: "2026-06-10", count: 6 },
  { date: "2026-06-11", count: 4 },
  { date: "2026-06-12", count: 7 },
  { date: "2026-06-13", count: 2 },
  { date: "2026-06-14", count: 0 },
  { date: "2026-06-15", count: 5 },
  { date: "2026-06-16", count: 3 },
  { date: "2026-06-17", count: 8 },
  { date: "2026-06-18", count: 6 },
  { date: "2026-06-19", count: 4 },
  { date: "2026-06-20", count: 1 },
  { date: "2026-06-21", count: 0 },
  { date: "2026-06-22", count: 2 },
  { date: "2026-06-23", count: 5 },
];

export type HeatmapItem = { date: string; count: number };

/* ================= HEATMAP ================= */

export default function ActivityHeatmap({ data }: { data: HeatmapItem[] }) {
  const max = useMemo(() => Math.max(...data.map((d) => d.count), 1), [data]);

  const getColor = (count: number) => {
    const i = count / max;
    if (count === 0) return "bg-slate-100 dark:bg-slate-800";
    if (i < 0.25) return "bg-blue-100";
    if (i < 0.5) return "bg-blue-200";
    if (i < 0.75) return "bg-blue-400";
    return "bg-blue-600";
  };

  const totalActions = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[13px] font-medium text-slate-900">
            Activité utilisateur
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {totalActions} actions sur 30 jours
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400">Faible</span>
          {["bg-slate-100", "bg-blue-100", "bg-blue-200", "bg-blue-400", "bg-blue-600"].map(
            (c, i) => (
              <div key={i} className={`h-2.5 w-2.5 rounded-sm ${c}`} />
            )
          )}
          <span className="text-[10px] text-slate-400">Fort</span>
        </div>
      </div>

      <div className="grid grid-cols-10 gap-[3px]">
        {data.map((d) => (
          <div
            key={d.date}
            title={`${d.date} · ${d.count} actions`}
            className={`h-[22px] rounded-[4px] cursor-pointer transition-transform hover:scale-110 ${getColor(d.count)}`}
          />
        ))}
      </div>

      <div className="mt-2 flex justify-between text-[10px] text-slate-400">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}
