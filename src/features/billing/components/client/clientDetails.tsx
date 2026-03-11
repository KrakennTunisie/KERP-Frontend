'use client'

import lazyComponent from "@/shared/utils/lazyComponent";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ClientPartner } from "../../models/partner";
import { partnersApi } from "../../api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import PageLoader from "@/shared/components/ui/pageLoader";


const PartnerDetails = lazyComponent(
  () => import("../partner/partnerDetails"),
  "Chargement de détails client..."
);

export default function ClientDetails(){
 const params = useParams();

  const clientId = params?.clientId as string;

  const [client, setClient] = useState<ClientPartner | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
  const fetchSupplier = async () => {
    try {
      setLoading(true)
      const supplier = await partnersApi.getClientById(clientId);
      setClient(supplier);
    } catch (error) {
      appToast.error(getApiErrorMessage(error));
    }
    finally{
      setLoading(false)
    }
  };

  fetchSupplier();
}, [params.id]);

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
                partnerType="CLIENT"
                invoices={client.invoices}
            />
        )

}