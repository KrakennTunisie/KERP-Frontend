import SectionCard from "./sectionCard";
import IconButton from "./iconButton";
import { Activity, RefreshCw } from "lucide-react";

type ActivityLog = {
  id: string;
  type: string;
  description: string;
  date: string;
  user: string;
};

type ActivityLogCardProps = {
  logs: ActivityLog[];
  onRefresh: () => void;
  getActivityIcon: (type: string) => React.ElementType;
};

export default function ActivityLogCard({
  logs,
  onRefresh,
  getActivityIcon,
}: ActivityLogCardProps) {
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
          onClick={onRefresh}
          variant="blue"
        />
      }
      contentClassName="p-0"
    >
      <div className="max-h-[340px] overflow-y-auto px-6 pb-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {logs.map((log) => {
          const Icon = getActivityIcon(log.type);

          return (
            <div
              key={log.id}
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
                    {log.date}
                  </p>

                  <span className="text-slate-300">•</span>

                  <p className="text-[11px] text-slate-400">
                    Par {log.user}
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