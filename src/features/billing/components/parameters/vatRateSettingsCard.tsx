"use client";

import { Percent } from "lucide-react";
import { cardProps, SettingCard } from "./settingCard";
import { SettingTypeSchema } from "../../types/settingType";
import { TVARatePageItem } from "../../models/TVArate";
import { useEffect, useState } from "react";
import { TvaRateAPI } from "../../api/partners-api";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";



export function VatRateCard( { onShow, onToggleActive, onAction}: cardProps) {

/* const vatRates: SettingItem[] = tvaRateSchema.options
                                    .map((item)=>({
                                        idTVARate: item.value.toString(),
                                        code:"code",
                                        label: item.value+"%",
                                        type:"TVA_RATE",
                                        description: "description",
                                        isActive: true,
                                        createdAt: new Date(),
                                        updatedAt: new Date()
                                      }) */
    const [vatRates, setVatRates]=useState<TVARatePageItem[]|[]>([])
        const [fetchLoading, setFetchLoading]=useState(false)
    
        const fetchPaymentConditions = async ()=>{
            try {
                setFetchLoading(true)
                const response = await TvaRateAPI.getAllTvaRates()
                setVatRates(response)
            } catch (error) {
                appToast.error("erreur de fetch", getApiErrorMessage(error))
            }finally{
                setFetchLoading(false)
            }
        }
    
        useEffect(()=>{
            fetchPaymentConditions()
        },[])
    
  return (
    <SettingCard
      title="Taux de TVA"
      type={SettingTypeSchema.enum.TVA_RATE}
      description="Taxes appliquées aux factures."
      icon={<Percent className="h-5 w-5 text-orange-600" />}
      items={vatRates}
      actionLabel="+ Ajouter taux de TVA"
      loading={fetchLoading}
      onAction={onAction}
      onShow={onShow}
      onRefresh={fetchPaymentConditions}
      onToggleActive={onToggleActive}
    />
  );
}