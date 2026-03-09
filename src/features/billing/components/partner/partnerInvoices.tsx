"use client";

import Link from "next/link";
import {
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
} from "lucide-react";

type InvoiceStatus = "paid" | "pending" | "overdue";
type PartnerType = "CLIENT" | "SUPPLIER";

export type PartnerInvoiceItem = {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  type?: string;
};

type PartnerInvoicesCardProps = {
  partnerType: PartnerType;
  invoices: PartnerInvoiceItem[];
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

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "pending":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "overdue":
        return "bg-rose-50 text-rose-600 border-rose-100";
      default:
        return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  const getStatusLabel = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return "Payée";
      case "pending":
        return "En attente";
      case "overdue":
        return "En retard";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return CheckCircle;
      case "pending":
        return Clock;
      case "overdue":
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
        {invoices.slice(0, 3).map((invoice) => {
          const StatusIcon = getStatusIcon(invoice.status);

          return (
            <div
              key={invoice.id}
              className="px-8 py-8 hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      invoice.status === "paid"
                        ? "bg-emerald-50"
                        : invoice.status === "pending"
                        ? "bg-blue-50"
                        : "bg-rose-50"
                    }`}
                  >
                    <StatusIcon
                      className={`w-6 h-6 ${
                        invoice.status === "paid"
                          ? "text-emerald-600"
                          : invoice.status === "pending"
                          ? "text-blue-600"
                          : "text-rose-600"
                      }`}
                    />
                  </div>

                  <div>
                    <Link
                      href={
                        isSupplier
                          ? `/billing/invoices/suppliers/${invoice.id}`
                          : `/billing/invoices/clients/${invoice.id}`
                      }
                      className="text-lg font-black text-blue-600 hover:text-blue-800 tracking-tight underline-offset-4 hover:underline"
                    >
                      {invoice.number}
                    </Link>

                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>Émise: {invoice.date}</span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                        <Calendar className="w-3 h-3" />
                        <span>Échéance: {invoice.dueDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-2xl font-black text-gray-900 tracking-tighter">
                      {invoice.amount.toLocaleString()}{" "}
                      <span className="text-sm text-gray-600">TND</span>
                    </p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mt-1">
                      {invoice.type || emptyInvoiceType}
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${getStatusColor(
                      invoice.status
                    )}`}
                  >
                    {getStatusLabel(invoice.status)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {invoices.length === 0 && (
          <div className="px-8 py-10 text-sm font-bold text-gray-500">
            Aucune facture trouvée pour ce partenaire.
          </div>
        )}
      </div>
    </div>
  );
}