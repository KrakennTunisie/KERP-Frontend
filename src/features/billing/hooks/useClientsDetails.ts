import { TrendingDown, TrendingUp, Truck, Users, CheckCircle, Clock, AlertCircle, FileText, User, Mail, Paperclip } from "lucide-react";
import { useState, Activity, useMemo } from "react";
import { PreviewDocument } from "../components/partner/partnerInfoCard";
import { Invoice, InvoicePageItem, InvoicePageItemV2 } from "../models/invoice";
import { ClientPartnerDetails, Partner, PartnerAllDetails, SupplierPartnerDetails } from "../models/partner";
import { InvoiceStatusWithoutAll, invoiceStatusColors, invoiceStatusLabels } from "../types/invoiceStatus";
import { PartnerInvoiceStats } from "../types/partnersStats";
import { ChartMode } from "../components/widgets/RevnueExpensesBarChart";
import { AuditLog } from "../models/AuditLogs";
import { PartnerRevenueStats } from "../types/partnerRevenueStats";
import { DashboardAPI, InvoicesAPI, InvoicesCreditNoteAPI, partnersApi, PurchaseOrderAPI } from "../api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { partnerTypeSchema } from "../types/partnerType";
import { PurchaseOrderPageItem, PurchaseOrderPartnerSummary } from "../models/purchaseOrder";
import { InvoiceCreditNoteDetails, InvoiceCreditNotePageItem } from "../models/creditNote";
import { invoiceTypeSchema } from "../types/invoiceType";

export interface Payment {
  id: string;
  paymentNumber: string;
  date: string;
  amount: number;
  method: string;
  invoiceNumber: string;
}

export interface EmailLog {
  id: string;
  subject: string;
  date: string;
  status: 'sent' | 'delivered' | 'opened' | 'failed';
  attachments: string[];
}

export type PartnerDetailsProps = {
  partner: PartnerAllDetails;
  partnerStats: PartnerInvoiceStats,
  clientRevenueInitial?: PartnerRevenueStats[] | []
  supplierDespensesInitial?: PartnerRevenueStats[] | []
  partnerInvoices: InvoicePageItem[] | []
  partnerCreditNotes: InvoiceCreditNotePageItem[] | []
  partnerLogs: AuditLog[] | []
  purchaseOrders: PurchaseOrderPartnerSummary[] | [],
  totalRevenueInitial?: number,
  totalDespensesInitial?: number
  onRefresh: () => void;
};

