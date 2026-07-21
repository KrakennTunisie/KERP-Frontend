/* ================= PERMISSIONS ================= */

import { useMemo } from "react";
import {  PermissionDTO } from "../models/permission";

export default function PermissionsMatrix({
  permissions,
}: {
  permissions: PermissionDTO[];
}) {
  const grouped = useMemo(
    () =>
      permissions.reduce<Record<string, PermissionDTO[]>>((acc, p) => {
        acc[p.clientId] = acc[p.clientId] || [];
        acc[p.clientId].push(p);
        return acc;
      }, {}),
    [permissions]
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-[13px] font-medium text-slate-900 mb-3">
        Permissions
      </p>

      <div className="space-y-3">
        {Object.entries(grouped).map(([cat, perms], idx, arr) => (
          <div key={cat}>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {cat}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {perms.map((p) => (
                <span
                  key={p.name}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-slate-600"
                >
                  {p.name}
                </span>
              ))}
            </div>
            {idx < arr.length - 1 && (
              <hr className="border-slate-100 mt-3" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
