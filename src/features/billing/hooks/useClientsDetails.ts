import { TrendingDown, TrendingUp, Truck, Users, CheckCircle, Clock, AlertCircle, FileText, User, Mail, Paperclip } from "lucide-react";
import { useState, Activity } from "react";
import { PreviewDocument } from "../components/partner/partnerInfoCard";
import { MOCK_INVOICES } from "../mocks/invoice-mocks";
import { InvoicePageItem } from "../models/invoice";
import { ClientPartnerDetails, SupplierPartnerDetails } from "../models/partner";
import { InvoiceStatusWithoutAll, invoiceStatusColors, invoiceStatusLabels } from "../types/invoiceStatus";
import { PartnerInvoiceStats } from "../types/partnersStats";
import { ChartMode } from "../components/widgets/RevnueExpensesBarChart";
import { AuditLog } from "../models/AuditLogs";

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

 export type PartnerDetailsProps = {
  partner: ClientPartnerDetails | SupplierPartnerDetails;
  partnerStats: PartnerInvoiceStats,
  partnerInvoices: InvoicePageItem[]|[]
  partnerLogs : AuditLog[]|[]
  onRefresh: () => void;
};

export default function UseClientsDetails({ partner, partnerStats, partnerInvoices }: PartnerDetailsProps) {
     
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
    
    const  chartMode :ChartMode = partner.partnerType === "CLIENT" ? "revenues" : "expenses";
    return {
      getStatusLabel,getEmailStatusColor,chartMode,getStatusIcon,getLabelColor,getStatusColor,toggleSection
      ,previewDocument, setPreviewDocument,selectedPeriod, setSelectedPeriod,emailLogs,clientPayments,activeTab, setActiveTab
      ,TotalIcon,HeaderIcon,open, setOpen,totalRevenueLastSixMonths,openSections,chartData,pageConfig
    };
}