export default function UseClientsDetails({ partner, partnerStats, partnerInvoices }: PartnerDetailsProps) {

  const isSupplier = partner.partnerType === "SUPPLIER";
  const [open, setOpen] = useState(false)
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
      ? `/billing/invoices/suppliers?supplier=${partner.partnerName}`
      : `/billing/invoices/clients?client=${partner.partnerName}`,
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
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePOrderOpen, setDeletePOrderOpen] = useState(false);
  const [deleteCNoteOpen, setDeleteCNoteOpen] = useState(false);
  const [modalPurchaseOrderOpen, setModalPurchaseOrderOpen] = useState(false);
  const [modalSupplierPurchaseOrderOpen, setModalSupplierPurchaseOrderOpen] = useState(false);
  const [sendeMailOpen, setSendMailOpen] = useState(false);
  const [selected, setSelected] = useState<InvoicePageItem | InvoiceCreditNotePageItem | PurchaseOrderPageItem | null>();
  const [invoiceRef, setInvoiceRef] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [creditNoteId, setCreditNoteId] = useState("");
  const [invoiceType, setInvoiceType] = useState("");
  const [purchaseOrderId, setPurchaseOrderId] = useState("");
  const clientPayments: Payment[] = [
    {
      id: '1',
      paymentNumber: 'PAY-2025-001',
      date: '2025-02-14',
      amount: 12500,
      method: 'Virement bancaire',
      invoiceNumber: 'FAC-2025-001',
    },
    {
      id: '2',
      paymentNumber: 'PAY-2025-012',
      date: '2025-03-15',
      amount: 5000,
      method: 'Chèque',
      invoiceNumber: 'FAC-2025-015',
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
  const [loading, setLoading] = useState<boolean>();
  const [refresh, setRefresed] = useState<boolean>(false);
  const [clientRevenue, setClientRevenue] = useState<PartnerRevenueStats[] | []>([])
  const [supplierDespenses, setSupplierDespenses] = useState<PartnerRevenueStats[] | []>([])
  const [totalRevenue, setTotalRevenue] = useState<number>()
  const [totalDespenses, setTotalDespenses] = useState<number>()
  const fetchPartnerStats = async (partner: PartnerAllDetails, period: string) => {
    try {

      if (period != " ") {
        setLoading(true)
        if (partner?.partnerType == partnerTypeSchema.enum.CLIENT) {
          const clientRevenue = await DashboardAPI.clientRevenueStats(partner.idPartner, period)
          setClientRevenue(clientRevenue);
          const total = clientRevenue.slice(-selectedPeriod).reduce((sum, item) => sum + (item.revenueTTC ?? 0), 0);
          setTotalRevenue(total);
        }
        else {
          const supplierDespenses = await DashboardAPI.supplierRevenueStats(partner?.idPartner, period)
          setSupplierDespenses(supplierDespenses);
          const total = supplierDespenses.slice(-selectedPeriod).reduce((sum, item) => sum + (item.revenueTTC ?? 0), 0);
          setTotalDespenses(total);
        }
      } else {
        appToast.info("Vous devez séléctionnez une période");
      }

    } catch (error) {
      appToast.error("Erreur fetch des stats du  partenaire: ", getApiErrorMessage(error));
    }
    finally {
      setLoading(false)
    }
  };

  const deleteClientInvoice = async (invoiceType: string) => {
    try {
      setDeleteLoading(true);
      if (invoiceType == invoiceTypeSchema.enum.SALE) {
        await InvoicesAPI.deleteClientInvoice(invoiceId);
      } else {
        await InvoicesAPI.deleteSupplierInvoice(invoiceId);
      }
      appToast.success('Facture supprimée avec succès.')
      setDeleteOpen(false)
      setInvoiceId("")
      window.location.reload()
    } catch (error) {
      appToast.error("Erreur de suppresion: ", getApiErrorMessage(error))
    } finally {
      setDeleteLoading(false);
    }
  }
  async function deletePurchaseOrder(idPurchaseOrder: string) {
    try {
      setDeleteLoading(true);
      await PurchaseOrderAPI.deleteClientPurchaseOrder(idPurchaseOrder);
      appToast.success('Bon de commande supprimée avec succès.')
      setDeletePOrderOpen(false)
    } catch (error) {
      appToast.error("Erreur de suppresion: ", getApiErrorMessage(error))
    } finally {
      setDeleteLoading(false);
    }

  }

  const deleteCreditInvoice = async () => {
    try {
      setDeleteLoading(true);
      await InvoicesCreditNoteAPI.deleteInvoiceCreditNote(creditNoteId);
      appToast.success('Facture d avoir supprimée avec succès.')
      setCreditNoteId(" ");
      setDeleteCNoteOpen(false)
      window.location.reload();
    } catch (error) {
      appToast.error("Erreur de suppresion: ", getApiErrorMessage(error))
    } finally {
      setDeleteLoading(false);
    }
  }

  const [previewDocument, setPreviewDocument] = useState<PreviewDocument>(null);
  const [selectedPeriod, setSelectedPeriod] = useState(6);


  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getStatusColor = (status: InvoiceStatusWithoutAll) => {
    return invoiceStatusColors[status]
  }

  const getLabelColor = (status: InvoiceStatusWithoutAll) => {
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

  const chartMode: ChartMode = partner.partnerType === "CLIENT" ? "revenues" : "expenses";
  return {
    deleteClientInvoice, deleteLoading, setDeleteLoading, setDeleteOpen, invoiceRef, deleteOpen, setInvoiceId, purchaseOrderId, setPurchaseOrderId, setDeletePOrderOpen, deletePOrderOpen, deletePurchaseOrder,deleteCreditInvoice,
    getStatusLabel, getEmailStatusColor, chartMode, getStatusIcon, getLabelColor, getStatusColor, toggleSection, refresh, setRefresed, modalPurchaseOrderOpen, setModalPurchaseOrderOpen, setDeleteCNoteOpen,deleteCNoteOpen,creditNoteId,setCreditNoteId
    , previewDocument, setPreviewDocument, selectedPeriod, setSelectedPeriod, emailLogs, clientPayments, activeTab, setActiveTab, supplierDespenses, totalDespenses, modalSupplierPurchaseOrderOpen, setModalSupplierPurchaseOrderOpen
    , TotalIcon, HeaderIcon, open, setOpen, openSections, pageConfig, fetchPartnerStats, clientRevenue, totalRevenue, sendeMailOpen, setSendMailOpen, selected, setSelected, invoiceType, setInvoiceType
  };
}