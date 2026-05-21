// src/features/billing/components/partners/PartnerDetails.tsx
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
} from "lucide-react";
import PartnerStatCard from "../widgets/partnerStatCard";
import PartnerHeader from "./partnerHeroSection";
import PartnerInfoCard, { PreviewDocument } from "./partnerInfoCard";
import PartnerInvoicesCard from "./partnerInvoices";
import {   ClientPartnerDetails,   SupplierPartnerDetails } from "../../models/partner";
import {  InvoicePageItem } from "../../models/invoice";
import { PartnerInvoiceStats } from "../../types/partnersStats";
import { useState } from "react";
import { SendEmailModal } from "@/shared/components/widgets/sendEmailModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible';
import { ArrowLeft, Building2, Mail, Phone, MapPin, Calendar, Euro, CheckCircle, AlertCircle, User, Activity, Receipt, Paperclip, Package, ChevronRight, ChevronDown } from 'lucide-react';
import { MOCK_INVOICES } from "../../mocks/invoice-mocks";
import { formatDateLong } from "@/shared/utils/formatDate";
import { mockPurchaseOrders } from "../../mocks/purchase-order-mocks";
import { mockPartner } from "../../mocks/partner-mocks";
import DocumentItem from "@/shared/components/ui/documentItem";
import { DocumentPreviewModal } from "@/shared/components/ui/documentPreviewModal";
import PartnerCollapsibleSection from "../widgets/collapseSection";
import RowActions from "../widgets/rowActions";
import PartnerDetailsCard from "../widgets/partnerDetailsCard";
import ActivityLogCard from "@/shared/components/ui/activityLogCard";
import InvoiceListItem from "../widgets/invoiceListItem";
import RevenueExpenseBarChart from "../widgets/RevnueExpensesBarChart";
import EmailHistoryCard from "@/shared/components/ui/emailHistoryLog";
import { InvoiceStatus, invoiceStatusColors, invoiceStatusLabels, InvoiceStatusWithoutAll } from "../../types/invoiceStatus";
import { purchaseOrderStatusColors, purchaseOrderStatusLabels } from "../../types/purchaseOrderStatus";

  interface Payment {
  id: string;
  number: string;
  date: string;
  amount: number;
  method: string;
  invoiceNumber: string;
}

interface ActivityLog {
  id: string;
  type: 'user_created' | 'invoice_created' | 'payment_received' | 'email_sent' | 'document_uploaded';
  description: string;
  date: string;
  user: string;
}

interface EmailLog {
  id: string;
  subject: string;
  date: string;
  status: 'sent' | 'delivered' | 'opened' | 'failed';
  attachments: string[];
}

type PartnerDetailsProps = {
  partner: ClientPartnerDetails | SupplierPartnerDetails;
  partnerStats: PartnerInvoiceStats,
  partnerInvoices: InvoicePageItem[]|[]
};
export default function PartnerDetails({ partner, partnerStats, partnerInvoices }: PartnerDetailsProps) {
  const isSupplier = partner.partnerType === "SUPPLIER";
  const [open, setOpen]=useState(false)
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
      ? `/billing/invoices/suppliers?supplier=${partner.name}`
      : `/billing/invoices/clients?client=${partner.name}`,
    invoicesButtonLabel: "Voir toutes les factures",
    detailsTypeLabel: isSupplier ? "Fournisseur" : "Client",
    emptyInvoiceType: isSupplier ? "Achat" : "Vente",
  };

  const HeaderIcon = isSupplier ? Truck : Users;
  const TotalIcon = pageConfig.totalIcon;
  const [activeTab, setActiveTab] = useState('overview');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    invoices: true,
    payments: false,
    purchaseOrders: false,
  });
