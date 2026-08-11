"use client";

import { CreditCard } from "lucide-react";
import { cardProps, SettingCard } from "./settingCard";
import { SettingTypeSchema } from "../../types/settingType";
import { useEffect, useState } from "react";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import {  PaymentConditionAPI } from "../../api/partners-api";
import { PaymentConditionPageItem } from "../../models/paymentCondition";



export function PaymentConditionCard({ onShow, onToggleActive, onAction, onFetchReady}: cardProps) {

    const [paymentConditions, setPaymentConditions]=useState<PaymentConditionPageItem[]|[]>([])
    const [fetchLoading, setFetchLoading]=useState(false)
    const [open, setOpen]=useState(false)

    const fetchPaymentConditions = async ()=>{
        try {
            setFetchLoading(true)
            const response = await PaymentConditionAPI.getAllPaymentConditions()
            setPaymentConditions(response)
        } catch (error) {
            appToast.error("erreur de fetch", getApiErrorMessage(error))
        }finally{
            setFetchLoading(false)
        }
    }

    useEffect(()=>{
        if(open)
        fetchPaymentConditions();
    },[open])

    useEffect(()=>{
        if(open)
        onFetchReady(fetchPaymentConditions);
    },[open])

  return (
    <SettingCard
      title="Conditions de paiement"
      type={SettingTypeSchema.enum.PAYMENT_CONDITION}
      description="Définissez les échéances de paiement des factures."
      icon={<CreditCard className="h-5 w-5 text-emerald-600" />}
      items={paymentConditions}
      actionLabel="+ Ajouter condition de paiement"
      loading={fetchLoading}
      onAction={onAction}
      onShow={onShow}
      onRefresh={fetchPaymentConditions}
      onToggleActive={onToggleActive}
      open={open}
      setOpen={setOpen}
    />
  );
}