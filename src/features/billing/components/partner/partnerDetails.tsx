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
} from "lucide-react";
import PartnerStatCard from "../widgets/partnerStatCard";
import PartnerHeader from "./partnerHeroSection";
import PartnerInfoCard from "./partnerInfoCard";
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
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'pending': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'overdue': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'approved': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'sent': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'draft': return 'bg-gray-50 text-gray-600 border-gray-100';
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


  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
        <PartnerHeader
            partner={partner}
            pageConfig={pageConfig}
            icon={HeaderIcon}
            setOpen={()=>setOpen(true)}
        />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PartnerStatCard
                title={pageConfig.totalLabel}
                value={
                    <p className="text-3xl font-black text-gray-900 tracking-tighter">
                    {partnerStats.totalAmountTND + " "}
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
                    {partnerStats.totalInvoices}
                    </p>
                }
                icon={FileText}
                iconContainerClassName="bg-emerald-50"
                iconClassName="text-emerald-600"
                footer={
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">
                    {partnerStats.paidInvoices} Payées
                    </p>
                }
            />



            <PartnerStatCard
                title={isSupplier ? "À Payer" : "À Encaisser"}
                value={
                    <p className="text-3xl font-black text-gray-900 tracking-tighter">
                        {partnerStats.pendingInvoices}
                    </p>
                }
                icon={Clock}
                iconContainerClassName="bg-amber-50"
                iconClassName="text-amber-600"
                footer={
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-tighter">
                        {partnerStats.pendingAmountTND+ " "}
                        <span className="text-sm text-gray-600">TND</span>
                    </p>
                    
                }
            />

            <PartnerStatCard
                title="Montant Moyen"
                value={
                    <p className="text-3xl font-black text-gray-900 tracking-tighter">
                        {partnerStats.averageInvoiceTND}
                    </p>
                }
                icon={CircleDollarSign}
                iconContainerClassName="bg-purple-50"
                iconClassName="text-purple-600"
                footer={
                    <p className="text-[10px] font-bold text-purple-600 uppercase tracking-tighter">
                        {partnerStats.averageInvoiceTND+" "}
                        <span className="text-sm text-gray-600">TND</span>

                    </p>
                }
            />


          </div>

            <PartnerInvoicesCard
                partnerType={partner.partnerType}
                invoices={partnerInvoices}
                subtitle={pageConfig.invoicesSubtitle}
                buttonHref={pageConfig.invoicesButtonHref}
                buttonLabel={pageConfig.invoicesButtonLabel}
                emptyInvoiceType={pageConfig.emptyInvoiceType}
            />

            <PartnerInfoCard
                partner={partner}
                typeLabel={pageConfig.detailsTypeLabel}
            />

            <SendEmailModal
               isOpen= {open}
               onClose={()=>setOpen(false)}
               defaultTo={partner.email}
               recipientName={partner.name}
            />
        </div>
      </main>

      {/* Main Content with Tabs */}
{/* Main Content with Tabs */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">CA Total</p>
                </div>
                <p className="text-2xl font-black text-gray-900 tracking-tighter">
                  {totalRevenue.toLocaleString()}
                  <span className="text-sm font-semibold text-gray-400 ml-1">TND</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-600" />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Factures</p>
                </div>
                <p className="text-2xl font-black text-gray-900 tracking-tighter">{totalInvoices}</p>
                <p className="text-[10px] font-bold text-emerald-600 uppercase mt-1 tracking-tight">{paidInvoices} Payées</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">En Attente</p>
                </div>
                <p className="text-2xl font-black text-gray-900 tracking-tighter">
                  {pendingAmount.toLocaleString()}
                  <span className="text-sm font-semibold text-gray-400 ml-1">TND</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Euro className="w-5 h-5 text-purple-500" />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Montant Moyen</p>
                </div>
                <p className="text-2xl font-black text-gray-900 tracking-tighter">
                  {averageInvoice.toLocaleString()}
                  <span className="text-sm font-semibold text-gray-400 ml-1">TND</span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

            {/* ── TabsList : compact, centré, pas pleine largeur ── */}
            <div className="w-full">
              <TabsList className="flex h-11 w-full rounded-xl bg-slate-100 p-1 gap-1">
                <TabsTrigger
                  value="overview"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-slate-500 transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                >
                  <TrendingUp className="w-4 h-4" />
                  Vue d'ensemble
                </TabsTrigger>

                <TabsTrigger
                  value="transactions"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-slate-500 transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                >
                  <Receipt className="w-4 h-4" />
                  Transactions
                </TabsTrigger>

                <TabsTrigger
                  value="emails"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold text-slate-500 transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                >
                  <Mail className="w-4 h-4" />
                  Emails
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ── Overview Tab ───────────────────────────────────── */}
            <TabsContent value="overview" className="space-y-6">

              {/* Bar Chart */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-black text-slate-900">Revenus et Dépenses</CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        Ce graphique est affiché dans la devise de base de l'organisation.
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-xs font-semibold">Derniers 6 mois</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* SVG gradient defs injected once */}
                  <svg width="0" height="0" style={{ position: "absolute" }}>
                    <defs>
                      <linearGradient id="gradRevenus" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#93c5fd" />
                      </linearGradient>
                      <linearGradient id="gradDepenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1d4ed8" />
                        <stop offset="100%" stopColor="#60a5fa" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={chartData} barCategoryGap="30%" barGap={6}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis
                        dataKey="month"
                        tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        cursor={{ fill: "#f8fafc" }}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                          boxShadow: "0 10px 25px -5px rgb(0 0 0 / 0.08)",
                          fontSize: "13px",
                          fontWeight: 600,
                        }}
                        formatter={(value: number) => `${value.toLocaleString()} TND`}
                      />
                      <Legend
                        wrapperStyle={{ paddingTop: "20px", fontSize: "13px", fontWeight: 700 }}
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => (value === "revenus" ? "Revenus" : "Dépenses")}
                      />
                      <Bar dataKey="revenus" fill="url(#gradRevenus)" radius={[8, 8, 0, 0]} maxBarSize={40} />
                      <Bar dataKey="depenses" fill="url(#gradDepenses)" radius={[8, 8, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>

                  <div className="mt-4 px-4 py-3 bg-blue-50 rounded-xl">
                    <p className="text-sm font-semibold text-slate-600">
                      Total des revenus (6 derniers mois) —{" "}
                      <span className="text-blue-600 font-black text-base">
                        {totalRevenueLastSixMonths.toLocaleString()} TND
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Client Details */}
                            <PartnerInfoCard
                partner={partner}
                typeLabel={pageConfig.detailsTypeLabel}
            />

                {/* Activity Log — scrollable after 5 items */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-black text-slate-900">
                      <Activity className="w-4 h-4 text-blue-600" />
                      Journal d'activités
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Historique des actions liées au partenaire
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-[340px] overflow-y-auto px-6 pb-4 space-y-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                      {activityLogs.map((log, index) => {
                        const Icon = getActivityIcon(log.type);
                        return (
                          <div
                            key={log.id}
                            className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0"
                          >
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                              <Icon className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-slate-800 leading-snug">{log.description}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <p className="text-[11px] text-slate-400">{log.date}</p>
                                <span className="text-slate-300">•</span>
                                <p className="text-[11px] text-slate-400">Par {log.user}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ── Transactions Tab ───────────────────────────────── */}
            <TabsContent value="transactions" className="space-y-4">

              {/* Factures */}
              <Collapsible open={openSections.invoices} onOpenChange={() => toggleSection("invoices")}>
                <Card className="border-slate-200 shadow-sm">
                  <CollapsibleTrigger className="w-full text-left">
                    <CardHeader className="cursor-pointer hover:bg-slate-50/60 transition-colors rounded-t-xl py-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-800">
                          {openSections.invoices
                            ? <ChevronDown className="w-4 h-4 text-slate-400" />
                            : <ChevronRight className="w-4 h-4 text-slate-400" />}
                          Factures
                        </CardTitle>
                        <Badge variant="secondary" className="font-bold">{partnerInvoices.length}</Badge>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 px-4 pb-4">
                      <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        {partnerInvoices.map((invoice) => {
                          const StatusIcon = getStatusIcon(invoice.invoiceStatus);
                          return (
                            <div
                              key={invoice.idInvoice}
                              className="flex items-center justify-between p-3.5 bg-slate-50/60 rounded-xl hover:bg-slate-100/60 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                  invoice.invoiceStatus === "PAID" ? "bg-emerald-50" : "bg-blue-50"
                                }`}>
                                  <StatusIcon className={`w-4 h-4 ${
                                    invoice.invoiceStatus === "PAID" ? "text-emerald-600" : "text-blue-600"
                                  }`} />
                                </div>
                                <div>
                                  <button className="text-sm font-black text-blue-600 hover:text-blue-800 hover:underline underline-offset-4 tracking-tight">
                                    {invoice.invoiceNumber}
                                  </button>
                                  <p className="text-[11px] text-slate-400 mt-0.5">
                                    Échéance : {formatDateLong(invoice.dueDate)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <p className="text-base font-black text-slate-900">
                                  {invoice.totalExclTaxEUR.toLocaleString()}
                                  <span className="text-xs font-semibold text-slate-400 ml-1">TND</span>
                                </p>
                                <Badge className={getStatusColor(invoice.invoiceStatus)}>
                                  {getStatusLabel(invoice.invoiceStatus)}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Paiements */}
              <Collapsible open={openSections.payments} onOpenChange={() => toggleSection("payments")}>
                <Card className="border-slate-200 shadow-sm">
                  <CollapsibleTrigger className="w-full text-left">
                    <CardHeader className="cursor-pointer hover:bg-slate-50/60 transition-colors rounded-t-xl py-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-800">
                          {openSections.payments
                            ? <ChevronDown className="w-4 h-4 text-slate-400" />
                            : <ChevronRight className="w-4 h-4 text-slate-400" />}
                          Paiements clients
                        </CardTitle>
                        <Badge variant="secondary" className="font-bold">{clientPayments.length}</Badge>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 px-4 pb-4">
                      <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        {clientPayments.map((payment) => (
                          <div
                            key={payment.id}
                            className="flex items-center justify-between p-3.5 bg-slate-50/60 rounded-xl hover:bg-slate-100/60 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                                <CheckCircle className="w-4 h-4 text-emerald-600" />
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900">{payment.number}</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  {payment.method} · Pour {payment.invoiceNumber}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <p className="text-base font-black text-emerald-600">
                                {payment.amount.toLocaleString()}
                                <span className="text-xs font-semibold text-slate-400 ml-1">TND</span>
                              </p>
                              <p className="text-[11px] text-slate-400">{payment.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Bons de commande */}
              <Collapsible open={openSections.purchaseOrders} onOpenChange={() => toggleSection("purchaseOrders")}>
                <Card className="border-slate-200 shadow-sm">
                  <CollapsibleTrigger className="w-full text-left">
                    <CardHeader className="cursor-pointer hover:bg-slate-50/60 transition-colors rounded-t-xl py-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-800">
                          {openSections.purchaseOrders
                            ? <ChevronDown className="w-4 h-4 text-slate-400" />
                            : <ChevronRight className="w-4 h-4 text-slate-400" />}
                          Bons de commande
                        </CardTitle>
                        <Badge variant="secondary" className="font-bold">{mockPurchaseOrders.length}</Badge>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 px-4 pb-4">
                      <div className="max-h-[340px] overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        {mockPurchaseOrders.map((order) => (
                          <div
                            key={order.idPurchaseOrder}
                            className="flex items-center justify-between p-3.5 bg-slate-50/60 rounded-xl hover:bg-slate-100/60 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                                <Package className="w-4 h-4 text-purple-500" />
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900">{order.purchaseOrderNumber}</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">{formatDateLong(order.issueDate)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <p className="text-base font-black text-slate-900">
                                {order.totalExclTax?.toLocaleString() ?? "—"}
                                <span className="text-xs font-semibold text-slate-400 ml-1">TND</span>
                              </p>
                              <Badge className={getStatusColor(order.purchaseOrderStatus)}>
                                {getStatusLabel(order.purchaseOrderStatus)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            </TabsContent>

            {/* ── Emails Tab ─────────────────────────────────────── */}
            <TabsContent value="emails">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base font-black text-slate-900">
                        <Mail className="w-4 h-4 text-blue-600" />
                        Historique des emails
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        Emails envoyés au partenaire et leurs pièces jointes
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="font-bold">{emailLogs.length} emails</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[560px] overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    {emailLogs.map((email) => (
                     <div
                        key={email.id}
                        className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-2">
                              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />

                              <div className="min-w-0">
                                <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
                                  {email.subject}
                                </h4>

                                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>{email.date}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Badge className={getEmailStatusColor(email.status)}>
                            {getStatusLabel(email.status)}
                          </Badge>
                        </div>

                        {email.attachments.length > 0 && (
                          <div className="mt-3 border-t border-slate-100 pt-3">
                            <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                              <Paperclip className="h-3.5 w-3.5" />
                              <span>Pièces jointes ({email.attachments.length})</span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {email.attachments.map((attachment, idx) => (
                                <div
                                  key={idx}
                                  title={attachment}
                                  className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600"
                                >
                                  <Paperclip className="h-3 w-3 shrink-0 text-slate-400" />
                                  <span className="max-w-[180px] truncate">{attachment}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                     </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}