const clientPayments: Payment[] = [
    {
      id: '1',
      number: 'PAY-2025-001',
      date: '2025-02-14',
      amount: 12500,
      method: 'Virement bancaire',
      invoiceNumber: 'FAC-2025-001',
    },
    {
      id: '2',
      number: 'PAY-2025-012',
      date: '2025-03-15',
      amount: 5000,
      method: 'Chèque',
      invoiceNumber: 'FAC-2025-015',
    },
  ];

    // Mock chart data
  const chartData = [
    { month: 'Jan 2025', revenus: 12500, depenses: 8200 },
    { month: 'Fév 2025', revenus: 8750, depenses: 6100 },
    { month: 'Mar 2025', revenus: 15200, depenses: 9800 },
    { month: 'Avr 2025', revenus: 9800, depenses: 7400 },
    { month: 'Mai 2025', revenus: 11200, depenses: 8600 },
    { month: 'Juin 2025', revenus: 0, depenses: 0 },
  ];



 // Mock activity logs
  const activityLogs: ActivityLog[] = [
    {
      id: '1',
      type: 'invoice_created',
      description: 'Facture FAC-2025-034 créée',
      date: '2025-03-05 14:30',
      user: 'Mohamed Ali',
    },
    {
      id: '2',
      type: 'payment_received',
      description: 'Paiement reçu pour FAC-2025-001 (12,500 TND)',
      date: '2025-02-10 10:15',
      user: 'Système',
    },
    {
      id: '3',
      type: 'email_sent',
      description: 'Email de relance envoyé',
      date: '2025-02-01 09:00',
      user: 'Sarah Ben Salem',
    },
    {
      id: '4',
      type: 'invoice_created',
      description: 'Facture FAC-2025-015 créée',
      date: '2025-02-01 11:20',
      user: 'Mohamed Ali',
    },
    {
      id: '5',
      type: 'user_created',
      description: 'Client créé dans le système',
      date: '2024-01-15 16:45',
      user: 'Admin',
    },
  ];

  // Mock emails
  const emailLogs: EmailLog[] = [
    {
      id: '1',
      subject: 'Facture FAC-2025-034 - Échéance à venir',
      date: '2025-03-20 10:30',
      status: 'opened',
      attachments: ['FAC-2025-034.pdf'],
    },
    {
      id: '2',
      subject: 'Relance de paiement - Facture FAC-2025-023',
      date: '2025-03-15 14:00',
      status: 'delivered',
      attachments: ['FAC-2025-023.pdf', 'CGV.pdf'],
    },
    {
      id: '3',
      subject: 'Nouvelle facture disponible',
      date: '2025-02-01 09:15',
      status: 'opened',
      attachments: ['FAC-2025-015.pdf'],
    },
    {
      id: '4',
      subject: 'Confirmation de paiement',
      date: '2025-02-10 10:20',
      status: 'sent',
      attachments: [],
    },
     {
      id: '5',
      subject: 'Nouvelle facture disponible',
      date: '2025-02-01 09:15',
      status: 'opened',
      attachments: ['FAC-2025-015.pdf'],
    },
  ];

    const [previewDocument, setPreviewDocument] =useState<PreviewDocument>(null);
  
const [selectedPeriod, setSelectedPeriod] = useState(6);
  // Calculate statistics
  const totalInvoices = MOCK_INVOICES.length;
  const totalRevenue = MOCK_INVOICES.reduce((sum, inv) => sum + inv.totalExclTaxTND, 0);
  const paidInvoices = MOCK_INVOICES.filter(inv => inv.invoiceStatus === 'PAID').length;
  const pendingAmount = MOCK_INVOICES.filter(inv => inv.invoiceStatus !== 'PAID').reduce((sum, inv) => sum + inv.totalExclTaxEUR, 0);
  const averageInvoice = totalRevenue / totalInvoices;
  const totalRevenueLastSixMonths = chartData.reduce((sum, item) => sum + item.revenus, 0);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getStatusColor = (status: InvoiceStatusWithoutAll)=>{
    return invoiceStatusColors[status]
  }

    const getLabelColor = (status: InvoiceStatusWithoutAll)=>{
    return invoiceStatusLabels[status]
  }


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'pending': return Clock;
      case 'overdue': return AlertCircle;
      default: return FileText;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_created': return User;
      case 'invoice_created': return FileText;
      case 'payment_received': return CheckCircle;
      case 'email_sent': return Mail;
      case 'document_uploaded': return Paperclip;
      default: return Activity;
    }
  };

  const getEmailStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'opened': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'failed': return 'bg-rose-50 text-rose-600 border-rose-100';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

    const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      paid: 'Payée',
      pending: 'En attente',
      overdue: 'En retard',
      completed: 'Complété',
      approved: 'Approuvé',
      sent: 'Envoyé',
      draft: 'Brouillon',
      opened: 'Ouvert',
      delivered: 'Délivré',
      failed: 'Échoué',
    };
    return labels[status] || status;
  };

const chartMode = partner.partnerType === "CLIENT" ? "revenues" : "expenses";


  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
        <PartnerHeader
            partner={partner}
            pageConfig={pageConfig}
            icon={HeaderIcon}
            setOpen={()=>setOpen(true)}
        />


      {/* Main Content with Tabs */}
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
                  partner={partner}
                  mockPartner={mockPartner}
                  onEdit={() => console.log("Modifier")}
                  onOpenDocument={setPreviewDocument}
                />

                {/* Activity Log — scrollable after 5 items */}
                <ActivityLogCard
                  logs={activityLogs}
                  getActivityIcon={getActivityIcon}
                  onRefresh={() => console.log("Refresh activities")}
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
                      getStatusColor={()=>getStatusColor(invoice.invoiceStatus)}
                      getStatusLabel={()=>getLabelColor(invoice.invoiceStatus)}
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