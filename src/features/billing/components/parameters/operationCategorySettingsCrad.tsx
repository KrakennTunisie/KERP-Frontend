"use client";

import { FolderTree } from "lucide-react";
import { cardProps, SettingCard, SettingItem } from "./settingCard";
import { OperationCategoryLabels, operationCategorySchema } from "../../types/operationCategory";




export function OperationCategoryCard({onDelete, onShow, onToggleActive, onAction}: cardProps) {

    const categories: SettingItem[] = operationCategorySchema.options.map((item)=>({
                                        id: item,
                                        code:"oviir",
                                        label: OperationCategoryLabels[item],
                                        description: "description",
                                        isActive: true,
                                        type: "OperationCategory",
                                        createdAt: new Date(),
                                        updatedAt: new Date()
                                      }))
  return (
    <SettingCard
      title="Catégories d'opérations"
      type="OperationCategory"
      description="Classification des opérations de facturation."
      icon={<FolderTree className="h-5 w-5 text-blue-600" />}
      items={categories}
      actionLabel="+ Ajouter catégorie services"
      onAction={onAction}
      onDelete={onDelete}
      onShow={onShow}
      onToggleActive={onToggleActive}
    />
  );
}