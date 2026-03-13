"use client";

import Link from "next/link";
import {
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Invoice } from "../../models/invoice";
import { InvoiceStatus } from "../../types/invoiceStatus";

type PartnerType = "CLIENT" | "SUPPLIER";

export type PartnerInvoiceItem = Partial<Invoice>;

type PartnerInvoicesCardProps = {
  partnerType: PartnerType | undefined;
  invoices: PartnerInvoiceItem[] | undefined;
  subtitle: string;
  buttonHref: string;
  buttonLabel: string;
  emptyInvoiceType: string;
};

export default function PartnerInvoicesCard({
  partnerType,
  invoices,
  subtitle,
  buttonHref,
  buttonLabel,
  emptyInvoiceType,
}: PartnerInvoicesCardProps) {
  const isSupplier = partnerType === "SUPPLIER";

  const getStatusColor = (status: InvoiceStatus | undefined) => {
    switch (status) {
      case "PAID":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "TO_PAY":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "TO_COLLECT":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "CANCELLED":
        return "bg-rose-50 text-rose-600 border-rose-100";
      default:
        return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  const getStatusLabel = (status: InvoiceStatus | undefined) => {
    switch (status) {
      case "PAID":
        return "Payée";
      case "TO_PAY":
        return "En attente";
      case "TO_COLLECT":
        return "En attente";
      case "CANCELLED":
        return "En retard";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: InvoiceStatus | undefined) => {
    switch (status) {
      case "PAID":
        return CheckCircle;
      case "TO_PAY":
        return Clock;
      case "TO_COLLECT":
        return Clock;
      case "CANCELLED":
        return AlertCircle;
      default:
        return FileText;
    }
  };

  return (
    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-8 py-8 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter">
              Dernières Factures
            </h2>
            <p className="text-sm font-bold text-gray-600 mt-1">{subtitle}</p>
          </div>

          <Link
            href={buttonHref}
            className="px-6 py-3 bg-gray-900 text-white rounded-[16px] hover:bg-black transition-all font-black text-sm shadow-lg"
          >
            {buttonLabel}
          </Link>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {invoices?.slice(0, 3).map((invoice) => {
          const StatusIcon = getStatusIcon(invoice?.invoiceStatus);

          return (
            <div
              key={invoice.idInvoice}
              className="px-8 py-8 hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      invoice?.invoiceStatus === "PAID"
                        ? "bg-emerald-50"
                        : invoice.invoiceStatus === "TO_COLLECT" || "TO_PAY"
                        ? "bg-blue-50"
                        : "bg-rose-50"
                    }`}
                  >
                    <StatusIcon
                      className={`w-6 h-6 ${
                        invoice.invoiceStatus === "PAID"
                          ? "text-emerald-600"
                          : invoice.invoiceStatus === "TO_COLLECT" || "TO_PAY"
                          ? "text-blue-600"
                          : "text-rose-600"
                      }`}
                    />
                  </div>

                  <div>
                    <Link
                      href={
                        isSupplier
                          ? `/billing/invoices/suppliers/${invoice.idInvoice}`
                          : `/billing/invoices/clients/${invoice.idInvoice}`
                      }
                      className="text-lg font-black text-blue-600 hover:text-blue-800 tracking-tight underline-offset-4 hover:underline"
                    >
                      {invoice.invoiceNumber}
                    </Link>

                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>Émise: {invoice?.issueDate?.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                        <Calendar className="w-3 h-3" />
                        <span>Échéance: {invoice.dueDate?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-2xl font-black text-gray-900 tracking-tighter">
                      {invoice?.totalInclTaxTND?.toLocaleString()}{" "}
                      <span className="text-sm text-gray-600">TND</span>
                    </p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mt-1">
                      {invoice.invoiceType || emptyInvoiceType}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${getStatusColor(
                      invoice.invoiceStatus
                    )}`}
                  >
                    {getStatusLabel(invoice?.invoiceStatus)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {invoices?.length === 0 && (
          <div className="px-8 py-10 text-sm font-bold text-gray-500">
            Aucune facture trouvée pour ce partenaire.
          </div>
        )}
      </div>
    </div>
  );
}