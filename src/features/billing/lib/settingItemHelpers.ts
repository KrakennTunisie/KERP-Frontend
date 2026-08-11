import { OperationCategoryPageItem } from "../models/operationCategory";
import { PaymentConditionPageItem } from "../models/paymentCondition";
import { SettingPageItem } from "../models/SettingItem";
import { TVARatePageItem } from "../models/TVArate";
import { SettingTypeSchema } from "../types/settingType";


export const getSettingItemId = (item: SettingPageItem): string => {
switch (item.settingType) {
    case SettingTypeSchema.enum.OPERATION_CATEGORY:
        return (item as OperationCategoryPageItem).idOperationCategory;

    case SettingTypeSchema.enum.PAYMENT_CONDITION:
        return (item as PaymentConditionPageItem).idPaymentCondition;

    case SettingTypeSchema.enum.TVA_RATE:
        return (item as TVARatePageItem).idTVARate;
}

};

export const formatShowLabel = (label: string): string => {
  const match = label.match(/^NET_(\d+)$/);

  if (!match) {
    return label;
  }

  return `Net ${match[1]} jours`;
};

export const extractPaymentConditionDays = (label: string): string => {
  const match = label.match(/^NET_(\d+)$/);

  return match?.[1] ?? '0';
};

export const extractTvaRate = (label: string): number => {
  const match = label.match(/^(\d{1,3})%$/);

  return match ? Number(match[1]) : 0;
};