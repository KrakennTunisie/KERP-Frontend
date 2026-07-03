/* ================= AUDIT LOGS ================= */

import { AuditLog } from "@/features/billing/models/AuditLogs";
import { getAuditEventLabel } from "@/shared/lib/auditEventLabel";
import {  formatDateLongWithTime } from "@/shared/utils/formatDate";
import { Search, SearchSlash } from "lucide-react";
import { useMemo, useState } from "react";

export default function AuditLogs({ logs }: { logs: AuditLog[] }) {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
    console.log("logs: ", logs)  
    const filtered = useMemo(
    () =>
      logs.filter((l) => {
        const matchAction = l.auditLogType
          ?.toLowerCase()
          .includes(search.toLowerCase());
        const matchDate = date ? l.logDate== new Date(date) : true;
        return matchAction && matchDate;
      }),
    [logs, search, date]
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <p className="text-[13px] font-medium text-slate-900">Audit logs</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {filtered.length} événement{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              placeholder="Rechercher..."
              className="h-8 pl-8 pr-3 border border-slate-200 rounded-lg text-[12px] bg-slate-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors w-40"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <input
            type="date"
            className="h-8 px-2.5 border border-slate-200 rounded-lg text-[12px] bg-slate-50 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5 overflow-auto pr-0.5">
        {logs.map((log) => (
          <div
            key={log.idLog}
            className="flex items-start gap-3 p-3 rounded-lg border border-transparent hover:bg-slate-50 hover:border-slate-200 transition-colors group"
          >
            <div className="mt-[5px] h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-[12px] font-medium text-slate-900 truncate">
                  {log.auditLogType ? getAuditEventLabel(log.entityName, log.auditLogType) :  ""}
                </p>
                <span className="text-[11px] text-slate-400 whitespace-nowrap flex-shrink-0">
                  {formatDateLongWithTime(log.logDate)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                {log.description}
              </p>
            </div>
          </div>
        ))}

        {logs.length === 0 && (
          <div className="flex flex-col items-center py-12 text-slate-400">
            <SearchSlash className="h-6 w-6 mb-2 opacity-40" />
            <p className="text-[13px]">Aucun résultat</p>
          </div>
        )}
      </div>
    </div>
  );
}