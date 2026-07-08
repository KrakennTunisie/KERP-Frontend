"use client";

import { FolderTree } from "lucide-react";
import { cardProps, SettingCard } from "./settingCard";
import { SettingTypeSchema } from "../../types/settingType";
import { useEffect, useState } from "react";
import { OperationCategoryPageItem } from "../../models/operationCategory";
import { OperationCategoryAPI } from "../../api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";




export function OperationCategoryCard({ onShow, onToggleActive, onAction}: cardProps) {

    const [operationCategories, setOperationCategories]=useState<OperationCategoryPageItem[]|[]>([])
    const [fetchLoading, setFetchLoading]=useState(false)

    const fetchCategories = async ()=>{
        try {
            setFetchLoading(true)
            const response = await OperationCategoryAPI.getAllOperationCategories()
            setOperationCategories(response)
        } catch (error) {
            appToast.error("erreur de fetch", getApiErrorMessage(error))
        }finally{
            setFetchLoading(false)
        }
    }

    useEffect(()=>{
        fetchCategories()
    },[])


/*     const categories: SettingItem[] = operationCategorySchema.options.map((item)=>({
                                        idOperationCategory:item,
                                        code:"oviir",
                                        label: OperationCategoryLabels[item],
                                        description: "description",
                                        isActive: true,
                                        type: "OPERATION_CATEGORY",
                                        createdAt: new Date(),
                                        updatedAt: new Date()
                                      })) */
  return (
    <SettingCard
      title="Catégories d'opérations"
      type={SettingTypeSchema.enum.OPERATION_CATEGORY}
      description="Classification des opérations de facturation."
      icon={<FolderTree className="h-5 w-5 text-blue-600" />}
      items={operationCategories}
      actionLabel="+ Ajouter catégorie services"
      loading={fetchLoading}
      onAction={onAction}
      onShow={onShow}
      onRefresh={fetchCategories}
      onToggleActive={onToggleActive}
    />
  );
}