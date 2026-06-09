'use client'

import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import PageLoader from "@/shared/components/ui/pageLoader";
import { NotFound } from "@/shared/components/widgets/notFound";
import { appToast } from "@/shared/lib/toast";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DashboardAPI, InvoicesAPI, partnersApi } from "../../api/partners-api";
import { PartnerAllDetails } from "../../models/partner";
import { PartnerRevenueStats } from "../../types/partnerRevenueStats";
import { PartnerInvoiceStats } from "../../types/partnersStats";
import PartnerDetails from "../partner/partnerDetails";


export default function ClientDetails() {
  const params = useParams();

  const clientId = params?.clientId as string;

  const [client, setClient] = useState<PartnerAllDetails>();
  const [clientInvoiceStats, setClientInvoiceStats] = useState<PartnerInvoiceStats>({
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
  const [clientRevenueInitial, setClientRevenueInitial] = useState<PartnerRevenueStats[] | []>([])
  const fetchClient = async () => {
    try {
      setLoading(true)
      const client = await partnersApi.getClientById(clientId);
      setClient(client);
      const clientStats = await InvoicesAPI.getClientInvoiceStats(clientId)
      setClientInvoiceStats(clientStats);
    } catch (error) {
      appToast.error("Erreur Fetch du client:", getApiErrorMessage(error));
    }
    finally {
      setLoading(false)
    }
  };

  const fetchPartnerRevenue = async () => {
    if (!client) return;
    console.log("enter")
    try {
      setLoading(true)

      const clientRevenue = await DashboardAPI.clientRevenueStats(client.idPartner, "6")
      setClientRevenueInitial(clientRevenue);



    } catch (error) {
      appToast.error("Erreur fetch des stats du  client: ", getApiErrorMessage(error));
    }
    finally {
      setLoading(false)
    }
  };



  useEffect(() => {
    fetchClient();
  }, [clientId]);

  useEffect(() => {
    fetchPartnerRevenue();
  }, [client]);

  const totalRevenueInitial = useMemo(() =>
    clientRevenueInitial.reduce((sum, item) => sum + (item.revenueTTC ?? 0), 0),
    [clientRevenueInitial]);

  if (loading) {
    return (
      <PageLoader label="Chargement du client ..." />

    )
  }
  else if (!client) {
    return <NotFound resource="Client" />;
  }

  else {
    return (
      <PartnerDetails
        partner={client}
        partnerStats={clientInvoiceStats}
        clientRevenueInitial={clientRevenueInitial}
        totalRevenueInitial={totalRevenueInitial}
        onRefresh={fetchClient}

      />
    )
  }
}