'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ClientPartner } from "../../models/partner";
import { InvoicesAPI, partnersApi } from "../../api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import PageLoader from "@/shared/components/ui/pageLoader";
import PartnerDetails from "../partner/partnerDetails";
import { PartnerInvoiceStats } from "../../types/partnersStats";
import { InvoicePageItem } from "../../models/invoice";




export default function ClientDetails(){
 const params = useParams();

  const clientId = params?.clientId as string;

  const [client, setClient] = useState<ClientPartner>();
  const [clientInvoiceStats, setClientInvoiceStats]=useState<PartnerInvoiceStats>({
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
  const [loading, setLoading] = useState<boolean>();
  const [clientInvoices, setClientInvoices]= useState<InvoicePageItem[]|[]>([])
  
  const fetchClient = async () => {
    try {
      setLoading(true)
      const client = await partnersApi.getClientById(clientId);
      const clientStats = await InvoicesAPI.getClientInvoiceStats(clientId)
      setClientInvoiceStats(clientStats);
      setClient(client);
    } catch (error) {
      appToast.error("Erreur Fetch du client:",getApiErrorMessage(error));
    }
    finally{
      setLoading(false)
    }
  };

  const fetchClientInvoices = async () => {
      try {
        setLoading(true)
        const invoices = await InvoicesAPI.getClientTopInvoices(clientId);
        setClientInvoices(invoices);
      } catch (error) {
        appToast.error("Erreur fetch des factures client: ",getApiErrorMessage(error));
      }
      finally{
        setLoading(false)
      }
    };

  useEffect(() => {

  fetchClient();
  fetchClientInvoices();
}, [clientId]);

if(loading){
  return(
      <PageLoader label="Chargement du client ..."/>            

  )
}

if(client==null){
  return(
      <div className="p-6">
        <p className="text-sm font-medium text-gray-500">
          Client introuvable.
        </p>
      </div>
  )
}
        return(
            <PartnerDetails
                partner={client}
                partnerStats={clientInvoiceStats}
                partnerInvoices={clientInvoices}
            />
        )

}