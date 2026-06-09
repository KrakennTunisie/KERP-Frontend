'use client';

import { useEffect, useMemo, useState } from "react";
import PartnerDetails from "../partner/partnerDetails";
import { useParams } from "next/navigation";
import { PartnerAllDetails } from "../../models/partner";
import {  DashboardAPI, InvoicesAPI,  partnersApi } from "../../api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import PageLoader from "@/shared/components/ui/pageLoader";
import { PartnerInvoiceStats } from "../../types/partnersStats";
import { NotFound } from "@/shared/components/widgets/notFound";
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
  const [loading, setLoading] = useState<boolean>(true);
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



  useEffect(() => {
    fetchSupplier();
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
        onRefresh={fetchSupplier}
        supplierDespensesInitial={supplierDespensesInitial}
        totalDespensesInitial={totalDespensesInitial}
      />
    )
  }

}