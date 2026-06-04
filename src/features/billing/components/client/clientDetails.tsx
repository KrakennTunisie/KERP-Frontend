'use client'

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ClientPartnerDetails, PartnerAllDetails } from "../../models/partner";
import { AuditLogAPI, DashboardAPI, InvoicesAPI, partnersApi } from "../../api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import PageLoader from "@/shared/components/ui/pageLoader";
import PartnerDetails from "../partner/partnerDetails";
import { PartnerInvoiceStats } from "../../types/partnersStats";
import { Invoice, InvoicePageItem, InvoicePageItemV2 } from "../../models/invoice";
import { NotFound } from "@/shared/components/widgets/notFound";
import { AuditLog } from "../../models/AuditLogs";
import { partnerTypeSchema } from "../../types/partnerType";
import { PartnerRevenueStats } from "../../types/partnerRevenueStats";
import { PurchaseOrderPartnerSummary } from "../../models/purchaseOrder";


export default function ClientDetails(){
 const params = useParams();

  const clientId = params?.clientId as string;

  const [client, setClient] = useState<PartnerAllDetails>();
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
  const [clientPurchaseOrder, setClientPurchaseOrder]= useState<PurchaseOrderPartnerSummary[]|[]>([])
  const [clientLogs, setClientLogs]= useState<AuditLog[]|[]>([])
  const [clientRevenueInitial, setClientRevenueInitial]= useState<PartnerRevenueStats[]|[]>([])
  const [supplierDespenses, setSupplierDespenses]= useState<PartnerRevenueStats[]|[]>([])
  const fetchClient = async () => {
    try {
      setLoading(true)
      const client = await partnersApi.getClientById(clientId);
      setClient(client);
      const clientStats = await InvoicesAPI.getClientInvoiceStats(clientId)
      setClientInvoiceStats(clientStats);
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
        const invoices = await partnersApi.getClientsInvoicesById(clientId);
        setClientInvoices(invoices);
      } catch (error) {
        appToast.error("Erreur fetch des factures client: ",getApiErrorMessage(error));
      }
      finally{
        setLoading(false)
      }
    };
     const fetchClientPurchaseorder = async () => {
      try {
        setLoading(true)
        const purchaseOrders = await partnersApi.getPurchaseOrderByPartnerId(clientId);
        setClientPurchaseOrder(purchaseOrders);
      } catch (error) {
        appToast.error("Erreur fetch des bon de commande client: ",getApiErrorMessage(error));
      }
      finally{
        setLoading(false)
      }
    };

     const fetchPartnerRevenue = async () => {
       if (!client) return;
       console.log("enter")
      try {
        setLoading(true)
        if(client?.partnerType == partnerTypeSchema.enum.CLIENT)
        {
          const clientRevenue = await DashboardAPI.clientRevenueStats(client.idPartner,"6")
          setClientRevenueInitial(clientRevenue);
        }
        else{
          const supplierDespenses = await DashboardAPI.supplierRevenueStats(client?.idPartner,"6")
          setSupplierDespenses(supplierDespenses);
        }
        
      } catch (error) {
        appToast.error("Erreur fetch des stats du  partenaire: ",getApiErrorMessage(error));
      }
      finally{
        setLoading(false)
      }
    };

    const fetchClientLogs = async () => {
      try {
        setLoading(true)
      const clientLogs = await AuditLogAPI.getAuditLogs(clientId)
       setClientLogs(clientLogs);
      } catch (error) {
        appToast.error("Erreur fetch les logs du client: ",getApiErrorMessage(error));
      }
      finally{
        setLoading(false)
      }
    };

  useEffect(() => {
  fetchClient();
  fetchClientInvoices();
  fetchClientPurchaseorder();
  fetchClientLogs();;
}, [clientId]);

 useEffect(() => {
  fetchPartnerRevenue();
}, [client]);

const totalRevenueInitial = useMemo(() => 
  clientRevenueInitial.reduce((sum, item) => sum + (item.revenueTTC ?? 0), 0),
[clientRevenueInitial]);

      if(loading){
        return(
            <PageLoader label="Chargement du client ..."/>            

        )
      }
      else if(!client){
        return <NotFound resource="Client" />;
      }

      else{   
        return(
            <PartnerDetails
                partner={client}
                partnerStats={clientInvoiceStats}
                partnerInvoices={clientInvoices}
                partnerLogs={clientLogs}
                onRefresh = {fetchClientLogs}
                clientRevenueInitial={clientRevenueInitial}
                totalRevenueInitial={totalRevenueInitial} 
            />
        )
      }
}