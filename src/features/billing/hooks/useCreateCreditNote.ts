import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { CreditNoteSchema, } from "../models/creditNote";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    calculateInvoiceTotals,
    calculUnityPrice,
    recalculate,
} from "../lib/invoiceCalculation";
import { InvoiceItem } from "../models/invoiceItem";
import { useEffect, useState } from "react";
import { invoiceTypeSchema } from "../types/invoiceType";
import { CreditNoteTypeSchema } from "../types/creditNoteType";
import { MOCK_PARTNERS } from "../mocks/clients-mocks";
import { Invoice } from "../models/invoice";
import { useRouter } from "next/navigation";
import { PaymentConditionSchema } from "../types/paymentCondition";
import defaultItem from "../mocks/invoice-items-mocks";

type creditNoteFormValues = z.infer<typeof CreditNoteSchema>;
type UpdateableField =
    | "description"
    | "quantity"
    | "unityPriceEXclTax"
    | "vatRate"
    | "operationCategory";

export default function useCreateCreditNote() {
    const [originalInvoice, setOriginalInvoice] = useState<Invoice>();
    const router = useRouter();
    const form = useForm<creditNoteFormValues>({
        resolver: zodResolver(CreditNoteSchema),
        defaultValues: {
            // valeurs par défaut minimales, sans dépendance à originalInvoice
            invoiceType: invoiceTypeSchema.enum.CREDITNOTE,
            invoiceNumber: "AV-2024-001",
            issueDate: new Date(),
            creditNoteReason: CreditNoteTypeSchema.enum["Quality Issue"],
            invoiceItems: [defaultItem()],
        },
        mode: "onChange",
    });
    const { control, setValue, getValues, handleSubmit ,reset} = form;
    const { append, remove,} = useFieldArray({
        control,
        name: "invoiceItems",
    });
    const previewData = useWatch({ control });
    // useEffect 1 : chargement de la facture originale // aprés on va changer par un appel d'api
    useEffect(() => {
        const fetchedInvoice: Invoice = {
            idInvoice: "550e8400-e29b-41d4",
            invoiceNumber: "FA-2024-001",
            issueDate: new Date("2024-03-01"),
            dueDate: new Date("2024-03-16"),
            invoiceType: "SALE",
            invoiceStatus: "À PAYER",
            invoiceComplianceStatus: "TTN_PENDING",
            currency: "TND",
            totalExclTax: 3900.00,
            totalInclTax: 4680.00,
            vatAmount:40,
            vatRate: 19,
            paymentMethod: "BANK_TRANSFER",
            exchangeRateReferenceDate: new Date("2024-03-01"),
            appliedExchangeRate: 3.25,
            exchangeRateSource: "CENTRAL_BANK",
            complianceQRcode: "https://qr.example.com/FA-2024-001",
            PaymentCondition: PaymentConditionSchema.enum.NET_15,
            purchaseOrder: null,
            partner: MOCK_PARTNERS[1],
            invoiceItems: null,
            invoiceDocument: null,
        };
        setOriginalInvoice(fetchedInvoice);
    }, []);

    // useEffect 2 : reset du formulaire quand originalInvoice est disponible
    useEffect(() => {
        if (!originalInvoice) return;

        reset({
            // ── champs hérités ───────────────────────────────────────
            partner: originalInvoice.partner,
            currency: originalInvoice.currency,
            paymentMethod: originalInvoice.paymentMethod,
            PaymentCondition: originalInvoice.PaymentCondition,
            appliedExchangeRate: originalInvoice.appliedExchangeRate,
            totalInclTax: originalInvoice.totalInclTax,
            invoiceItems: originalInvoice.invoiceItems ?? [defaultItem()],

            // ── champs overridés ─────────────────────────────────────
            invoiceType: invoiceTypeSchema.enum.CREDITNOTE,
            invoiceNumber: "AV-2024-001",
            issueDate: new Date(),

            // ── champs spécifiques à l'avoir ─────────────────────────
            refOriginalInvoice: originalInvoice.idInvoice,
            creditNoteReason: CreditNoteTypeSchema.enum["Quality Issue"],
        });
    }, [originalInvoice,reset]); // ← se déclenche après le chargement

    
    const syncItems = (newItems: InvoiceItem[]) => {
        setValue("invoiceItems", newItems, {shouldValidate: true,shouldDirty: true,  });
        calculateInvoiceTotals(getValues("invoiceItems")!);
    };

    const addItem = () => {
        append(defaultItem(), {shouldFocus: false, }); };

    // Suppression d'item et la mis à jour des totaux TTC / HT /TVA  
    const removeItem = (id: string) => {
    const currentItems = getValues("invoiceItems") ?? [];
      
      const index = currentItems.findIndex((item) => item.idInvoiceItem === id);
      if (index !== -1) {
        remove(index);
      }
    
      // Recalculer les totaux sans l'élément supprimé
      const remainingItems = currentItems.filter((item) => item.idInvoiceItem !== id);
      const totals = calculateInvoiceTotals(remainingItems);
    
      setValue("totalExclTax", totals.totalHT, { shouldValidate: true, shouldDirty: true });
      setValue("vatAmount", totals.totalTVA, { shouldValidate: true, shouldDirty: true });
      setValue("totalInclTax", totals.totalTTC, { shouldValidate: true, shouldDirty: true });
    };
    
    
    // Mis à jour les données d'item (QT, P.U, TVA ) et calcul de nouveau les totaux 
    const updateItem = ( id: string,  field: UpdateableField,value: string | number) => {
      const currentItems = getValues("invoiceItems") ?? [];
    
      const updatedItems = currentItems.map((item) => {
        if (item.idInvoiceItem !== id) return item;
        const updatedItem = { ...item, [field]: value };
        if (field === "unityPriceEXclTax") {
          const itemWithConvertedPrice = calculUnityPrice(
            updatedItem,
            getValues("currency"),
            getValues("appliedExchangeRate")
          );
          return recalculate(itemWithConvertedPrice);
        }
        return recalculate(updatedItem,);
      });
      const totals = calculateInvoiceTotals(updatedItems);
      setValue("totalExclTax", totals.totalHT, { shouldValidate: true, shouldDirty: true });
      setValue("vatAmount", totals.totalTVA, { shouldValidate: true, shouldDirty: true });
      setValue("totalInclTax", totals.totalTTC, { shouldValidate: true, shouldDirty: true });
      syncItems(updatedItems);
    };
  

    return {
        previewData,
        form,
        removeItem,
        addItem,
        updateItem,
        router
    }
}