"use client";
import { TrendingUp, FileText, Clock, ReceiptText, Receipt, Mail, CheckCircle, Package, Euro, } from "lucide-react";
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
import InvoiceListItem from "../widgets/invoiceListItem";
import RevenueExpenseBarChart from "../widgets/RevnueExpensesBarChart";
import EmailHistoryCard from "@/shared/components/ui/emailHistoryLog";
import { purchaseOrderStatusColors, purchaseOrderStatusLabels } from "../../types/purchaseOrderStatus";
import UseClientsDetails, { PartnerDetailsProps } from "../../hooks/useClientsDetails";
import { ClientPartnerDetails } from "../../models/partner";
import { getActivityIcon } from "../../types/logsIcons";
import { refresh } from "next/cache";
import { partnerTypeSchema } from "../../types/partnerType";


export default function PartnerDetails({ partner, clientRevenueInitial,supplierDespensesInitial, totalRevenueInitial,totalDespensesInitial, partnerStats, partnerInvoices, partnerLogs, onRefresh }: PartnerDetailsProps) {

  const { getStatusLabel, getEmailStatusColor, chartMode, getStatusIcon, getLabelColor, getStatusColor, toggleSection, clientRevenue, fetchPartnerStats, totalRevenue,totalDespenses
    , previewDocument, setPreviewDocument, selectedPeriod, setSelectedPeriod, emailLogs, clientPayments, activeTab, setActiveTab, refresh,setRefresed,supplierDespenses
    , chartData, HeaderIcon, setOpen, pageConfig, totalRevenueLastSixMonths, openSections } = UseClientsDetails({ partner, partnerStats, clientRevenueInitial,supplierDespensesInitial, totalRevenueInitial, totalDespensesInitial, partnerInvoices, partnerLogs, onRefresh });
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
        <div className="max-w-7xl mx-auto space-y-6">

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

           { partner.partnerType == partnerTypeSchema.enum.CLIENT ?  <RevenueExpenseBarChart
                mode={"revenues"}
                data={ refresh ? (clientRevenue ?? []) : (clientRevenueInitial ?? [])}
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
                onRefresh={() => {
                 fetchPartnerStats(partner, selectedPeriod.toString())
                 setRefresed(true);

                }}
                totalLabel={
                 `Total des revenus (${selectedPeriod} derniers mois)`
                }
                totalValue={
                     refresh ? totalRevenue : totalRevenueInitial
                }
              />:
              <RevenueExpenseBarChart
                mode={"expenses"}
                data={ refresh ? (supplierDespenses ?? []) : (supplierDespensesInitial ?? []) }
                selectedPeriod={selectedPeriod}
                onPeriodChange={setSelectedPeriod}
                onRefresh={() => {
                 fetchPartnerStats(partner, selectedPeriod.toString())
                 setRefresed(true);

                }}
                totalLabel={`Total des dépenses (${selectedPeriod} derniers mois)`}
                totalValue={
                  refresh ? totalDespenses : totalDespensesInitial
                }
              />
              }

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
                renderItem={(invoice) =>
                (
                  <InvoiceListItem
                    key={invoice.idInvoice}
                    invoice={invoice}
                    currency="TND"
                    getStatusIcon={getStatusIcon}
                    getStatusColor={() => getStatusColor(invoice.invoiceStatus)}
                    getStatusLabel={() => getLabelColor(invoice.invoiceStatus)}
                    onOpen={(id) => console.log("Ouvrir facture", id)}
                    onEdit={(id) => console.log("Modifier facture", id)}
                    onDelete={(id) => console.log("Supprimer facture", id)}
                  />
                )
                }
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
                  <div className="flex items-center justify-between p-3.5 bg-slate-50/60 rounded-xl hover:bg-slate-100/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                      </div>

                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {payment.number}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {payment.method} · Pour {payment.invoiceNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="text-base font-black text-emerald-600">
                        {payment.amount.toLocaleString()}
                        <span className="text-xs font-semibold text-slate-400 ml-1">
                          TND
                        </span>
                      </p>

                      <p className="text-[11px] text-slate-400">
                        {payment.date}
                      </p>

                      <RowActions
                        onEdit={() => console.log("Modifier paiement", payment.id)}
                        onDelete={() => console.log("Supprimer paiement", payment.id)}
                      />
                    </div>
                  </div>
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
                renderItem={(order) => (
                  <div className="flex items-center justify-between p-3.5 bg-slate-50/60 rounded-xl hover:bg-slate-100/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4 text-purple-500" />
                      </div>

                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {order.purchaseOrderNumber}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {formatDateLong(order.issueDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="text-base font-black text-slate-900">
                        {order.totalExclTax?.toLocaleString() ?? "—"}
                        <span className="text-xs font-semibold text-slate-400 ml-1">
                          TND
                        </span>
                      </p>

                      <Badge className={purchaseOrderStatusColors[order.purchaseOrderStatus]}>
                        {purchaseOrderStatusLabels[order.purchaseOrderStatus]}
                      </Badge>

                      <RowActions
                        onEdit={() => console.log("Modifier bon commande", order.idPurchaseOrder)}
                        onDelete={() => console.log("Supprimer bon commande", order.idPurchaseOrder)}
                      />
                    </div>
                  </div>
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
                  <div className="flex items-center justify-between p-3.5 bg-slate-50/60 rounded-xl hover:bg-slate-100/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-rose-50 rounded-xl flex items-center justify-center shrink-0">
                        <ReceiptText className="w-4 h-4 text-rose-600" />
                      </div>

                      <div>
                        <p className="text-sm font-black text-slate-900">
                          {creditNote.purchaseOrderNumber}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Date : {formatDateLong(creditNote.issueDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="text-base font-black text-slate-900">
                        {creditNote.totalExclTax?.toLocaleString() ?? "—"}
                        <span className="text-xs font-semibold text-slate-400 ml-1">
                          TND
                        </span>
                      </p>

                      <Badge className={purchaseOrderStatusColors[creditNote.purchaseOrderStatus]}>
                        {purchaseOrderStatusLabels[creditNote.purchaseOrderStatus]}
                      </Badge>

                      <RowActions
                        onEdit={() =>
                          console.log("Modifier facture d'avoir", creditNote.idPurchaseOrder)
                        }
                        onDelete={() =>
                          console.log("Supprimer facture d'avoir", creditNote.idPurchaseOrder)
                        }
                      />
                    </div>
                  </div>
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
    </div>
  );
}