"use client";

import { useEffect, useState } from "react";
import { Activity, ChevronLeft, ChevronRight, ClipboardList } from "lucide-react";

import { formatDateLongWithTime } from "@/shared/utils/formatDate";
import { AuditLogView } from "@/shared/services/AuditLog";
import { partnerTypeSchema } from "@/features/billing/types/partnerType";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import SectionCard from "./sectionCard";
import { auditLogService } from "@/shared/services/auditLogsService";
import { GetAuditLogsParams } from "@/shared/api/types";

type ActivityLogCardProps = {
  partnerId: string;
  partnerType: string;
  getActivityIcon: (type: string) => React.ElementType;
};

export default function ActivityLogCard({
  partnerId,
  partnerType,
  getActivityIcon,
}: ActivityLogCardProps) {
  const [logs, setLogs] = useState<AuditLogView[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [size] = useState(5);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoadingLogs(true);

        const params: GetAuditLogsParams = {
          resourceType: partnerType === partnerTypeSchema.enum.CLIENT ? "Client" : "Supplier",
          resourceId: partnerId,
          keyword: undefined,
          page: currentPage,
          size,
        };

        const response = await auditLogService.getAuditLogs(params);

        setLogs(response.content);
        setTotalElements(response.totalElements);
        setTotalPages(response.totalPages);
      } catch (err) {
        appToast.error(
          "Erreur de fetch logs",
          getApiErrorMessage(err)
        );
      } finally {
        setLoadingLogs(false);
      }
    };

    if (partnerId) {
      fetchLogs();
    }
  }, [partnerId, currentPage, size]);

  return (
    <SectionCard
      title="Journal d'activités"
      description="Historique des actions liées au partenaire"
      icon={Activity}
      iconClassName="text-blue-600"
      contentClassName="p-0"
    >
      {/* Loading */}
      {loadingLogs && (
        <div className="flex items-center justify-center py-10">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
            Chargement des activités...
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loadingLogs && logs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-400">
            <ClipboardList className="h-5 w-5" />
          </div>

          <p className="text-sm font-medium text-slate-700">
            Aucune activité
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Aucune action n&apos;a encore été enregistrée pour ce partenaire.
          </p>
        </div>
      )}

      {/* Logs */}
      {!loadingLogs && logs.length > 0 && (
        <div className="max-h-[400px] overflow-y-auto">
        {logs.map((log) => {
          const Icon = getActivityIcon(log.action);

          const actorName =
            [log.actor?.firstName, log.actor?.lastName]
              .filter(Boolean)
              .join(" ") || "Système";

          const actionLabel = log.action
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/^\w/, (char) => char.toUpperCase());

          const isSuccess = log.outcome === "SUCCESS";

          const hasDetails = log.before !== null || log.after !== null;
          const isDetailsOpen = selectedLogId === log.id;

          return (
            <div
              key={log.id}
              className="border-b border-slate-100 px-4 py-3 last:border-b-0 hover:bg-slate-50/50"
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Icon className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  {/* Action + outcome */}
                  <div className="flex items-center gap-2">
                    <p className="truncate text-xs font-medium text-slate-800">
                      {actionLabel}
                    </p>

                    {log.outcome && (
                      <span
                        className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                          isSuccess
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        {isSuccess ? "Succès" : "Échec"}
                      </span>
                    )}
                  </div>

                  {/* Actor + date */}
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                    <span>
                      Par{" "}
                      <span className="font-medium text-slate-500">
                        {actorName}
                      </span>
                    </span>

                    <span className="text-slate-300">•</span>

                    <span>
                      {formatDateLongWithTime(new Date(log.timestamp))}
                    </span>
                  </div>

                  {/* Resource */}
                  <div className="mt-1 text-[11px] text-slate-400">
                    {log.resourceType}
                  </div>

                  {/* Failure reason */}
                  {log.outcome !== "SUCCESS" && log.failureReason && (
                    <p className="mt-1 text-[11px] text-red-500">
                      {log.failureReason}
                    </p>
                  )}

                  {/* Details button */}
                  {hasDetails && (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedLogId(isDetailsOpen ? null : log.id)
                      }
                      className="mt-2 text-[11px] font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {isDetailsOpen ? "Masquer les détails" : "Voir les détails"}
                    </button>
                  )}
                </div>
              </div>

              {/* Before / After */}
              {isDetailsOpen && hasDetails && (
                <div className="mt-3 ml-11 grid gap-3 md:grid-cols-2">
                  {/* Before */}
                  {log.before && (
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="mb-2 text-[11px] font-semibold text-slate-600">
                        Avant
                      </p>

                      <pre className="max-h-60 overflow-auto whitespace-pre-wrap break-words text-[10px] leading-relaxed text-slate-500">
                        {JSON.stringify(log.before, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* After */}
                  {log.after && (
                    <div className="rounded-lg border border-slate-200 bg-white p-3">
                      <p className="mb-2 text-[11px] font-semibold text-slate-600">
                        Après
                      </p>

                      <pre className="max-h-60 overflow-auto whitespace-pre-wrap break-words text-[10px] leading-relaxed text-slate-500">
                        {JSON.stringify(log.after, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );

          
        })}

{/* Pagination */} 
      {totalPages > 1 && ( 
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3"> 
          {/* Total */} 
          <p className="text-[11px] text-slate-400"> 
            {totalElements} activité{totalElements > 1 ? "s" : ""} 
          </p> 
          {/* Controls */} 
          <div className="flex items-center gap-1"> 
              <button type="button" 
                  onClick={() =>
                            setCurrentPage((page) => page - 1)
                          } 
                  disabled={currentPage === 1 || loadingLogs} 
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40" 
                  aria-label="Page précédente" > 

                <ChevronLeft className="h-3.5 w-3.5" /> 
              </button> 
              <span className="px-2 text-[11px] font-medium text-slate-600"> 
                  Page {currentPage} / {totalPages} 
              </span> 
              
              <button type="button" 
                onClick={() =>
                            setCurrentPage((page) => page + 1)
                          } 
                disabled={ currentPage === totalPages || loadingLogs } 
                className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40" 
                aria-label="Page suivante" > 
                <ChevronRight className="h-3.5 w-3.5" /> 
              </button> 
            </div> 
          </div> )}
   </div>
      )}
    </SectionCard>
  );
}