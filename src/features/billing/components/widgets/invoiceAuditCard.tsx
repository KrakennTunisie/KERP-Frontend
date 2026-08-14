"use client";

import { useEffect, useState } from "react";
import Card from "../widgets/card";
import { SectionLabel } from "../widgets/sectionLabel";
import { formatDateLongWithTime } from "@/shared/utils/formatDate";
import {
  AuditLogView,
  getAuditActionLabel,
} from "@/shared/services/AuditLog";
import { GetAuditLogsParams } from "@/shared/api/types";
import { auditLogService } from "@/shared/services/auditLogsService";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";

type InvoiceAuditCardProps = {
  resourceId: string;
  resourceType: string;
};

export function InvoiceAuditCard({ resourceId, resourceType }: InvoiceAuditCardProps) {

  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogView[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [size] = useState(5);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);

        const params: GetAuditLogsParams = {
          resourceType: resourceType,
          resourceId: resourceId,
          keyword: undefined,
          page: currentPage,
          size,
        };

        const response = await auditLogService.getAuditLogs(params);

        setAuditLogs(response.content);
        setTotalElements(response.totalElements);
        setTotalPages(response.totalPages);
      } catch (err) {
        appToast.error(
          "Erreur de fetch logs",
          getApiErrorMessage(err)
        );
      } finally {
        setLoading(false);
      }
    };

    if (resourceId) {
      fetchLogs();
    }
  }, [resourceId, currentPage, size]);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <SectionLabel>Journal d’audit</SectionLabel>

        {!loading && (
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
            {totalElements} événement{totalElements > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="mt-4">
        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-lg bg-slate-100 p-4"
              >
                <div className="h-3 w-40 rounded bg-slate-200" />
                <div className="mt-2 h-2 w-56 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && totalElements === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
            <p className="text-sm font-bold text-slate-500">
              Aucun événement
            </p>

            <p className="mt-1 text-xs font-medium text-slate-400">
              Le journal d’audit est vide pour cette facture.
            </p>
          </div>
        )}

        {/* Logs */}
        {!loading && auditLogs.length > 0 && (
          <>
            <div
              className="max-h-[240px] overflow-y-auto pr-2"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#CBD5E1 transparent",
              }}
            >
              <div className="flex flex-col gap-3">
                {auditLogs.map((auditLog, index) => {
                  const isExpanded = expandedLog === auditLog.id;

                  return (
                    <div
                      key={auditLog.id ?? index}
                      className="relative flex items-start gap-3"
                    >
                      {/* Timeline */}
                      {index < auditLogs.length - 1 && (
                        <div className="absolute left-[5px] top-4 h-full w-px bg-blue-100" />
                      )}

                      <div className="z-10 mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />

                      <div className="min-w-0 flex-1 pb-2">
                        {/* Event */}
                        <p className="text-sm font-bold text-slate-950">
                          {getAuditActionLabel(auditLog.action)}
                        </p>

                        <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                          {auditLog.timestamp
                            ? formatDateLongWithTime(
                                new Date(auditLog.timestamp)
                              )
                            : "—"}{" "}
                          - {auditLog.actor?.firstName}{" "}
                          {auditLog.actor?.lastName}
                        </p>

                        {/* Before / After buttons */}
                        <div className="mt-2 flex gap-2">
                          {auditLog.before && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedLog(isExpanded ? null : auditLog.id)
                              }
                              className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 hover:bg-slate-200"
                            >
                              {isExpanded ? "Masquer détails" : "Voir détails"}
                            </button>
                          )}

                          {auditLog.after && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedLog(isExpanded ? null : auditLog.id)
                              }
                              className="rounded-md bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600 hover:bg-blue-100"
                            >
                              {isExpanded ? "Masquer détails" : "Voir détails"}
                            </button>
                          )}
                        </div>

                        {/* Before / After content */}
                        {isExpanded && (
                          <div className="mt-2 space-y-2">
                            {auditLog.before && (
                              <div className="rounded-lg bg-slate-50 p-2">
                                <p className="mb-1 text-[10px] font-bold uppercase text-slate-400">
                                  Avant
                                </p>

                                <pre className="max-h-32 overflow-auto whitespace-pre-wrap break-words text-[11px] text-slate-600">
                                  {JSON.stringify(auditLog.before, null, 2)}
                                </pre>
                              </div>
                            )}

                            {auditLog.after && (
                              <div className="rounded-lg bg-blue-50 p-2">
                                <p className="mb-1 text-[10px] font-bold uppercase text-blue-500">
                                  Après
                                </p>

                                <pre className="max-h-32 overflow-auto whitespace-pre-wrap break-words text-[11px] text-slate-600">
                                  {JSON.stringify(auditLog.after, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Page {currentPage} / {totalPages}
                </span>

                <div className="flex gap-2">
                  <button
                    disabled={!canGoPrevious}
                    onClick={() =>
                      setCurrentPage((page) => page - 1)
                    }
                    className="rounded border px-3 py-1 text-xs disabled:opacity-40"
                  >
                    Précédent
                  </button>

                  <button
                    disabled={!canGoNext}
                    onClick={() =>
                      setCurrentPage((page) => page + 1)
                    }
                    className="rounded border px-3 py-1 text-xs disabled:opacity-40"
                  >
                    Suivant
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
}