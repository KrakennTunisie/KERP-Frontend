"use client";

import {
  Truck,
  Users,
  TrendingDown,
  TrendingUp,
  FileText,
  Clock,
  CircleDollarSign,
  Pencil,
  Plus,
  Send,
  Trash2,
  UserPen,
  RefreshCw,
  ReceiptText,
  Eye,
  CreditCard,
} from "lucide-react";
import {Receipt,Mail,CheckCircle,Package,Euro,} from "lucide-react";
import PartnerStatCard from "../widgets/partnerStatCard";
import PartnerHeader from "./partnerHeroSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { formatDateLong } from "@/shared/utils/formatDate";
import { mockPurchaseOrders } from "../../mocks/purchase-order-mocks";
import { mockPartner } from "../../mocks/partner-mocks";
import { DocumentPreviewModal } from "@/shared/components/ui/documentPreviewModal";
import PartnerCollapsibleSection from "../widgets/collapseSection";
import RowActions from "../widgets/rowActions";
import PartnerDetailsCard from "../widgets/partnerDetailsCard";
import ActivityLogCard from "@/shared/components/ui/activityLogCard";
import RevenueExpenseBarChart from "../widgets/RevnueExpensesBarChart";
import EmailHistoryCard from "@/shared/components/ui/emailHistoryLog";
import { purchaseOrderStatusColors, purchaseOrderStatusLabels } from "../../types/purchaseOrderStatus";
import { DocumentListItem } from "../widgets/documentListItem";
import { useState } from "react";
import { SendEmailModal } from "@/shared/components/widgets/sendEmailModal";
import { ClientPartnerDetails, SupplierPartnerDetails } from "../../models/partner";
import { PartnerInvoiceStats } from "../../types/partnersStats";
import { InvoicePageItem } from "../../models/invoice";
import { getActivityIcon } from "../../types/logsIcons";
import UseClientsDetails, { PartnerDetailsProps, Payment } from "../../hooks/useClientsDetails";
import { invoiceStatusColors, invoiceStatusLabels } from "../../types/invoiceStatus";






