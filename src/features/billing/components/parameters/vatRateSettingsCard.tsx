"use client";

import { Percent } from "lucide-react";
import { cardProps, SettingCard, SettingItem } from "./settingCard";
import { tvaRateSchema } from "../../types/tvaRate";



export function VatRateCard( {onDelete, onShow, onToggleActive, onAction}: cardProps) {

const vatRates: SettingItem[] = tvaRateSchema.options
                                    .map((item)=>({
                                        id: item.value.toString(),
                                        code:"code",
                                        label: item.value+"%",
                                        type:"TVA",
                                        description: "description",
                                        isActive: true,
                                        createdAt: new Date(),
                                        updatedAt: new Date()
                                      }))
  return (
    <SettingCard
      title="Taux de TVA"
      type="TVA"
      description="Taxes appliquées aux factures."
      icon={<Percent className="h-5 w-5 text-orange-600" />}
      items={vatRates}
      actionLabel="+ Ajouter taux de TVA"
      onAction={onAction}
      onDelete={onDelete}
      onShow={onShow}
      onToggleActive={onToggleActive}
    />
  );
}