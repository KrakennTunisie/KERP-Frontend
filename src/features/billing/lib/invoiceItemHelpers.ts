import { PdfLineItem } from "@/shared/pdf/types";
import { InvoiceItem } from "../models/invoiceItem";
import { CurrencyType } from "../types/currency";
import { discountTypeSchema } from "../types/discountType";

export const getDiscountLabel = (invoiceItem: InvoiceItem | PdfLineItem, currency: CurrencyType): string=>{
    if(invoiceItem && invoiceItem.discountType && invoiceItem.discountValue){
         const discountLabel =  invoiceItem.discountType === discountTypeSchema.enum.PERCENTAGE ?
          invoiceItem.discountValue +"%"
          :invoiceItem.discountValue+" "+currency
        return discountLabel;
    }

    return "-";
}

export const getDiscountValue = (invoiceItem: InvoiceItem, subtotal: number): number=>{
    if(invoiceItem && invoiceItem.discountType && invoiceItem.discountValue){
         const discount =
        invoiceItem.discountType === discountTypeSchema.enum.PERCENTAGE
          ? subtotal * Number(invoiceItem.discountValue ?? 0) / 100
          : Number(invoiceItem.discountValue ?? 0);
        return discount;
    }

    return 0;
}