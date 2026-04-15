import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { CreditNoteSchema, } from "../models/creditNote";
import { zodResolver } from "@hookform/resolvers/zod";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import {
    calculateInvoiceTotals,
    calculUnityPrice,
    recalculate,
} from "../lib/invoiceCalculation";
import { InvoiceItem} from "../models/invoiceItem";
import { useEffect, useMemo, useRef, useState } from "react";
import { CreditNoteTypeSchema } from "../types/creditNoteType";
import { useRouter } from "next/navigation";
import defaultItem, { mockInvoiceItems } from "../mocks/invoice-items-mocks";
import { handleSaveAsPDF } from "../lib/buildInvoicePDF";
import { MOCK_INVOICES } from "../mocks/invoice-mocks";
import { invoiceComplianceStatusSchema } from "../types/invoiceComplianceStatus";
import { invoiceStatusSchema } from "../types/invoiceStatus";
import { uuid4 } from "node_modules/zod/v4/core/regexes.cjs";

type creditNoteFormValues = z.infer<typeof CreditNoteSchema>;
export default function useCreateCreditNote() {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [TtnModalOpen, setTtnModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const invoiceRef = useRef<HTMLDivElement>(null);
    const [pdfUrl, setPdfUrl] = useState<File | null>(null);
    const [itemSearchMap, setItemSearchMap] = useState<Record<number, string>>({});
    const [showDropdownMap, setShowDropdownMap] = useState<Record<number, boolean>>({});
    const [creditNoteItemMap, setCreditNoteItemMap] = useState<Record<number, any>>({});
    

    //Initialisation du formulaire
    const form = useForm<creditNoteFormValues>({
        resolver: zodResolver(CreditNoteSchema),
        defaultValues: {
            invoiceNumber: uuidv4(),
            issueDate: new Date(),
            creationDate: new Date(),
            sentToclientDate: null,
            sentToTTNDate: null,
            creditNoteReason: CreditNoteTypeSchema.enum["Quality Issue"],
            invoiceItems: [defaultItem()],
            QRCode: " ",
            invoiceComplianceStatus: invoiceComplianceStatusSchema.enum.TTN_ACCEPTED,
            invoiceStatus: invoiceStatusSchema.enum.DRAFT,
            invoiceDocument: null,
            totalExclTax: 0,
            totalInclTax: 0,
            vatAmount: 0,
            originalInvoice: MOCK_INVOICES[0]
        },
        mode: "onChange",
    });
    const { control, setValue, getValues, handleSubmit, formState: { isDirty, isValid, errors } } = form;
    const { fields, append, remove, } = useFieldArray({
        control,
        name: "invoiceItems",
        keyName: "fieldId",
    });
    const previewData = useWatch({ control });



    // Validation des données 
    const canCreateInvoice =
        isDirty &&
        isValid &&
        !!previewData.creditNoteReason &&
        !!previewData.invoiceItems?.length &&
        !!previewData.issueDate &&
        previewData.invoiceItems.every(
            (item) =>
                item.description?.trim() &&
                item.quantity! > 0 &&
                item.unityPriceEXclTax! >= 0 &&
                item.vatRate! >= 0
        );

    //filtrage des éléments aprés la sélection
    const filteredItems = useMemo(() => {
        const selectedDescriptions = Object.values(creditNoteItemMap)
            .filter(Boolean)
            .map((item) => item!.description);

        return mockInvoiceItems!.filter((item) =>
            !selectedDescriptions.includes(item.description)
        );
    }, [creditNoteItemMap]);

    // Synchronisation des items avec invoicePreview
    const syncItems = (newItems: InvoiceItem[]) => {
        setValue("invoiceItems", newItems, { shouldValidate: true, shouldDirty: true, });
        calculateInvoiceTotals(getValues("invoiceItems")!);
    };

    // L'ajout d'une carte pour une prestation
    const addItem = () => {
        const newIndex = fields.length;

        append(defaultItem(), { shouldFocus: false });
        setItemSearchMap((prev) => ({
            ...prev,
            [newIndex]: "",
        }));

        setShowDropdownMap((prev) => ({
            ...prev,
            [newIndex]: false,
        }));

        setCreditNoteItemMap((prev) => ({
            ...prev,
            [newIndex]: null,
        }));
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
    const updateItem = (id: string, patch: Partial<InvoiceItem>) => {
        const currentItems = getValues("invoiceItems") ?? [];

        const updatedItems = currentItems.map((item) => {
            if (item.idInvoiceItem !== id) return item;

            let updatedItem = {
                ...item,
                ...patch,
            };

            updatedItem = calculUnityPrice(
                updatedItem,
                getValues("originalInvoice.currency"),
                getValues("originalInvoice.appliedExchangeRate")
            );

            console.log(updatedItem)
            return recalculate(updatedItem);
        });

        const totals = calculateInvoiceTotals(updatedItems);

        setValue("invoiceItems", updatedItems, { shouldValidate: true, shouldDirty: true });
        setValue("totalExclTax", totals.totalHT, { shouldValidate: true, shouldDirty: true });
        setValue("vatAmount", totals.totalTVA, { shouldValidate: true, shouldDirty: true });
        setValue("totalInclTax", totals.totalTTC, { shouldValidate: true, shouldDirty: true });

        syncItems(updatedItems);
    };

    //Génération et visualisation du document PDF Facture Avoir 
     /* eslint-disable react-hooks/refs */
    const onSubmit = handleSubmit(
        async () => {
            const element = invoiceRef.current;

            if (!element) return;
            const file = await handleSaveAsPDF(element, getValues("invoiceNumber"));
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
        fields,


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
        router,

        showDropdownMap,
        setShowDropdownMap,
        itemSearchMap,
        setItemSearchMap,
        creditNoteItemMap,
        setCreditNoteItemMap,
        filteredItems,
        syncItems
    }
}