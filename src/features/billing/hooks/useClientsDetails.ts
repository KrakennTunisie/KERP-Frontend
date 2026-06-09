import { TrendingDown, TrendingUp, Truck, Users, CheckCircle, Clock, AlertCircle, FileText} from "lucide-react";
import { useState } from "react";
import { PreviewDocument } from "../components/partner/partnerInfoCard";
import { InvoicePageItem } from "../models/invoice";
import { PartnerAllDetails } from "../models/partner";
import { InvoiceStatusWithoutAll, invoiceStatusColors, invoiceStatusLabels } from "../types/invoiceStatus";
import { PartnerInvoiceStats } from "../types/partnersStats";
import { ChartMode } from "../components/widgets/RevnueExpensesBarChart";
import { AuditLog } from "../models/AuditLogs";
import { PartnerRevenueStats } from "../types/partnerRevenueStats";
import { DashboardAPI, InvoicesAPI,  partnersApi,  PurchaseOrderAPI } from "../api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { partnerTypeSchema } from "../types/partnerType";



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
  clientRevenueInitial?: PartnerRevenueStats[] | [],
  supplierDespensesInitial?: PartnerRevenueStats[] | [],
  totalRevenueInitial?: number,
  totalDespensesInitial?: number,
  onRefresh:  () => void
};

export default function UseClientsDetails({ partner, onRefresh }: PartnerDetailsProps) {

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
  const [deleteLoading, setDeleteLoading]= useState(false)
  const [deletePartnerOpen, setDeletePartnerOpen]= useState(false)
  const [updatePartnerStatusOpen, setUpdatePartnerStatusOpen]= useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePOrderOpen, setDeletePOrderOpen] = useState(false);
  const [modalPurchaseOrderOpen, setModalPurchaseOrderOpen] = useState(false);
  const [sendeMailOpen, setSendMailOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoicePageItem|null>();
  const [invoiceRef ,setInvoiceRef] = useState("");
  const [invoiceId ,setInvoiceId] = useState("");
  const [purchaseOrderId ,setPurchaseOrderId] = useState("");


 
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
           const total =  clientRevenue.slice(-selectedPeriod).reduce((sum, item) => sum + (item.revenueTTC ?? 0), 0);
           setTotalRevenue(total);
        }
        else {
          const supplierDespenses = await DashboardAPI.supplierRevenueStats(partner?.idPartner, period)
          setSupplierDespenses(supplierDespenses);
          const total =  supplierDespenses.slice(-selectedPeriod).reduce((sum, item) => sum + (item.revenueTTC ?? 0), 0);
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

  const deleteClientInvoice = async ()=>{
          try {
            setDeleteLoading(true);
            await InvoicesAPI.deleteClientInvoice(invoiceId);
            appToast.success('Facture supprimée avec succès.')
            setDeleteOpen(false)
            setInvoiceId("")
            window.location.reload()
          } catch (error) {
            appToast.error("Erreur de suppresion: ",getApiErrorMessage(error))
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
       //setPurchaseOrder(idPurchaseOrder);
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

      const updatePartnerStatus = async (status: boolean) => {
          try {
              setLoading(true);
              if (partner.partnerType == partnerTypeSchema.enum.CLIENT) {
  
                  await partnersApi.updateStatus(partner.idPartner, status);
  
                  if (status) {
                      appToast.success("Le client est activé !");
                       onRefresh()
  
                  } else {
                      appToast.success("Le client est désactivé !");
                      onRefresh()
  
                  }
              } else {
                  await partnersApi.updateSupplierStatus(partner.idPartner, status);
  
                  if (status) {
                      appToast.success("Le fournisseur est activé !");
                      onRefresh()
  
                  } else {
                      appToast.success("Le fournisseur est désactivé !");
                        onRefresh()

                  }
  
              }
          } catch (error) {
              appToast.error(
                  "Erreur dans la modification du statut : " + getApiErrorMessage(error)
              );
          } finally {
              setLoading(false);
          }
      };


  const chartMode: ChartMode = partner.partnerType === "CLIENT" ? "revenues" : "expenses";

  return {
    deleteClientInvoice,deleteLoading,setDeleteLoading,setDeleteOpen,invoiceRef,deleteOpen,setInvoiceId,purchaseOrderId,setPurchaseOrderId,setDeletePOrderOpen,deletePOrderOpen , deletePurchaseOrder,
    getStatusLabel, getEmailStatusColor, chartMode, getStatusIcon, getLabelColor, getStatusColor, toggleSection ,refresh,setRefresed,modalPurchaseOrderOpen,setModalPurchaseOrderOpen
    , previewDocument, setPreviewDocument, selectedPeriod, setSelectedPeriod, emailLogs, activeTab, setActiveTab, supplierDespenses,totalDespenses
    , TotalIcon, HeaderIcon, open, setOpen, openSections, pageConfig, fetchPartnerStats,clientRevenue, totalRevenue ,sendeMailOpen, setSendMailOpen,selectedInvoice,setSelectedInvoice,
    updatePartnerStatus, deletePartnerOpen, setDeletePartnerOpen, updatePartnerStatusOpen, setUpdatePartnerStatusOpen
  };
}