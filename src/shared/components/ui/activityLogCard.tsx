import SectionCard from "./sectionCard";
import IconButton from "./iconButton";
import { Activity, Loader2, RefreshCw } from "lucide-react";
import { AuditLog } from "@/features/billing/models/AuditLogs";
import { useEffect, useState } from "react";
import { AuditLogAPI } from "@/features/billing/api/partners-api";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";
import { formatDateLongWithTime } from "@/shared/utils/formatDate";
type ActivityLogCardProps = {
  partnerId: string;
  getActivityIcon: (type: string) => React.ElementType;
};

export default function ActivityLogCard({
  partnerId,
  getActivityIcon,
}: ActivityLogCardProps) {

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoadingLogs(true)
      const clientLogs = await AuditLogAPI.getAuditLogs(partnerId)
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
      iconClassName="text-blue-600"
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
              className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0"
            >
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-3.5 h-3.5 text-blue-600" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 leading-snug">
                  {log.description}
                </p>

                <div className="flex items-center gap-1.5 mt-1">
                  <p className="text-[11px] text-slate-400">
                 {formatDateLongWithTime(log.logDate)}
                  </p>

                  <span className="text-blue-300">•</span>

                  <p className="text-[11px] text-slate-400">
                    Par {log.triggeredBy}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}