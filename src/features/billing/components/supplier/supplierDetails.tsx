'use client';

import { useEffect, useMemo, useState } from "react";
import PartnerDetails from "../partner/partnerDetails";
import { useParams } from "next/navigation";
import { PartnerAllDetails, SupplierPartnerDetails } from "../../models/partner";
import { AuditLogAPI, DashboardAPI, InvoicesAPI, partnersApi } from "../../api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import PageLoader from "@/shared/components/ui/pageLoader";
import { PartnerInvoiceStats } from "../../types/partnersStats";
import { Invoice, InvoicePageItem, InvoicePageItemV2 } from "../../models/invoice";
import { NotFound } from "@/shared/components/widgets/notFound";
import { AuditLog } from "../../models/AuditLogs";
import { PartnerRevenueStats } from "../../types/partnerRevenueStats";

export default function SupplierDetails() {
  const params = useParams();

  const supplierId = params?.supplierId as string;
  const [supplierInvoiceStats, setSupplierInvoiceStats] = useState<PartnerInvoiceStats>({
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

  const [supplier, setSupplier] = useState<PartnerAllDetails>();
  const [supplierInvoices, setSupplierInvoices] = useState<InvoicePageItem[]|[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [supplierLogs, setSupplierLogs] = useState<AuditLog[] | []>([])
  const [supplierDespensesInitial, setSupplierDespensesInitial] = useState<PartnerRevenueStats[] | []>([])
  const fetchSupplier = async () => {
    try {
      setLoading(true)
      const supplier = await partnersApi.getSupplierById(supplierId);
      setSupplier(supplier);

      const clientStats = await InvoicesAPI.getSupplierInvoiceStats(supplierId)
      setSupplierInvoiceStats(clientStats);

    } catch (error) {
      appToast.error("Erreur fetch du fournisseur: ", getApiErrorMessage(error));
    }
    finally {
      setLoading(false)
    }
  };


  const fetchSupplierInvoices = async () => {
    try {
      setLoading(true)
      const invoices = await partnersApi.getSupplierInvoicesById(supplierId);
      setSupplierInvoices(invoices);
    } catch (error) {
      appToast.error("Erreur fetch des factures fournisser: ", getApiErrorMessage(error));
    }
    finally {
      setLoading(false)
    }
  };

  const fetchSupplierRevenue = async () => {
    if (!supplier) return;

    try {
      setLoading(true)
      const supplierDespenses = await DashboardAPI.supplierRevenueStats(supplier?.idPartner, "6")
      setSupplierDespensesInitial(supplierDespenses);
    } catch (error) {
      appToast.error("Erreur fetch des stats du  fournisseur: ", getApiErrorMessage(error));
    }
    finally {
      setLoading(false)
    }
  };

  const fetchSupplierLogs = async () => {
    try {
      setLoading(true)
      const clientLogs = await AuditLogAPI.getAuditLogsBySupplier(supplierId)
      setSupplierLogs(clientLogs);
    } catch (error) {
      appToast.error("Erreur fetch les logs du fournisseur: ", getApiErrorMessage(error));
    }
    finally {
      setLoading(false)
    }
  };


  useEffect(() => {
    fetchSupplier();
    fetchSupplierInvoices();
    fetchSupplierLogs();
  }, [supplierId]);

  useEffect(() => {
    fetchSupplierRevenue();
  }, [supplier]);
  

  const totalDespensesInitial = useMemo(() => 
    supplierDespensesInitial.reduce((sum, item) => sum + (item.revenueTTC ?? 0), 0),
  [supplierDespensesInitial]);
  

  if (loading) {
    return (
      <PageLoader label="Chargement du fournisseur ..." />

    )
  }
  else if (!supplier) {
    return <NotFound resource="Fournisseur" />;
  }

  else {
    return (
      <PartnerDetails
                partner={supplier}
                partnerStats={supplierInvoiceStats}
                partnerInvoices={supplierInvoices}
                partnerLogs={supplierLogs}
                onRefresh = {fetchSupplierLogs}
                supplierDespensesInitial={supplierDespensesInitial}
                totalDespensesInitial={totalDespensesInitial} 
      />
    )
  }

}