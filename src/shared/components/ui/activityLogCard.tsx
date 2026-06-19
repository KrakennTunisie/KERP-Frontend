import SectionCard from "./sectionCard";
import IconButton from "./iconButton";
import { Activity, Loader2, RefreshCw } from "lucide-react";
import { AuditLog } from "@/features/billing/models/AuditLogs";
import { useEffect, useState } from "react";
import { AuditLogAPI } from "@/features/billing/api/partners-api";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";
import { formatDateLongWithTime } from "@/shared/utils/formatDate";
import { partnerTypeSchema } from "@/features/billing/types/partnerType";
type ActivityLogCardProps = {
  partnerId: string;
  partnerType: string
  getActivityIcon: (type: string) => React.ElementType;
};

export default function ActivityLogCard({
  partnerId,
  partnerType,
  getActivityIcon,
}: ActivityLogCardProps) {

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoadingLogs(true)
      const clientLogs = partnerType == partnerTypeSchema.enum.CLIENT 
      ?
        await AuditLogAPI.getAuditLogs(partnerId)
      :
        await AuditLogAPI.getAuditLogsBySupplier(partnerId)

      setLogs(clientLogs);
      
    } catch (error) {
      appToast.error("Erreur fetch les logs du client: ", getApiErrorMessage(error));
    }
    finally {
      setLoadingLogs(false)
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [partnerId]);
  return (
    <SectionCard
      title="Journal d'activités"
      description="Historique des actions liées au partenaire"
      icon={Activity}
      iconClassName={"text-blue-600"}
      action={
        <IconButton
          icon={RefreshCw}
          title="Actualiser la liste"
          onClick={fetchLogs}
          variant="blue"
        />
      }
      contentClassName="p-0"
    >
      <div className="max-h-[340px] overflow-y-auto px-6 pb-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {loadingLogs ? (
                  <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    <p className="text-sm font-semibold">
                      Chargement des données...
                    </p>
                  </div>
            ): 
          logs.map((log) => {
          const Icon = getActivityIcon(log.auditLogType!);

          return (
            <div
              key={log.idLog}
              className="flex items-start gap-2.5 px-4 py-2.5"
            >

              {/* Icon */}
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mt-0.5">
                <Icon className="h-3.5 w-3.5" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">

                <p className="text-xs font-medium text-slate-800 leading-snug">
                  {log.description}
                </p>

                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-400">

                  <span>
                    {formatDateLongWithTime(log.logDate)}
                  </span>

                  <span className="text-slate-300">•</span>

                  <span>
                    Par {log.triggeredBy}
                  </span>

                </div>

              </div>

            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}