"use client";

import { Percent } from "lucide-react";
import { cardProps, SettingCard } from "./settingCard";
import { SettingTypeSchema } from "../../types/settingType";
import { TVARatePageItem } from "../../models/TVArate";
import { useEffect, useState } from "react";
import { TvaRateAPI } from "../../api/partners-api";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";



export function VatRateCard( { onShow, onToggleActive, onAction, onFetchReady}: cardProps) {


    const [vatRates, setVatRates]=useState<TVARatePageItem[]|[]>([])
    const [fetchLoading, setFetchLoading]=useState(false)
    const [open, setOpen]=useState(false)

    
        const fetchTvaRates = async ()=>{
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
        if(open)
        fetchTvaRates();
    },[open])

    useEffect(()=>{
        if(open)
        onFetchReady(fetchTvaRates);
    },[open])
    
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
      onRefresh={fetchTvaRates}
      onToggleActive={onToggleActive}
      open={open}
      setOpen={setOpen}
    />
  );
}