export default function PartnerDetails({ partner, partnerStats, partnerInvoices , partnerLogs,onRefresh }: PartnerDetailsProps) {

  const { getStatusLabel, getEmailStatusColor, chartMode, getStatusIcon, getLabelColor, getStatusColor, toggleSection, open
    , previewDocument, setPreviewDocument, selectedPeriod, setSelectedPeriod, emailLogs, clientPayments, activeTab, setActiveTab
    , chartData, HeaderIcon, setOpen, pageConfig, totalRevenueLastSixMonths, openSections } = UseClientsDetails({ partner, partnerStats, partnerInvoices,partnerLogs,onRefresh });
  console.log(chartMode)
  
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
      <PartnerHeader
        partner={partner}
        pageConfig={pageConfig}
        icon={HeaderIcon}
        setOpen={() => setOpen(true)}
      />
      {/* Main Content with Tabs */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto space-y-6">

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <PartnerStatCard
              label="CA Total"
              value={partnerStats.totalAmountTND}
              suffix="TND"
              icon={TrendingUp}
              iconWrapperClassName="bg-blue-50 ring-blue-100"
              iconClassName="text-blue-600"
            />

            <PartnerStatCard
              label="Factures"
              value={partnerStats.totalInvoices}
              icon={FileText}
              iconWrapperClassName="bg-sky-50 ring-sky-100"
              iconClassName="text-sky-600"
              helperText={`${partnerStats.paidInvoices} Payées`}
              helperClassName="text-blue-600"
            />

            <PartnerStatCard
              label="En Attente"
              value={partnerStats.pendingInvoices}
              icon={Clock}
              iconWrapperClassName="bg-gradient-to-br from-rose-50 to-red-100 ring-rose-100"
              iconClassName="text-rose-500"
              helperText={
                <>
                  {partnerStats.pendingAmountTND}
                  <span className="text-sm font-semibold text-gray-400 ml-1">
                    TND
                  </span>
                </>
              }
              helperClassName="text-yellow-600"
            />

            <PartnerStatCard
              label="Montant Moyen"
              value={partnerStats.averageInvoiceTND}
              suffix="TND"
              icon={Euro}
              iconWrapperClassName="bg-gradient-to-br from-slate-50 to-slate-100 ring-slate-200"
              iconClassName="text-slate-600"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

            {/* ── TabsList : compact, centré, pas pleine largeur ── */}
            <div className="w-full">
              <TabsList className="flex h-11 w-full rounded-xl bg-slate-100 p-1 gap-1">
                <TabsTrigger
                  value="overview"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-slate-500 transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm cursor-pointer "
                >
                  <TrendingUp className="w-4 h-4" />
                  Vue d'ensemble
                </TabsTrigger>

                <TabsTrigger
                  value="transactions"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-slate-500 transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm cursor-pointer"
                >
                  <Receipt className="w-4 h-4" />
                  Transactions
                </TabsTrigger>

                <TabsTrigger
                  value="emails"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-slate-500 transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  Emails
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ── Overview Tab ───────────────────────────────────── */}
            <TabsContent value="overview" className="space-y-6">

              <RevenueExpenseBarChart
                mode={chartMode}
                data={chartData}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
                onRefresh={() => console.log("Refresh chart")}
                totalLabel={
                  chartMode === "revenues"
                    ? `Total des revenus (${selectedPeriod} derniers mois)`
                    : `Total des dépenses (${selectedPeriod} derniers mois)`
                }
                totalValue={
                  chartMode === "revenues"
                    ? totalRevenueLastSixMonths
                    : totalRevenueLastSixMonths
                }
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Client Details */}
                <PartnerDetailsCard
                  partner={partner as ClientPartnerDetails}
                  onOpenDocument={setPreviewDocument}
                />

                {/* Activity Log — scrollable after 5 items */}
                <ActivityLogCard
                  logs={partnerLogs}
                  onRefresh={onRefresh}
                  getActivityIcon={getActivityIcon}
                
                />
              </div>
            </TabsContent>

            {/* ── Transactions Tab ───────────────────────────────── */}
            <TabsContent value="transactions" className="space-y-4">

              <PartnerCollapsibleSection
                title="Factures"
                addLabel="Ajouter facture"
                count={partnerInvoices.length}
                open={openSections.invoices}
                onToggle={() => toggleSection("invoices")}
                items={partnerInvoices}
                getKey={(invoice) => invoice.idInvoice}
                onAdd={() => console.log("Ajouter facture")}
                renderItem={(invoice) => (
                  <DocumentListItem
                    item={invoice}
                    variant="invoice"
                    icon={FileText}
                    title="facture"
                    menuTitle="Actions facture"
                    getNumber={(item) => item.invoiceNumber}
                    getDate={(item) => item.issueDate}
                    getAmount={(item) => item.totalExclTaxEUR}
                    getCurrency={(item) => item.invoiceCurrency}
                    getStatus={(item) => item.invoiceStatus}
                    statusLabels={invoiceStatusLabels}
                    statusColors={invoiceStatusColors}
                    actions={[
                      {
                        label: "Voir le détail",
                        icon: Eye,
                        onClick: () => console.log("Voir facture", invoice.idInvoice),
                      },
                      {
                        label: "Modifier",
                        icon: Pencil,
                        onClick: () => console.log("Modifier facture", invoice.idInvoice),
                        disabled: invoice.invoiceStatus === "CANCELLED",
                      },
                      {
                        label: "Envoyer",
                        icon: Send,
                        onClick: () => console.log("Envoyer facture", invoice.idInvoice),
                        disabled: invoice.invoiceStatus === "CANCELLED",
                      },
                      {
                        label: "Supprimer",
                        icon: Trash2,
                        color: "text-rose-600",
                        hover: "hover:bg-rose-50",
                        onClick: () => console.log("Supprimer facture", invoice.idInvoice),
                        disabled: invoice.invoiceStatus !== "DRAFT",
                      },
                    ]}
                  />
                )}
              />

              <PartnerCollapsibleSection
                title="Paiements clients"
                addLabel="Ajouter paiement"
                count={clientPayments.length}
                open={openSections.payments}
                onToggle={() => toggleSection("payments")}
                items={clientPayments}
                getKey={(payment) => payment.id}
                onAdd={() => console.log("Ajouter paiement")}
                renderItem={(payment) => (
                  <DocumentListItem<Payment>
                    item={payment}
                    variant="payment"
                    icon={CreditCard}
                    title="paiement"
                    menuTitle="Actions paiement"
                    getNumber={(item) => item.paymentNumber}
                    getDate={(item) => new Date(item.date)}
                    getAmount={(item) => item.amount}
                    getCurrency={() => "TND"}
                    amountLabel="Montant payé"
                    secondaryLabel="Facture"
                    getSecondaryText={(item) => item.invoiceNumber}
                    actions={[
                      {
                        label: "Voir le détail",
                        icon: Eye,
                        onClick: () => console.log("Voir paiement", payment.id),
                      },
                      {
                        label: "Modifier",
                        icon: Pencil,
                        onClick: () => console.log("Modifier paiement", payment.id),
                      },
                      {
                        label: "Supprimer",
                        icon: Trash2,
                        color: "text-rose-600",
                        hover: "hover:bg-rose-50",
                        onClick: () => console.log("Supprimer paiement", payment.id),
                      },
                  ]}
                  />
                )}
              />

              <PartnerCollapsibleSection
                title="Bons de commande"
                addLabel="Ajouter bon commande"
                count={mockPurchaseOrders.length}
                open={openSections.purchaseOrders}
                onToggle={() => toggleSection("purchaseOrders")}
                items={mockPurchaseOrders}
                getKey={(order) => order.idPurchaseOrder}
                onAdd={() => console.log("Ajouter bon de commande")}
                renderItem={(creditNote) => (
                    <DocumentListItem
                    item={creditNote}
                    variant="creditNote"
                    icon={ReceiptText}
                    title="facture d'avoir"
                    menuTitle="Actions facture d'avoir"
                    getNumber={(item) => item.purchaseOrderNumber}
                    getDate={(item) => item.issueDate}
                    getAmount={(item) => item.totalInclTax}
                    getCurrency={() => "TND"}
                    getStatus={(item) => item.purchaseOrderStatus}
                    statusLabels={purchaseOrderStatusLabels}
                    statusColors={purchaseOrderStatusColors}
                    actions={[
                        {
                        label: "Voir le détail",
                        icon: Eye,
                        onClick: () =>
                            console.log("Voir facture d'avoir", creditNote.idPurchaseOrder),
                        },
                        {
                        label: "Modifier",
                        icon: Pencil,
                        onClick: () =>
                            console.log("Modifier facture d'avoir", creditNote.idPurchaseOrder),
                        disabled: creditNote.purchaseOrderStatus === "CANCELLED",
                        },
                        {
                        label: "Envoyer",
                        icon: Send,
                        onClick: () =>
                            console.log("Envoyer facture d'avoir", creditNote.idPurchaseOrder),
                        disabled: creditNote.purchaseOrderStatus === "CANCELLED",
                        },
                        {
                        label: "Supprimer",
                        icon: Trash2,
                        color: "text-rose-600",
                        hover: "hover:bg-rose-50",
                        onClick: () =>
                            console.log("Supprimer facture d'avoir", creditNote.idPurchaseOrder),
                        disabled: creditNote.purchaseOrderStatus !== "DRAFT",
                        },
                    ]}
                    />
                )}
              />

              <PartnerCollapsibleSection
                title="Factures d'avoir"
                addLabel="Ajouter avoir"
                count={mockPurchaseOrders.length}
                open={openSections.creditNotes}
                onToggle={() => toggleSection("creditNotes")}
                items={mockPurchaseOrders}
                getKey={(creditNote) => creditNote.idPurchaseOrder}
                onAdd={() => console.log("Ajouter facture d'avoir")}
                renderItem={(creditNote) => (
                    <DocumentListItem
                    item={creditNote}
                    variant="creditNote"
                    icon={ReceiptText}
                    title="facture d'avoir"
                    menuTitle="Actions facture d'avoir"
                    getNumber={(item) => item.purchaseOrderNumber}
                    getDate={(item) => item.issueDate}
                    getAmount={(item) => item.totalInclTax}
                    getCurrency={() => "TND"}
                    getStatus={(item) => item.purchaseOrderStatus}
                    statusLabels={purchaseOrderStatusLabels}
                    statusColors={purchaseOrderStatusColors}
                    actions={[
                        {
                        label: "Voir le détail",
                        icon: Eye,
                        onClick: () =>
                            console.log("Voir facture d'avoir", creditNote.idPurchaseOrder),
                        },
                        {
                        label: "Modifier",
                        icon: Pencil,
                        onClick: () =>
                            console.log("Modifier facture d'avoir", creditNote.idPurchaseOrder),
                        disabled: creditNote.purchaseOrderStatus === "CANCELLED",
                        },
                        {
                        label: "Envoyer",
                        icon: Send,
                        onClick: () =>
                            console.log("Envoyer facture d'avoir", creditNote.idPurchaseOrder),
                        disabled: creditNote.purchaseOrderStatus === "CANCELLED",
                        },
                        {
                        label: "Supprimer",
                        icon: Trash2,
                        color: "text-rose-600",
                        hover: "hover:bg-rose-50",
                        onClick: () =>
                            console.log("Supprimer facture d'avoir", creditNote.idPurchaseOrder),
                        disabled: creditNote.purchaseOrderStatus !== "DRAFT",
                        },
                    ]}
                    />
                )}
              />

            </TabsContent>

            {/* ── Emails Tab ─────────────────────────────────────── */}
            <TabsContent value="emails">
              <EmailHistoryCard
                emails={emailLogs}
                onSendEmail={() => setOpen(true)}
                getEmailStatusColor={getEmailStatusColor}
                getStatusLabel={getStatusLabel}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
            <DocumentPreviewModal
              open={!!previewDocument}
              onClose={() => setPreviewDocument(null)}
              document={previewDocument}
            />
            <SendEmailModal
               isOpen= {open}
               onClose={()=>setOpen(false)}
               defaultTo={partner.email}
               recipientName={partner.displayName}
            />
    </div>
  );
}