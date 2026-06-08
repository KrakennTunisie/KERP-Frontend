"use client";

import Card from "../widgets/card";
import { SectionLabel } from "../widgets/sectionLabel";
import { formatDateLongWithTime } from "@/shared/utils/formatDate";

type InvoiceAuditCardProps = {
  invoice: any;
};

export function InvoiceAuditCard({ invoice }: InvoiceAuditCardProps) {
  const events = invoice?.invoiceEvents ?? [];

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <SectionLabel>Journal d’audit</SectionLabel>

        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
          {events.length} événement{events.length > 1 ? "s" : ""}
        </span>
      </div>

      {events.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
          <p className="text-sm font-bold text-slate-500">
            Aucun événement
          </p>

          <p className="mt-1 text-xs font-medium text-slate-400">
            Le journal d’audit est vide pour cette facture.
          </p>
        </div>
      ) : (
        <div
          className="flex max-h-[350px] flex-col gap-3.5 overflow-y-auto pr-2"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#CBD5E1 transparent",
          }}
        >
          {events.map((event: any, index: number) => (
            <div
              key={event.idInvoiceEvent ?? index}
              className="relative flex items-start gap-3"
            >
              {index < events.length - 1 && (
                <div className="absolute left-[5px] top-4 h-full w-px bg-blue-100" />
              )}

              <div className="z-10 mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />

              <div className="min-w-0">
                <p className="text-sm font-bold leading-snug text-slate-950">
                  {event.invoiceEventType}
                </p>

                <p className="mt-0.5 text-[11px] font-semibold text-slate-400">
                  {event.eventDate
                    ? formatDateLongWithTime(event.eventDate)
                    : "—"}{" "}
                  {event.eventTrigger ? `- ${event.eventTrigger}` : ""}
                </p>

                {event.description && (
                  <p className="mt-0.5 text-[11px] leading-5 text-slate-500">
                    {event.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}