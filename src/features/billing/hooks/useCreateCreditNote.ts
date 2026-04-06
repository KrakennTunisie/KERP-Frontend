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
import { useEffect, useRef, useState } from "react";
import { invoiceTypeSchema } from "../types/invoiceType";
import { CreditNoteTypeSchema } from "../types/creditNoteType";
import { MOCK_PARTNERS } from "../mocks/clients-mocks";
import { Invoice } from "../models/invoice";
import { useRouter } from "next/navigation";
import { PaymentConditionSchema } from "../types/paymentCondition";
import defaultItem from "../mocks/invoice-items-mocks";
import { handleSaveAsPDF } from "../lib/buildInvoicePDF";
import { invoiceStatusSchema } from "../types/invoiceStatus";
import { invoiceComplianceStatusSchema } from "../types/invoiceComplianceStatus";
import { paymentMethodSchema } from "../types/paymentMethod";
import { exchangeRateSourceSchema } from "../types/exchangeRateSource";
import { currencyTypeSchema } from "../types/currency";

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [TtnModalOpen, setTtnModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const invoiceRef = useRef<HTMLDivElement>(null);
    const [pdfUrl, setPdfUrl] = useState<File | null>(null);

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
    const { control, setValue, getValues, handleSubmit, reset, formState: { isDirty, isValid, errors } } = form;
    const { append, remove, } = useFieldArray({
        control,
        name: "invoiceItems",
    });
    const previewData = useWatch({ control });
    // useEffect 1 : chargement de la facture originale // aprés on va changer par un appel d'api
    useEffect(() => {
        const fetchedInvoice: Invoice = {
            idInvoice: crypto.randomUUID(),
            invoiceNumber: "FA-2024-001",
            issueDate: new Date("2024-03-01"),
            dueDate: new Date("2024-03-16"),
            invoiceType: invoiceTypeSchema.enum.SALE,
            invoiceStatus: invoiceStatusSchema.enum.PAYÉE,
            invoiceComplianceStatus: invoiceComplianceStatusSchema.enum.TTN_PENDING,
            currency: currencyTypeSchema.enum.TND,
            totalExclTax: 3900.00,
            totalInclTax: 4680.00,
            vatAmount: 40,
            vatRate: 19,
            paymentMethod: paymentMethodSchema.enum.BANK_TRANSFER,
            exchangeRateReferenceDate: new Date("2024-03-01"),
            appliedExchangeRate: 3.25,
            exchangeRateSource: exchangeRateSourceSchema.enum.CENTRAL_BANK,
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
    partner: originalInvoice.partner ?? undefined,
    currency: originalInvoice.currency,
    paymentMethod: originalInvoice.paymentMethod ?? undefined,
    PaymentCondition: originalInvoice.PaymentCondition ?? undefined,
    appliedExchangeRate: originalInvoice.appliedExchangeRate ?? undefined,
    totalInclTax: originalInvoice.totalInclTax,
    invoiceItems: originalInvoice.invoiceItems ?? [defaultItem()],

    // ── champs overridés ─────────────────────────────────────
    invoiceType: invoiceTypeSchema.enum.CREDITNOTE,
    invoiceNumber: "AV-2024-001",
    issueDate: new Date(),

    // ── champs spécifiques à l'avoir ─────────────────────────
    refOriginalInvoice: originalInvoice.idInvoice,
    creditNoteReason: CreditNoteTypeSchema.enum["Quality Issue"],

    // ── champs manquants ─────────────────────────────────────
    idInvoice: crypto.randomUUID(),
    dueDate: new Date(),              
    exchangeRateReferenceDate: originalInvoice.exchangeRateReferenceDate ,
    exchangeRateSource: originalInvoice.exchangeRateSource,
    invoiceComplianceStatus: originalInvoice.invoiceComplianceStatus,  
    invoiceStatus: invoiceStatusSchema.enum["À PAYER"],
    invoiceDocument: originalInvoice.invoiceDocument,      
    purchaseOrder:originalInvoice.purchaseOrder,       
    vatRate: originalInvoice.vatRate,
    complianceQRcode: "",
});
    }, [originalInvoice, reset]);
    
    // Validation des données 
    const canCreateInvoice =
        isDirty &&
        isValid &&
        !!previewData.creditNoteReason &&
        !!previewData.invoiceItems?.length &&
        !!previewData.issueDate &&
        !!previewData.PaymentCondition &&
        !!previewData.paymentMethod &&
        previewData.invoiceItems.every(
            (item) =>
                item.description?.trim() &&
                item.operationCategory?.trim() &&
                item.quantity! > 0 &&
                item.unityPriceEXclTax! >= 0 &&
                item.vatRate! >= 0
        );

    const syncItems = (newItems: InvoiceItem[]) => {
        setValue("invoiceItems", newItems, { shouldValidate: true, shouldDirty: true, });
        calculateInvoiceTotals(getValues("invoiceItems")!);
    };
    
    // L'ajout d'une carte pour une prestation
    const addItem = () => {
        append(defaultItem(), { shouldFocus: false, });
    };

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
    const updateItem = (id: string, field: UpdateableField, value: string | number) => {
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
     
    //Génération et visualisation du document PDF Facture Avoir 
    const onSubmit = handleSubmit(
       
        async (data) => {
             console.log("hi")
            const file = await handleSaveAsPDF(invoiceRef, getValues("invoiceNumber"));
            if (file) {
                setValue("invoiceDocument", file, { shouldValidate: true, shouldDirty: true });
                setPdfUrl(file);
            }
            setIsModalOpen(true);
        },
        (errors) => {
            console.log("erreurs validation", errors);
        }
    );

    //Fermer le document modal 
    function onCloseDocumentModal() {
        setIsModalOpen(false);
        setPdfUrl(null);
    }

    //Insertion de la facture au niveau de la BD 
    function createInvoice() {
        //Appel de l'api
        setIsModalOpen(false);
        setSuccessMessage("La facture a été créée avec succès.")
        setTtnModalOpen(true);

    }

    // Envoyer la facture au TTN 
    function sendToTTN() {
        setLoading(true);
        setTimeout(() => {
            setLoading(false)
            setSuccessMessage("La facture a été envoyée avec succès au TTN.")
            setSent(true)
        }, 10000);
    }



    return {
        previewData,
        form,
        onSubmit,

        removeItem,
        addItem,
        updateItem,


        createInvoice,
        sendToTTN,
        invoiceRef,
        onCloseDocumentModal,
        isModalOpen,
        TtnModalOpen,
        setTtnModalOpen,
        pdfUrl,
        loading,
        sent,
        successMessage,

        //data validation
        canCreateInvoice,
        errors,
        router
    }
}