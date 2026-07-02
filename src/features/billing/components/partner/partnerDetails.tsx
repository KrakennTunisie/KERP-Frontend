"use client";

import ActivityLogCard from "@/shared/components/ui/activityLogCard";
import { DocumentPreviewModal } from "@/shared/components/ui/documentPreviewModal";
import EmailHistoryCard from "@/shared/components/ui/emailHistoryLog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { SendEmailModal } from "@/shared/components/widgets/sendEmailModal";
import {
  Clock,
  CreditCard,
  Euro,
  Eye,
  FileText,
  Mail,
  Pencil,
  Receipt,
  ReceiptText,
  Send,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import UseClientsDetails, { PartnerDetailsProps } from "../../hooks/useClientsDetails";
import { InvoiceCreditNotePageItem } from "../../models/creditNote";
import { InvoicePageItem } from "../../models/invoice";
import { ClientPartnerDetails } from "../../models/partner";
import { PaymentListItem } from "../../models/payment";
import { PurchaseOrderPageItem } from "../../models/purchaseOrder";
import { currencyTypeSchema } from "../../types/currency";
import { invoiceStatusColors, invoiceStatusLabels } from "../../types/invoiceStatus";
import { getActivityIcon } from "../../types/logsIcons";
import { partnerTypeSchema } from "../../types/partnerType";
import { purchaseOrderStatusColors, purchaseOrderStatusLabels } from "../../types/purchaseOrderStatus";
import PurchaseOrderModal, { PurchaseOrderModalContent } from "../purchaseOrder/purchaseOrderDetails";
import SupplierPurchaseOrderModal, { SupplierPurchaseOrderModalContent } from "../purchaseOrder/supplierPurchaseOrderDetails";
import PartnerCollapsibleSection from "../widgets/collapseSection";
import { DeleteInvoiceModal } from "../widgets/deleteInvoiceModal";
import { DocumentListItem } from "../widgets/documentListItem";
import PartnerDetailsCard from "../widgets/partnerDetailsCard";
import PartnerStatCard from "../widgets/partnerStatCard";
import RevenueExpenseBarChart from "../widgets/RevnueExpensesBarChart";
import { SendDocumentModal } from "../widgets/sendInvoiceModal";
import PartnerHeader from "./partnerHeroSection";
import { getEmailStatusColor, getStatusLabel } from "../../types/emailLog";
import { MailDetailsModal } from "@/shared/components/ui/emailLogModal";
import AddDocumentModal from "@/shared/components/ui/addDocumentModal";
import { PartnerDocumentType } from "../../types/documentType";


export default function PartnerDetails({ partner, clientRevenueInitial, supplierDespensesInitial, totalRevenueInitial, totalDespensesInitial, partnerStats, onRefresh }: PartnerDetailsProps) {

  const {deleteClientInvoice,deleteLoading,setDeleteLoading,setDeleteOpen,invoiceRef,deleteOpen,setInvoiceId,purchaseOrderId,setPurchaseOrderId,setDeletePOrderOpen,deletePOrderOpen , deletePurchaseOrder,
    chartMode, getStatusIcon, getLabelColor, getStatusColor, toggleSection ,refresh,setRefresed,modalPurchaseOrderOpen,setModalPurchaseOrderOpen
    , previewDocument, setPreviewDocument, selectedPeriod, setSelectedPeriod, activeTab, setActiveTab, supplierDespenses,totalDespenses, addDocumentType, setAddDocumentType
    , TotalIcon, HeaderIcon, open, setOpen, openSections, pageConfig, fetchPartnerStats,clientRevenue, totalRevenue ,sendeMailOpen, setSendMailOpen,
    updatePartnerStatus, deletePartnerOpen, setDeletePartnerOpen, updatePartnerStatusOpen, setUpdatePartnerStatusOpen,deleteCreditInvoice,
    addDocumentLoading, setDeleteCNoteOpen,deleteCNoteOpen,creditNoteId,setCreditNoteId, modalSupplierPurchaseOrderOpen, setModalSupplierPurchaseOrderOpen, selected, setSelected, invoiceType, setInvoiceType
    ,onAddDocument ,addDocument ,sendDocumentOpen, setSendDocumentOpen, setShowDetails, showDetails, selectedEmail, setSelectedEmail, openAddDocument, setOpenAddDocument} = UseClientsDetails({ partner, partnerStats, clientRevenueInitial, supplierDespensesInitial, totalRevenueInitial, totalDespensesInitial, onRefresh});
  const router = useRouter();
  const onAction = ()=>{
    if(partner && partner.partnerType === partnerTypeSchema.enum.CLIENT){
      router.push(`/billing/clients/${partner.idPartner}/edit`)
    }
    if(partner && partner.partnerType === partnerTypeSchema.enum.SUPPLIER){
        router.push(`/billing/suppliers/${partner.idPartner}/edit`)
    }
  }
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
      <PartnerHeader
        partner={partner}
        partnerType={partner.partnerType}
        pageConfig={pageConfig}
        icon={HeaderIcon}
        setOpen={() => setOpen(true)}
        onRefresh={onRefresh}
        setDeleteOpen={setDeletePartnerOpen}
        deleteOpen={deletePartnerOpen}
        updatePartnerStatus={updatePartnerStatus}
        onAddDocument={(type: PartnerDocumentType) => onAddDocument(type)} 
        onUpdate={onAction}
       />
      <DeleteInvoiceModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => deleteClientInvoice(invoiceType)}
        loading={deleteLoading} />

      <DeleteInvoiceModal
        open={deletePOrderOpen}
        onClose={() => setDeletePOrderOpen(false)}
        onConfirm={() => deletePurchaseOrder(purchaseOrderId)}
        loading={deleteLoading} />

      <DeleteInvoiceModal
        open={deleteCNoteOpen}
        onClose={() => setDeleteCNoteOpen(false)}
        onConfirm={() => deleteCreditInvoice()}
        loading={deleteLoading} />

      <SendDocumentModal
        document={selected}
        variant="invoice"
        isOpen={sendDocumentOpen}
        onClose={() => setSendDocumentOpen(false)}
      />

      <PurchaseOrderModal
        open={modalPurchaseOrderOpen}
        title={`Bon de commande ${invoiceRef}`}
        onClose={() => setModalPurchaseOrderOpen(false)}>
        <PurchaseOrderModalContent
          purchaseOrderId={purchaseOrderId}
          onClose={() => setModalPurchaseOrderOpen(false)}
        />
      </PurchaseOrderModal>


      <SupplierPurchaseOrderModal
        open={modalSupplierPurchaseOrderOpen}
        title={`Bon de commande ${invoiceRef}`}
        onClose={() => setModalSupplierPurchaseOrderOpen(false)}>
        <SupplierPurchaseOrderModalContent
          purchaseOrderId={purchaseOrderId}
          onClose={() => setModalSupplierPurchaseOrderOpen(false)}
        />

        
      </SupplierPurchaseOrderModal>
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
              label="En Retard"
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
                  {"Vue d'ensemble"}
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

              {partner.partnerType == partnerTypeSchema.enum.CLIENT ? 
              <RevenueExpenseBarChart
                mode={"revenues"}
                data={refresh ? (clientRevenue ?? []) : (clientRevenueInitial ?? [])}
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
              /> :
                <RevenueExpenseBarChart
                  mode={"expenses"}
                  data={refresh ? (supplierDespenses ?? []) : (supplierDespensesInitial ?? [])}
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
                  onAction={onAction}
                />

                {/* Activity Log — scrollable after 5 items */}
                <ActivityLogCard
                  partnerId={partner.idPartner}
                  partnerType={partner.partnerType}
                  getActivityIcon={getActivityIcon}

                />
              </div>
            </TabsContent>

            {/* ── Transactions Tab ───────────────────────────────── */}
            <TabsContent value="transactions" className="space-y-4">

              <PartnerCollapsibleSection<InvoicePageItem>
                title="Factures"
                addLabel="Ajouter facture"
                partnerId={partner.idPartner}
                partnerType={partner.partnerType}
                transactionType="Facture"
                count={0}
                open={openSections.invoices}
                onToggle={() => toggleSection("invoices")}
                getKey={(invoice) => invoice.idInvoice}
                onAdd={() => partner.partnerType == partnerTypeSchema.enum.CLIENT ? router.push(`/billing/invoices/clients/create/`) : null}
                renderItem={(invoice) => (
                  <DocumentListItem
                    item={invoice}
                    variant="invoice"
                    icon={FileText}
                    title="facture"
                    menuTitle="Actions facture"
                    getNumber={(item) => item.invoiceNumber}
                    getDate={(item) => item.issueDate}
                    getAmount={(item) => item.invoiceCurrency == currencyTypeSchema.enum.EUR ? item.totalInclTaxEUR : item.invoiceCurrency == currencyTypeSchema.enum.USD ? item.totalInclTaxTND : item.totalInclTaxUSD}
                    getCurrency={(item) => item.invoiceCurrency}
                    getStatus={(item) => item.invoiceStatus}
                    statusLabels={invoiceStatusLabels}
                    statusColors={invoiceStatusColors}
                    onView={(item) => {
                          partner.partnerType == partnerTypeSchema.enum.CLIENT ?
                            router.push(`/billing/invoices/clients/${item.idInvoice}/details/`) :
                            router.push(`/billing/invoices/suppliers/details/${invoice.idInvoice}/`);
                          }}
                    actions={[
                      {
                        label: "Modifier",
                        icon: Pencil,
                        onClick: () => {
                          router.push(`/billing/invoices/clients/${invoice.idInvoice}/edit/`);
                        },
                        disabled: invoice.invoiceStatus === "CANCELLED",
                        visible: partner.partnerType == partnerTypeSchema.enum.CLIENT
                      },
                      {
                        label: "Envoyer",
                        icon: Send,
                        onClick: () => {
                          setSelected(invoice);
                          setSendDocumentOpen(true);
                        },
                        visible: partner.partnerType == partnerTypeSchema.enum.CLIENT
                      },
                      {
                        label: "Supprimer",
                        icon: Trash2,
                        color: "text-rose-600",
                        hover: "hover:bg-rose-50",
                        onClick: () => {
                          setInvoiceType(invoice.invoiceType);
                          setInvoiceId(invoice.idInvoice);
                          setDeleteOpen(true);
                        },
                        disabled: invoice.invoiceStatus !== "DRAFT",
                        visible: true
                      },
                    ]} />
                  )}             
                />

              <PartnerCollapsibleSection<PaymentListItem>
                partnerId={partner.idPartner}
                title="Paiements clients"
                addLabel="Ajouter paiement"
                transactionType="Paiement"
                partnerType={partner.partnerType}
                count={0}
                open={openSections.payments}
                onToggle={() => toggleSection("payments")}
                getKey={(payment) => payment.idPayment}
                onAdd={() => console.log("Ajouter paiement")}
                renderItem={(payment) => (
                  <DocumentListItem<PaymentListItem>
                    item={payment}
                    variant="payment"
                    icon={CreditCard}
                    title="paiement"
                    menuTitle="Actions paiement"
                    getNumber={(item) => item.reference}
                    getDate={(item) => new Date(item.paymentDate)}
                    getAmount={(item) => item.amount}
                    getCurrency={() => "TND"}
                    amountLabel="Montant payé"
                    secondaryLabel="Facture"
                    getSecondaryText={(item) => item.invoice.invoiceNumber}
                    onView={(item) => router.push(`/billing/payments/${item.idPayment}`)}
                    actions={[
                      {
                        label: "Modifier",
                        icon: Pencil,
                        onClick: () => router.push(`/billing/payments/update/${payment.idPayment}`),
                        visible: true
                      },
                      {
                        label: "Supprimer",
                        icon: Trash2,
                        color: "text-rose-600",
                        hover: "hover:bg-rose-50",
                        onClick: () => { console.log("Supprimer paiement", payment.idPayment); },
                        visible: true
                      },
                    ]}
                  />
                )}
              />

              <PartnerCollapsibleSection<PurchaseOrderPageItem>
                title="Bons de commande"
                addLabel="Ajouter bon commande"
                transactionType="Bon de commande"
                partnerId={partner.idPartner}
                partnerType={partner.partnerType}
                count={0}
                open={openSections.purchaseOrders}
                onToggle={() => toggleSection("purchaseOrders")}
                getKey={(order) => order.idPurchaseOrder}
                onAdd={() => console.log("Ajouter bon de commande")}
                renderItem={(PurchaseOrder) => (
                  <DocumentListItem
                    item={PurchaseOrder}
                    variant="purchaseOrder"
                    icon={ReceiptText}
                    title="Bon de commande"
                    menuTitle="Actions bon de commande"
                    onView={() => {
                          console.log("Voir bon de commande", PurchaseOrder.partner.partnerType);
                          if (PurchaseOrder.partner.partnerType == partnerTypeSchema.enum.CLIENT.toString()) {
                            setPurchaseOrderId(PurchaseOrder.idPurchaseOrder)
                            setModalPurchaseOrderOpen(true)
                          } else {

                            setPurchaseOrderId(PurchaseOrder.idPurchaseOrder)
                            setModalSupplierPurchaseOrderOpen(true)
                          }

                        }}
                    getNumber={(item) => item.purchaseOrderNumber}
                    getDate={(item) => item.issueDate}
                    getAmount={(item) => item.purchaseCurrency == currencyTypeSchema.enum.EUR ? item.totalInclTaxEUR : item.purchaseCurrency == currencyTypeSchema.enum.USD ? item.totalInclTaxUSD : item.totalInclTaxTND}
                    getCurrency={(item) => item.purchaseCurrency}
                    getStatus={(item) => item.purchaseOrderStatus}
                    statusLabels={purchaseOrderStatusLabels}
                    statusColors={purchaseOrderStatusColors}
                    actions={[
                      {
                        label: "Modifier",
                        icon: Pencil,
                        onClick: () => {
                          console.log("Modifier un bon de commande", PurchaseOrder.idPurchaseOrder);
                          router.push(`/billing/purchaseOrder/suppliers/${PurchaseOrder.idPurchaseOrder}/edit/`);
                        },

                        disabled: PurchaseOrder.purchaseOrderStatus === "CANCELLED",
                        visible: partner.partnerType == partnerTypeSchema.enum.SUPPLIER
                      },
                      {
                          label: "Envoyer",
                          icon: Send,
                          onClick: () => {
                            setSelected(PurchaseOrder)
                            setSendDocumentOpen(true)
                            console.log("Envoyer un bon de commande", PurchaseOrder.idPurchaseOrder);
                          }
                          ,
                          disabled: PurchaseOrder.purchaseOrderStatus === "CANCELLED",
                        visible: partner.partnerType == partnerTypeSchema.enum.SUPPLIER
                        },
                        {
                          label: "Supprimer",
                          icon: Trash2,
                          color: "text-rose-600",
                          hover: "hover:bg-rose-50",
                          onClick: () => {
                            setPurchaseOrderId(PurchaseOrder.idPurchaseOrder); setDeletePOrderOpen(true);
                            console.log("Supprimer un bon de commande", PurchaseOrder.idPurchaseOrder);
                          },

                          disabled: PurchaseOrder.purchaseOrderStatus !== "DRAFT",
                          visible: true
                        },
                    ]}
                  />
                )}
              />

              <PartnerCollapsibleSection<InvoiceCreditNotePageItem>
                title="Factures d'avoir"
                addLabel="Ajouter avoir"
                transactionType="Avoir"
                partnerType={partner.partnerType}
                partnerId={partner.idPartner}
                count={0}
                open={openSections.creditNotes}
                onToggle={() => toggleSection("creditNotes")}
                getKey={(creditNote) => creditNote.idInvoiceCreditNote}
                onAdd={() => console.log("Ajouter facture d'avoir")}
                renderItem={(creditNote) => (
                  <DocumentListItem
                    item={creditNote}
                    variant="creditNote"
                    icon={ReceiptText}
                    title="facture d'avoir"
                    menuTitle="Actions facture d'avoir"
                    onView={() => {
                          console.log("Voir facture d'avoir", creditNote.idInvoiceCreditNote),
                            router.push(`/billing/invoices/clients/${creditNote.invoice.idInvoice}/credit-note/${creditNote.invoiceCreditNoteNumber}`)
                        }}
                    getNumber={(item) => item.invoiceCreditNoteNumber}
                    getDate={(item) => item.issueDate}
                    getAmount={(item) => item.invoice.invoiceCurrency == currencyTypeSchema.enum.EUR ? item.totalInclTaxEUR : item.invoice.invoiceCurrency == currencyTypeSchema.enum.USD ? item.totalInclTaxUSD : item.totalInclTaxTND}
                    getCurrency={(item) => item.invoice.invoiceCurrency}
                    getStatus={(item) => item.invoiceCreditNoteStatus}
                    statusLabels={purchaseOrderStatusLabels}
                    statusColors={purchaseOrderStatusColors}
                    actions={[
                      
                      {
                        label: "Envoyer",
                        icon: Send,
                        onClick: () => {
                          setSelected(creditNote);
                          setSendDocumentOpen(true);
                          console.log("Envoyer facture d'avoir", creditNote.idInvoiceCreditNote);
                        },
                        disabled: creditNote.invoiceCreditNoteStatus === "CANCELLED",
                        visible: partner.partnerType == partnerTypeSchema.enum.CLIENT
                      },
                      {
                        label: "Supprimer",
                        icon: Trash2,
                        color: "text-rose-600",
                        hover: "hover:bg-rose-50",
                        onClick: () => {
                          setCreditNoteId(creditNote.idInvoiceCreditNote);
                          setDeleteCNoteOpen(true);
                          console.log("Supprimer facture d'avoir", creditNote.idInvoiceCreditNote);
                        },

                        disabled: creditNote.invoiceCreditNoteStatus !== "DRAFT",
                        visible: true
                      },
                    ]}
                  />
                )}
              />

            </TabsContent>

            {/* ── Emails Tab ─────────────────────────────────────── */}
            <TabsContent value="emails">
              <EmailHistoryCard
                email={partner.email}
                onSendEmail={() => setOpen(true)}
                onShowDetails={()=> setShowDetails(true)}
                onSelectEmail={setSelectedEmail}
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
        isOpen={open}
        onClose={() => setOpen(false)}
        defaultTo={partner.email}
        recipientName={partner.displayName}
      />
      <MailDetailsModal
        open={showDetails}
        mailId={selectedEmail}
        onClose={()=>setShowDetails(false)}
        />
      
      <AddDocumentModal
        open={openAddDocument}
        loading={addDocumentLoading}
        hasPatent={partner?.patente? false : true}
        type={addDocumentType}
        onClose={() => setOpenAddDocument(false)}
        onAdd={(file, type) => addDocument(file, type)}
      />
    </div>
  );
}