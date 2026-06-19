import { TrendingDown, TrendingUp, Truck, Users, CheckCircle, Clock, AlertCircle, FileText} from "lucide-react";
import { useState } from "react";
import { InvoicePageItem } from "../models/invoice";
import { PartnerAllDetails } from "../models/partner";
import { InvoiceStatusWithoutAll, invoiceStatusColors, invoiceStatusLabels } from "../types/invoiceStatus";
import { PartnerInvoiceStats } from "../types/partnersStats";
import { ChartMode } from "../components/widgets/RevnueExpensesBarChart";
import { PartnerRevenueStats } from "../types/partnerRevenueStats";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { partnerTypeSchema } from "../types/partnerType";
import { invoiceTypeSchema } from "../types/invoiceType";
import { DashboardAPI, InvoicesAPI, InvoicesCreditNoteAPI, partnersApi, PurchaseOrderAPI } from "../api/partners-api";

import { PurchaseOrderPageItem } from "../models/purchaseOrder";
import {  InvoiceCreditNotePageItem } from "../models/creditNote";
import { DocumentOrFile } from "@/shared/components/ui/documentPreviewModal";
import { PartnerDocumentType } from "../types/documentType";


export type PartnerDetailsProps = {
  partner: PartnerAllDetails;
  partnerStats: PartnerInvoiceStats,
  clientRevenueInitial?: PartnerRevenueStats[] | []
  supplierDespensesInitial?: PartnerRevenueStats[] | []
  totalRevenueInitial?: number,
  totalDespensesInitial?: number,
  onRefresh:  () => void
};

export default function UseClientsDetails({ partner, onRefresh }: PartnerDetailsProps) {

  const isSupplier = partner.partnerType === "SUPPLIER";
  const [open, setOpen] = useState(false)
  const [sendDocumentOpen, setSendDocumentOpen] = useState(false)
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
  const [deleteCNoteOpen, setDeleteCNoteOpen] = useState(false);
  const [modalPurchaseOrderOpen, setModalPurchaseOrderOpen] = useState(false);
  const [modalSupplierPurchaseOrderOpen, setModalSupplierPurchaseOrderOpen] = useState(false);
  const [sendeMailOpen, setSendMailOpen] = useState(false);
  const [selected, setSelected] = useState<InvoicePageItem | InvoiceCreditNotePageItem | PurchaseOrderPageItem | null>();
  const [selectedEmail, setSelectedEmail]= useState<string|null>(null)
  const [invoiceRef, setInvoiceRef] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [creditNoteId, setCreditNoteId] = useState("");
  const [invoiceType, setInvoiceType] = useState("");
  const [purchaseOrderId, setPurchaseOrderId] = useState("");
  const [showDetails, setShowDetails]= useState(false)
  const [openAddDocument, setOpenAddDocument] = useState(false);
  const [addDocumentLoading, setAddDocumentLoading] = useState(false);
  const [addDocumentType, setAddDocumentType] = useState<PartnerDocumentType>("CONTRACT");

  // Mock emails

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

  const [previewDocument, setPreviewDocument] = useState<DocumentOrFile>(null);
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


      const onAddDocument= ( type: PartnerDocumentType)=>{
        setAddDocumentType(type)
        setOpenAddDocument(true)
      }


      const addDocument= async (file: File, documentType: PartnerDocumentType)=>{
        try {
          setAddDocumentLoading(true)

          const formData = new FormData();
          formData.append("document", file)
          
          partner.partnerType ==="CLIENT" ?

            await partnersApi.uploadClientDocument(partner.idPartner, documentType, formData)

            : await partnersApi.uploadSupplierDocument(partner.idPartner, documentType, formData)

         appToast.success("Document ajouté avec succès", `Un nouvelle document ${documentType} est ajouté avec succèès.`)
         onRefresh()

        } catch (error) {
            appToast.error("Erreur", getApiErrorMessage(error))

        }finally{
          setAddDocumentLoading(false)
        }
      }

  const chartMode: ChartMode = partner.partnerType === "CLIENT" ? "revenues" : "expenses";

  return {sendDocumentOpen, setSendDocumentOpen,showDetails, setShowDetails, selectedEmail, setSelectedEmail,openAddDocument, setOpenAddDocument, addDocument,
    deleteClientInvoice,deleteLoading,setDeleteLoading,setDeleteOpen,invoiceRef,deleteOpen,setInvoiceId,purchaseOrderId,setPurchaseOrderId,setDeletePOrderOpen,deletePOrderOpen , deletePurchaseOrder,
    chartMode, getStatusIcon, getLabelColor, getStatusColor, toggleSection ,refresh,setRefresed,modalPurchaseOrderOpen,setModalPurchaseOrderOpen
    , previewDocument, setPreviewDocument, selectedPeriod, setSelectedPeriod,  activeTab, setActiveTab, supplierDespenses,totalDespenses
    , TotalIcon, HeaderIcon, open, setOpen, openSections, pageConfig, fetchPartnerStats,clientRevenue, totalRevenue ,sendeMailOpen, setSendMailOpen,
    updatePartnerStatus, deletePartnerOpen, setDeletePartnerOpen, updatePartnerStatusOpen, setUpdatePartnerStatusOpen,deleteCreditInvoice,
     setDeleteCNoteOpen,deleteCNoteOpen,creditNoteId,setCreditNoteId, modalSupplierPurchaseOrderOpen, setModalSupplierPurchaseOrderOpen, selected, setSelected, invoiceType, setInvoiceType,
    addDocumentLoading, addDocumentType, setAddDocumentType, onAddDocument
  };
}