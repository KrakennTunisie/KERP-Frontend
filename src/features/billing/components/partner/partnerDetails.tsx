// src/features/billing/components/partners/PartnerDetails.tsx
"use client";

import {
  Truck,
  Users,
  TrendingDown,
  TrendingUp,
  FileText,
  Euro,
  Clock,
} from "lucide-react";
import PartnerStatCard from "../widgets/partnerStatCard";
import PartnerHeader from "./partnerHeroSection";
import PartnerInfoCard from "./partnerInfoCard";
import PartnerInvoicesCard from "./partnerInvoices";
import { ClientPartner,  Partner,  SupplierPartner } from "../../models/partner";
import { Invoice } from "../../models/invoice";

type PartnerDetailsProps = {
  partner: ClientPartner | SupplierPartner;
};
export default function PartnerDetails({ partner }: PartnerDetailsProps) {
  const isSupplier = partner.partnerType === "SUPPLIER";

  const totalInvoices = partner?.invoices?.length;
  const totalAmount = partner?.invoices?.reduce((sum, inv) => sum + inv.amount, 0);
  const paidInvoices = partner?.invoices?.filter((inv) => inv.status ===  "paid").length;
  const pendingAmount = partner?.invoices?.filter((inv: Partial<Invoice>) => inv.invoiceStatus !== "PAID")
    .reduce((sum: number, inv: Partial<Invoice>) => sum + (inv?.totalInclTaxTND || 0), 0)
  const averageInvoice = totalInvoices? totalInvoices > 0 ? totalAmount / totalInvoices : 0 : undefined;

  const pageConfig = {
    title: isSupplier ? "Fournisseur" : "Client",
    backHref: isSupplier ? "/billing/suppliers" : "/billing/clients",
    backLabel: isSupplier ? "Retour aux fournisseurs" : "Retour aux clients",
    badgeClass: isSupplier
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : "bg-blue-50 text-blue-800 border-blue-200",
    heroIconClass: isSupplier
      ? "bg-emerald-600 shadow-emerald-100"
      : "bg-blue-600 shadow-blue-100",
    heroInfoIconClass: isSupplier ? "text-emerald-600" : "text-blue-600",
    totalLabel: isSupplier ? "Dépenses Totales" : "Chiffre d'affaires",
    totalIcon: isSupplier ? TrendingDown : TrendingUp,
    totalIconClass: isSupplier
      ? "bg-rose-50 text-rose-600"
      : "bg-blue-50 text-blue-600",
    invoicesSubtitle: isSupplier
      ? "Les 3 dernières factures d'achat"
      : "Les 3 dernières factures de vente",
    invoicesButtonHref: isSupplier
      ? `/billing/invoices/suppliers?supplier=${partner.idPartner}`
      : `/billing/invoices/clients?client=${partner.idPartner}`,
    invoicesButtonLabel: "Voir toutes les factures",
    detailsTypeLabel: isSupplier ? "Fournisseur" : "Client",
    emptyInvoiceType: isSupplier ? "Achat" : "Vente",
  };

  const HeaderIcon = isSupplier ? Truck : Users;
  const TotalIcon = pageConfig.totalIcon;



  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50/30">
        <PartnerHeader
            partner={partner}
            pageConfig={pageConfig}
            icon={HeaderIcon}
        />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PartnerStatCard
                title={pageConfig.totalLabel}
                value={
                    <p className="text-3xl font-black text-gray-900 tracking-tighter">
                    {totalAmount?.toLocaleString()}{" "}
                    <span className="text-sm text-gray-600">TND</span>
                    </p>
                }
                icon={TotalIcon}
                iconContainerClassName={pageConfig.totalIconClass}
                iconClassName=""
            />

            <PartnerStatCard
                title="Factures"
                value={
                    <p className="text-3xl font-black text-gray-900 tracking-tighter">
                    {totalInvoices}
                    </p>
                }
                icon={FileText}
                iconContainerClassName="bg-emerald-50"
                iconClassName="text-emerald-600"
                footer={
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">
                    {paidInvoices} Payées
                    </p>
                }
            />



            <PartnerStatCard
                title={isSupplier ? "À Payer" : "À Encaisser"}
                value={
                    <p className="text-3xl font-black text-gray-900 tracking-tighter">
                        {totalInvoices}
                    </p>
                }
                icon={Clock}
                iconContainerClassName="bg-amber-50"
                iconClassName="text-amber-600"
                footer={
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-tighter">
                        {pendingAmount?.toLocaleString()}
                        <span className="text-sm text-gray-600">TND</span>
                    </p>
                    
                }
            />

            <PartnerStatCard
                title="Montant Moyen"
                value={
                    <p className="text-3xl font-black text-gray-900 tracking-tighter">
                        {averageInvoice?.toLocaleString()}
                    </p>
                }
                icon={Euro}
                iconContainerClassName="bg-purple-50"
                iconClassName="text-purple-600"
                footer={
                    <p className="text-[10px] font-bold text-purple-600 uppercase tracking-tighter">
                        {averageInvoice?.toLocaleString()}{" "}
                        <span className="text-sm text-gray-600">TND</span>

                    </p>
                }
            />


          </div>

            <PartnerInvoicesCard
                partnerType={partner.partnerType}
                invoices={partner.invoices}
                subtitle={pageConfig.invoicesSubtitle}
                buttonHref={pageConfig.invoicesButtonHref}
                buttonLabel={pageConfig.invoicesButtonLabel}
                emptyInvoiceType={pageConfig.emptyInvoiceType}
            />

            <PartnerInfoCard
                partner={partner}
                typeLabel={pageConfig.detailsTypeLabel}
            />
        </div>
      </main>
    </div>
  );
}