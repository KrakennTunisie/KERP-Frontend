'use client';

import { useEffect, useState } from "react";
import PartnerDetails from "../partner/partnerDetails";
import { useParams } from "next/navigation";
import {  SupplierPartner } from "../../models/partner";
import { InvoicesAPI, partnersApi } from "../../api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import PageLoader from "@/shared/components/ui/pageLoader";
import { PartnerInvoiceStats } from "../../types/partnersStats";
import { InvoicePageItem } from "../../models/invoice";
import { NotFound } from "@/shared/components/widgets/notFound";

export default function SupplierDetails(){
  const params = useParams();

  const supplierId = params?.supplierId as string;
    const [supplierInvoiceStats, setSupplierInvoiceStats]=useState<PartnerInvoiceStats>({
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

  const [supplier, setSupplier] = useState<SupplierPartner>();
  const [supplierInvoices, setSupplierInvoices]= useState<InvoicePageItem[]|[]>([])
  const [loading, setLoading] = useState<boolean>(true);

    const fetchSupplier = async () => {
    try {
      setLoading(true)
      const supplier = await partnersApi.getSupplierById(supplierId);
      const clientStats = await InvoicesAPI.getSupplierInvoiceStats(supplierId)
      setSupplierInvoiceStats(clientStats);
      setSupplier(supplier);
    } catch (error) {
      appToast.error("Erreur fetch du fournisseur: ",getApiErrorMessage(error));
    }
    finally{
      setLoading(false)
    }
  };


  const fetchSupplierInvoices = async () => {
    try {
      setLoading(true)
      const invoices = await InvoicesAPI.getSupplierTopInvoices(supplierId);
      setSupplierInvoices(invoices);
    } catch (error) {
      appToast.error("Erreur fetch des factures fournisseur: ",getApiErrorMessage(error));
    }
    finally{
      setLoading(false)
    }
  };
  useEffect(() => {
  fetchSupplier();
  fetchSupplierInvoices();
}, [supplierId]);

      if(loading){
        return(
            <PageLoader label="Chargement du fournisseur ..."/>            

        )
      }
      else if(!supplier){
        return <NotFound resource="Fournisseur" />;
      }

      else{   
        return(
            <PartnerDetails
                partner={supplier}
                partnerStats={supplierInvoiceStats}
                partnerInvoices={supplierInvoices}
            />
        )
      }

}