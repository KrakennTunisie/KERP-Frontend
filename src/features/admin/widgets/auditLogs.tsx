"use client";

import { useEffect, useState } from "react";
import {
  Search,
  SearchSlash,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { auditActionLabels, AuditLogView, getAuditActionLabel } from "@/shared/services/AuditLog";
import { GetAuditLogsParams } from "@/shared/api/types";
import { auditLogService } from "@/shared/services/auditLogsService";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { formatDateLongWithTime } from "@/shared/utils/formatDate";


export default function AuditLogs({ userId }: { userId: string }) {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  const [auditLogs, setAuditLogs] = useState<AuditLogView[] | []>([]);
  const [loading, setLoading] = useState(true);

  const [totalElements, setTotalElements]=useState(0)
  const [totalPages, setTotalPages]=useState(0)

  const debouncedSearchQuery = useDebounce(search, 2000);

  const [currentPage, setCurrentPage] = useState(1);
  const [size] = useState(5);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);

        const keyword =
            debouncedSearchQuery.trim().length >= 3
                ? debouncedSearchQuery.trim()
                : undefined;
        const params: GetAuditLogsParams = {
          resourceType: "User",
          resourceId: userId,
          keyword: keyword,
          date: date,
          page:currentPage,
          size,
        };

        const response = await auditLogService.getAuditLogs(params);

        setAuditLogs(response.content);
        setTotalElements(response.totalElements)
        setTotalPages(response.totalPages)
      } catch (err) {
        appToast.error("Erreur de fetch logs", getApiErrorMessage(err))
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchLogs();
    }
  }, [userId, debouncedSearchQuery, currentPage, size, date]);


  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <p className="text-[13px] font-medium text-slate-900">
            Audit logs
          </p>

          <p className="text-[11px] text-slate-400 mt-0.5">
            {totalElements ?? 0} événement
            {(totalElements ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />

            <input
              placeholder="Rechercher..."
              className="h-8 pl-8 pr-3 border border-slate-200 rounded-lg text-[12px] bg-slate-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors w-40"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              disabled={loading}
            />
          </div>

          <input
            type="date"
            className="h-8 px-2.5 border border-slate-200 rounded-lg text-[12px] bg-slate-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              console.log(e.target.value);
              setCurrentPage(1);
            }}
            disabled={loading}
          />
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <Loader2 className="h-6 w-6 mb-2 animate-spin" />
          <p className="text-[13px]">
            Chargement des événements...
          </p>
        </div>
      )}


      {/* Empty */}
      {!loading && auditLogs.length === 0 && (
        <div className="flex flex-col items-center py-12 text-slate-400">
          <SearchSlash className="h-6 w-6 mb-2 opacity-40" />
          <p className="text-[13px]">
            {"Aucun événement d'audit"}
          </p>
        </div>
      )}

      {/* Logs */}
      {!loading &&  auditLogs.length > 0 && (
        <>
          <div className="space-y-1.5 overflow-auto pr-0.5">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-transparent hover:bg-slate-50 hover:border-slate-200 transition-colors"
              >
                <div className="mt-[5px] h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />

                <div className="flex-1 min-w-0">
                  {/* Action + date */}
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-[12px] font-medium text-slate-900 truncate">
                      {getAuditActionLabel(log.action)}
                    </p>

                    <span className="text-[11px] text-slate-400 whitespace-nowrap">
                      {formatDateLongWithTime(new Date(log.timestamp))}
                    </span>
                  </div>

                  {/* Effectué par */}
                  <p className="text-[11px] text-slate-500 mt-1">
                    <span className="font-medium text-slate-700">Effectué par :</span>{" "}
                    {log.actor?.firstName} {log.actor?.lastName}
                    {log.actor?.role ? ` · ${log.actor.role}` : ""}
                  </p>

                  {/* Before / After */}
                  {(log.before || log.after) && (
                    <div className="mt-2 space-y-1.5">
                      {log.before && (
                        <details className="group">
                          <summary className="cursor-pointer text-[11px] text-slate-500 hover:text-slate-700">
                            <span className="font-medium">Before</span>
                          </summary>

                          <pre className="mt-1 p-2 rounded-md bg-slate-50 border border-slate-200 text-[10px] text-slate-600 overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(log.before, null, 2)}
                          </pre>
                        </details>
                      )}

                      {log.after && (
                        <details className="group">
                          <summary className="cursor-pointer text-[11px] text-slate-500 hover:text-slate-700">
                            <span className="font-medium">After</span>
                          </summary>

                          <pre className="mt-1 p-2 rounded-md bg-slate-50 border border-slate-200 text-[10px] text-slate-600 overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(log.after, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  )}
                </div>

                {/* Outcome */}
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${
                    log.outcome === "SUCCESS"
                      ? "bg-emerald-50 text-emerald-600"
                      : log.outcome === "FAILURE"
                        ? "bg-red-50 text-red-600"
                        : "bg-slate-50 text-slate-500"
                  }`}
                >
                  {log.outcome ?? "N/A"}
                </span>
              </div>
            ))}
          </div>

          {/* Pagination */}
{/* PAGINATION */}
{totalPages > 0 && (
  <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

    {/* INFO */}
    <div className="text-[11px] text-slate-500">
      {totalElements > 0 && (
        <span>
          <span className="font-semibold text-slate-700">
            {totalElements}
          </span>{" "}
          {`événement${totalElements > 1 ? "s" : ""}`}
        </span>
      )}
    </div>

    {/* PAGINATION */}
    <div className="flex items-center gap-1">

      {/* PREVIOUS */}
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={!canGoPrevious || loading}
        aria-label="Page précédente"
        className="
          inline-flex h-8 w-8 items-center justify-center
          rounded-md border border-slate-200 bg-white
          text-slate-500
          transition-all
          hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700
          disabled:cursor-not-allowed disabled:opacity-40
        "
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </button>

      {/* PAGES */}
      <div className="flex items-center gap-1">

        {(() => {
          const pages: (number | "ellipsis")[] = [];

          // Peu de pages → tout afficher
          if (totalPages <= 7) {
            for (let page = 1; page <= totalPages; page++) {
              pages.push(page);
            }
          } else {
            // Première page
            pages.push(1);

            // Pages autour de la page courante
            if (currentPage > 4) {
              pages.push("ellipsis");
            }

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let page = startPage; page <= endPage; page++) {
              pages.push(page);
            }

            // Dernière page
            if (currentPage < totalPages - 3) {
              pages.push("ellipsis");
            }

            pages.push(totalPages);
          }

          return pages.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-8 w-8 items-center justify-center text-[11px] text-slate-400"
                >
                  •••
                </span>
              );
            }

            const isActive = currentPage === page;

            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                disabled={loading}
                aria-current={isActive ? "page" : undefined}
                className={`
                  inline-flex h-8 min-w-8 items-center justify-center
                  rounded-md px-2
                  text-[11px] font-semibold
                  transition-all
                  disabled:cursor-not-allowed
                  ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                  }
                `}
              >
                {page}
              </button>
            );
          });
        })()}

      </div>

      {/* NEXT */}
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={!canGoNext || loading}
        aria-label="Page suivante"
        className="
          inline-flex h-8 w-8 items-center justify-center
          rounded-md border border-slate-200 bg-white
          text-slate-500
          transition-all
          hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700
          disabled:cursor-not-allowed disabled:opacity-40
        "
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </button>

    </div>

    {/* PAGE INDICATOR */}
    <div className="hidden text-[11px] text-slate-400 sm:block">
      Page{" "}
      <span className="font-semibold text-slate-600">
        {currentPage}
      </span>{" "}
      sur{" "}
      <span className="font-semibold text-slate-600">
        {totalPages}
      </span>
    </div>

  </div>
)}
        </>
      )}
    </div>
  );
}