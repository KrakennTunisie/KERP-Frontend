'use client';

import { useEffect, useState } from "react";
import PartnerDetails from "../partner/partnerDetails";
import { useParams } from "next/navigation";
import { SupplierPartner } from "../../models/partner";
import { partnersApi } from "../../api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import PageLoader from "@/shared/components/ui/pageLoader";

export default function SupplierDetails(){
  const params = useParams();

  const supplierId = params?.supplierId as string;

  const [supplier, setSupplier] = useState<SupplierPartner | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
  const fetchSupplier = async () => {
    try {
      setLoading(true)
      const supplier = await partnersApi.getSupplierById(supplierId);
      setSupplier(supplier);
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
      <PageLoader label="Chargement de fournsisseur ..."/>            

  )
}

if(supplier==null){
  return(
      <div className="p-6">
        <p className="text-sm font-medium text-gray-500">
          Fournisseur introuvable.
        </p>
      </div>
  )
}

        return(

            <PartnerDetails
                partner={supplier}
                partnerType="SUPPLIER"
                invoices={supplier?.invoices}
            />
        )

}