"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
} from "lucide-react";

import { formatDateLongWithTime } from "@/shared/utils/formatDate";
import { partnerTypeSchema } from "@/features/billing/types/partnerType";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import SectionCard from "./sectionCard";
import { AuditLogAPI } from "@/features/billing/api/partners-api";
import { AuditLog } from "@/features/billing/models/AuditLogs";

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
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [size] = useState(5);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoadingLogs(true);

        let response: AuditLog[];

        if (partnerType === partnerTypeSchema.enum.CLIENT) {
          response = await AuditLogAPI.getAuditLogs(partnerId);
        } else {
          response = await AuditLogAPI.getAuditLogsBySupplier(partnerId);
        }

        setLogs(response);

        /*
         * Pour le moment, ton API retourne directement un tableau.
         * Il n'y a pas de totalElements / totalPages dans la réponse
         * que tu as fournie.
         *
         * On calcule donc la pagination côté frontend.
         */
        setTotalElements(response.length);
        setTotalPages(Math.ceil(response.length / size));
      } catch (err) {
        appToast.error(
          "Erreur de chargement des logs",
          getApiErrorMessage(err)
        );

        setLogs([]);
        setTotalElements(0);
        setTotalPages(0);
      } finally {
        setLoadingLogs(false);
      }
    };

    if (partnerId) {
      fetchLogs();
    }
  }, [partnerId, partnerType, size]);

  /*
   * Pagination côté frontend
   */
  const startIndex = (currentPage - 1) * size;
  const endIndex = startIndex + size;

  const paginatedLogs = logs.slice(startIndex, endIndex);

  /*
   * Si le nombre de pages change, on évite de rester
   * sur une page inexistante.
   */
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /*
   * Retourne le nom du partenaire à afficher
   */
  const getActorName = (log: AuditLog) => {
    if (log.partner?.companyName) {
      return log.partner.companyName;
    }

    if (log.partner?.partnerName) {
      return log.partner.partnerName;
    }

    if (log.triggeredBy) {
      return log.triggeredBy;
    }

    return "Système";
  };

  /*
   * Transforme CREATED en "Created",
   * STATUS_CHANGED en "Status changed", etc.
   */
  const getActionLabel = (auditLogType: string | null) => {
    if (!auditLogType) {
      return "Action";
    }

    return auditLogType
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/^\w/, (char) => char.toUpperCase());
  };

  return (
    <SectionCard
      title="Journal d'activités"
      description="Historique des actions liées au partenaire"
      icon={Activity}
      iconClassName="text-blue-600"
      contentClassName="p-0"
    >
      {/* ========================= */}
      {/* Loading */}
      {/* ========================= */}

      {loadingLogs && (
        <div className="flex items-center justify-center py-10">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

            <span>Chargement des activités...</span>
          </div>
        </div>
      )}

      {/* ========================= */}
      {/* Empty state */}
      {/* ========================= */}

      {!loadingLogs && logs.length === 0 && (
        <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
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

      {/* ========================= */}
      {/* Logs */}
      {/* ========================= */}

      {!loadingLogs && paginatedLogs.length > 0 && (
        <div>
          <div className="max-h-[400px] overflow-y-auto">
            {paginatedLogs.map((log) => {
              const Icon = getActivityIcon(
                log.auditLogType ?? "CREATED"
              );

              const actorName = getActorName(log);

              const actionLabel = getActionLabel(
                log.auditLogType
              );

              return (
                <div
                  key={log.idLog}
                  className="border-b border-slate-100 px-4 py-3 last:border-b-0 hover:bg-slate-50/50"
                >
                  <div className="flex items-start gap-3">
                    {/* ========================= */}
                    {/* Icon */}
                    {/* ========================= */}

                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <Icon className="h-4 w-4" />
                    </div>

                    {/* ========================= */}
                    {/* Content */}
                    {/* ========================= */}

                    <div className="min-w-0 flex-1">
                      {/* Action */}

                      <div className="flex items-center gap-2">
                        <p className="truncate text-xs font-medium text-slate-800">
                          {actionLabel}
                        </p>

                        {/* Type */}

                        {log.auditLogType && (
                          <span className="shrink-0 rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600">
                            {log.auditLogType}
                          </span>
                        )}
                      </div>

                      {/* Description */}

                      {log.description && (
                        <p className="mt-1 text-xs text-slate-600">
                          {log.description}
                        </p>
                      )}

                      {/* Actor + Date */}

                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
                        <span>
                          Par{" "}
                          <span className="font-medium text-slate-500">
                            {actorName}
                          </span>
                        </span>

                        <span className="text-slate-300">
                          •
                        </span>

                        <span>
                          {formatDateLongWithTime(
                            new Date(log.logDate)
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ========================= */}
          {/* Pagination */}
          {/* ========================= */}

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
              {/* Total */}

              <p className="text-[11px] text-slate-400">
                {totalElements} activité
                {totalElements > 1 ? "s" : ""}
              </p>

              {/* Controls */}

              <div className="flex items-center gap-1">
                {/* Previous */}

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.max(1, page - 1)
                    )
                  }
                  disabled={
                    currentPage === 1 || loadingLogs
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Page précédente"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                {/* Current page */}

                <span className="px-2 text-[11px] font-medium text-slate-600">
                  Page {currentPage} / {totalPages}
                </span>

                {/* Next */}

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(totalPages, page + 1)
                    )
                  }
                  disabled={
                    currentPage === totalPages ||
                    loadingLogs
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Page suivante"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </SectionCard>
  );
}