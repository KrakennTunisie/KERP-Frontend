import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { GetAuditActivityParams } from "@/shared/api/types";
import { appToast } from "@/shared/lib/toast";
import { HeatmapItem } from "@/shared/services/AuditLog";
import { auditLogService } from "@/shared/services/auditLogsService";
import { useEffect, useMemo, useState } from "react";

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


/* ================= HEATMAP ================= */

export default function ActivityHeatmap({ userId }: { userId: string }) {
  const [heatMapItems, setHeatMapItems] = useState<HeatmapItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogsActivity = async () => {
      try {
        setLoading(true);

        const params: GetAuditActivityParams = {
          userId,
        };

        const response = await auditLogService.getAuditActivity(params);

        setHeatMapItems(response);
      } catch (err) {
        appToast.error(
          "Erreur de récupération de l'activité",
          getApiErrorMessage(err)
        );
        setHeatMapItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchLogsActivity();
    } else {
      setHeatMapItems([]);
      setLoading(false);
    }
  }, [userId]);

  // Nombre maximum d'actions sur une journée
  const max = useMemo(
    () => Math.max(...heatMapItems.map((item) => item.count), 1),
    [heatMapItems]
  );

  // Couleur selon le nombre d'actions
  const getColor = (count: number) => {
    if (count === 0) {
      return "bg-slate-100 dark:bg-slate-800";
    }

    const ratio = count / max;

    if (ratio < 0.25) return "bg-blue-100";
    if (ratio < 0.5) return "bg-blue-200";
    if (ratio < 0.75) return "bg-blue-400";

    return "bg-blue-600";
  };

  // Total des actions sur les 30 jours
  const totalActions = useMemo(
    () => heatMapItems.reduce((sum, item) => sum + item.count, 0),
    [heatMapItems]
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      {/* HEADER */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[13px] font-medium text-slate-900">
            Activité utilisateur
          </p>

          <p className="mt-0.5 text-[11px] text-slate-400">
            {loading
              ? "Chargement..."
              : `${totalActions} action${
                  totalActions > 1 ? "s" : ""
                } sur 30 jours`}
          </p>
        </div>

        {/* LEGEND */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400">
            Faible
          </span>

          {[
            "bg-slate-100",
            "bg-blue-100",
            "bg-blue-200",
            "bg-blue-400",
            "bg-blue-600",
          ].map((color, index) => (
            <div
              key={index}
              className={`h-2.5 w-2.5 rounded-sm ${color}`}
            />
          ))}

          <span className="text-[10px] text-slate-400">
            Fort
          </span>
        </div>
      </div>

      {/* HEATMAP */}
      {loading ? (
        <div className="grid grid-cols-10 gap-[3px]">
          {Array.from({ length: 30 }).map((_, index) => (
            <div
              key={index}
              className="h-[22px] animate-pulse rounded-[4px] bg-slate-100"
            />
          ))}
        </div>
      ) : heatMapItems.length === 0 ? (
        <div className="flex h-[72px] items-center justify-center text-[11px] text-slate-400">
          Aucune activité enregistrée
        </div>
      ) : (
        <div className="grid grid-cols-10 gap-[3px]">
          {heatMapItems.map((item) => (
            <div
              key={item.date}
              title={`${item.date} · ${item.count} action${
                item.count > 1 ? "s" : ""
              }`}
              className={`h-[22px] cursor-pointer rounded-[4px] transition-transform hover:scale-110 ${getColor(
                item.count
              )}`}
            />
          ))}
        </div>
      )}

      {/* DATES */}
      {!loading && heatMapItems.length > 0 && (
        <div className="mt-2 flex justify-between text-[10px] text-slate-400">
          <span>{heatMapItems[0]?.date}</span>
          <span>
            {heatMapItems[heatMapItems.length - 1]?.date}
          </span>
        </div>
      )}
    </div>
  );
}

