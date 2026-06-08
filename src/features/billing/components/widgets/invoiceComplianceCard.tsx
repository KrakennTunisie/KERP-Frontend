"use client";

import { ShieldIcon } from "lucide-react";
import Card from "../widgets/card";
import { SectionLabel } from "../widgets/sectionLabel";

type InvoiceComplianceCardProps = {
  invoice: any;
};

export function InvoiceComplianceCard({ invoice }: InvoiceComplianceCardProps) {
  const status = invoice?.invoiceComplianceStatus;

  const isAccepted = status === "TTN_ACCEPTED";
  const isRejected = status === "TTN_REJECTED";

  return (
    <Card>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600">
          <ShieldIcon size={18} />
        </div>

        <div>
          <SectionLabel>Conformité e-facture</SectionLabel>

          <p className="mt-0.5 text-[11px] font-semibold text-blue-600">
            Tunisie Trade Net
          </p>
        </div>
      </div>

      <div
        className={
          isAccepted
            ? "rounded-xl bg-violet-50 p-4"
            : isRejected
              ? "rounded-xl bg-rose-50 p-4"
              : "rounded-xl bg-slate-50 p-4"
        }
      >
        {isAccepted ? (
          <div className="flex min-h-[180px] items-center justify-center rounded-lg bg-white">
            <p className="text-sm font-bold text-violet-600">
              QR CODE TTN
            </p>
          </div>
        ) : isRejected ? (
          <p className="text-center text-sm font-semibold text-rose-600">
            Facture rejetée par l’administration fiscale.
          </p>
        ) : (
          <p className="text-center text-sm font-medium text-slate-500">
            QR CODE non fourni
            <br />
            <span className="text-xs">(en attente de validation)</span>
          </p>
        )}
      </div>

      {isAccepted ? (
        <>
          <p className="mt-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
            ID de validation
          </p>

          <p className="mt-1 text-center font-mono text-sm font-bold tracking-wide text-violet-600">
            {invoice?.idInvoice ?? "ELF-XXXX"}
          </p>

          <div className="mt-3 rounded-xl bg-violet-50 p-3 text-center">
            <p className="text-[11px] font-semibold leading-relaxed text-violet-600">
              Scannez ce QR code pour vérifier l’authenticité de cette facture
              électronique.
            </p>
          </div>
        </>
      ) : isRejected ? (
        <p className="mt-3 text-center text-sm font-medium text-rose-600">
          Aucun identifiant de validation, facture rejetée.
        </p>
      ) : (
        <p className="mt-3 text-center text-sm font-medium text-slate-500">
          ID de validation non disponible.
        </p>
      )}
    </Card>
  );
}