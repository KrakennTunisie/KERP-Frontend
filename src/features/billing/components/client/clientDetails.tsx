'use client'

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ClientPartner } from "../../models/partner";
import { partnersApi } from "../../api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import PageLoader from "@/shared/components/ui/pageLoader";
import PartnerDetails from "../partner/partnerDetails";




export default function ClientDetails(){
 const params = useParams();

  const clientId = params?.clientId as string;

  const [client, setClient] = useState<ClientPartner>();
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
  const fetchClient = async () => {
    try {
      setLoading(true)
      const client = await partnersApi.getClientById(clientId);
      setClient(client);
    } catch (error) {
      appToast.error(getApiErrorMessage(error));
    }
    finally{
      setLoading(false)
    }
  };

  fetchClient();
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
            />
        )

}