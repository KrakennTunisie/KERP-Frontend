import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { InvoiceStatus, invoiceStatusSchema } from "../types/invoiceStatus";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { InvoicePageItem } from "../models/invoice";
import { PartnerInvoiceStats } from "../types/partnersStats";
import { InvoicesAPI } from "../api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { InvoiceData } from "../components/widgets/invoicePreview";
import { create } from "zustand";
import { useInvoiceStore } from "../lib/globalStateFile";
export type PropsSupplier = {
  params: {
    invoiceId: string
  }
}

export default function useSupplierInvoiceList() {
  const searchParams = useSearchParams();

  const supplier = searchParams.get("supplier") ?? "";
  const [search, setSearch] = useState(supplier);
  const [filtre, setFiltre] = useState<InvoiceStatus>("ALL");
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [archiveLoading, setArchiveLoading] = useState(false)
  const [updateLoading, setUpdateLoading] = useState(false)
  const [invoiceId, setInvoiceId] = useState("")
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [invoiceRef, setInvoiceRef] = useState("");
  const [suppliersInvoices, setSuppliersInvoices] = useState<InvoicePageItem[] | []>([])
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoicePageItem | null>(null)
  const [nextStatus, setNextStatus] = useState("")
  const router = useRouter()
  const debouncedSearchQuery = useDebounce(search, 2000);
  const [isUploadInvoiceOpen, setIsUploadInvoiceOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);



  const [suppliersInvoiceStats, setSuppliersInvoiceStats] = useState<PartnerInvoiceStats>({
    totalAmountTND: 0,
    totalAmountEUR: 0,
    totalAmountUSD: 0,

    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,

    pendingAmountTND: 0,
    pendingAmountEUR: 0,
    pendingAmountUSD: 0,

    averageInvoiceTND: 0,
    averageInvoiceEUR: 0,
    averageInvoiceUSD: 0,
  })
  //const [loading, setLoading] = useState<boolean>();
  const fetchSupplierInvoicesStats = async () => {
    try {
      //setLoading(true)
      const supplierStats = await InvoicesAPI.getAllSupplierInvoiceStats()
      setSuppliersInvoiceStats(supplierStats);
    } catch (error) {
      appToast.error("Erreur Fetch du client:", getApiErrorMessage(error));
    }
    finally {
      //  setLoading(false)
    }
  };

  useEffect(() => {

    fetchSupplierInvoicesStats();
  }, []);
  const deleteSupplierInvoice = async () => {
    try {
      setDeleteLoading(true);
      await InvoicesAPI.deleteSupplierInvoice(invoiceId);
      appToast.success('Facture supprimée avec succès.')
      setInvoiceId("")
      setDeleteOpen(false)
      await fetchSuppliersInvoices()
    } catch (error) {
      appToast.error("Erreur de suppresion: ", getApiErrorMessage(error))
    } finally {
      setDeleteLoading(false);
    }
  }


  const fetchSuppliersInvoices = async () => {
    try {
      setLoading(true);
      const keyword =
        debouncedSearchQuery.trim().length >= 3
          ? debouncedSearchQuery.trim()
          : undefined;

      const response = await InvoicesAPI.getSuppliersInvoices({
        keyword: keyword,
        filter: filtre?.toString() === invoiceStatusSchema.enum.ALL ? "" : filtre?.toString(),
        page: currentPage - 1,
      });

      setSuppliersInvoices(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      appToast.error("Erreur de fetch clients: ", getApiErrorMessage(error))
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    setCurrentPage(1);
  }, [filtre, debouncedSearchQuery]);

  useEffect(() => {

    fetchSuppliersInvoices();
  }, [debouncedSearchQuery, currentPage, filtre]);

  const updateStatus = async () => {
    try {
      setLoading(true)
      const formData = new FormData();

      formData.append("status", nextStatus);
      await InvoicesAPI.updateSupplierInvoiceStatus(invoiceId, formData);
      appToast.success('Statut mise à jour avec succès avec succès.')
      setUpdateOpen(false)
      await fetchSuppliersInvoices()
    } catch (error) {
      appToast.error("Erreur Fetch du client:", getApiErrorMessage(error));
    }
    finally {
      setLoading(false)
      setInvoiceId("")
    }
  }

  const archiveInvoice = async () => {
    try {
      setArchiveLoading(true);
      const formData = new FormData();
      formData.append("status", "ARCHIVED");
      await InvoicesAPI.updateSupplierInvoiceStatus(invoiceId, formData);
      appToast.success('Facture archivée avec succés.')
      setArchiveOpen(false)
      await fetchSuppliersInvoices()
    } catch (error) {
      appToast.error("Erreur d'archivage: ", getApiErrorMessage(error))
    } finally {
      setArchiveLoading(false);
    }
  }

  const setFile = useInvoiceStore(state => state.setFile);
  const setFileUrl = useInvoiceStore(state => state.setFileUrl);

  const handleUpload = async (file: File) => {
    setLoading(true);
    try {
      setIsUploadOpen(false);
      setFile(file);
      const url = URL.createObjectURL(file);
      setFileUrl(url);

      const extractedData = await extractInvoice(file);

      localStorage.setItem('extractedInvoiceData', JSON.stringify(extractedData));
     

      router.push(`/billing/invoices/suppliers/create`);
    } catch (error) {
      console.error('Extraction failed:', error);
      router.push(`/billing/invoices/suppliers/create`);
    } finally {
      setLoading(false);
    }
  };

  async function extractInvoice(file: File) {
  const formData = new FormData();
  formData.append("data", file);

  const res = await fetch("/api/n8n/invoice-ocr", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Extraction request failed with status ${res.status}`);
  }

  return res.json();
}

  return {
    router,
    search,
    setSearch,
    open,
    setOpen,
    deleteOpen,
    setDeleteOpen,
    updateOpen,
    setUpdateOpen,
    setInvoiceRef,
    invoiceRef,
    filtre,
    setFiltre,
    suppliersInvoices,
    currentPage,
    setCurrentPage,
    totalElements,
    totalPages,
    deleteSupplierInvoice,
    invoiceId,
    setInvoiceId,
    deleteLoading,
    updateStatus,
    updateLoading,
    loading,
    nextStatus, setNextStatus,
    selectedInvoice, setSelectedInvoice,
    suppliersInvoiceStats,
    isUploadInvoiceOpen, setIsUploadInvoiceOpen,
    handleUpload,
    archiveLoading,
    archiveOpen,
    setArchiveOpen,
    archiveInvoice


  }

}