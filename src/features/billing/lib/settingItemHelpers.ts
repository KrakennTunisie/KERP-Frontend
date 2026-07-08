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