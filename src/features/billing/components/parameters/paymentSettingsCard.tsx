"use client";

import { CreditCard } from "lucide-react";
import { cardProps, SettingCard, SettingItem } from "./settingCard";
import { PaymentConditionLabels, PaymentConditionSchema } from "../../types/paymentCondition";



export function PaymentConditionCard({onDelete, onShow, onToggleActive, onAction}: cardProps) {
  
const paymentConditions: SettingItem[] = Object.values(PaymentConditionSchema.enum)
                                    .map((item)=>({
                                        id:item,
                                        code:"uuu",
                                        label: PaymentConditionLabels[item],
                                        type:"PaymentCondition",
                                        description: "description",
                                        isActive: false,
                                        createdAt: new Date(),
                                        updatedAt: new Date()
                                      }))
  return (
    <SettingCard
      title="Conditions de paiement"
      type="PaymentCondition"
      description="Définissez les échéances de paiement des factures."
      icon={<CreditCard className="h-5 w-5 text-emerald-600" />}
      items={paymentConditions}
      actionLabel="+ Ajouter condition de paiement"
      onAction={onAction}
      onDelete={onDelete}
      onShow={onShow}
      onToggleActive={onToggleActive}
    />
  );
}