import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { InvoicesAPI, InvoicesCreditNoteAPI } from "../api/partners-api";
import { handleSaveAsPDF } from "../lib/buildInvoicePDF";
import {
    calculateInvoiceTotals,
    calculUnityPrice,
    recalculate,
} from "../lib/invoiceCalculation";
import { invoiceCreditNoteCreateSchema } from "../models/creditNote";
import { Invoice } from "../models/invoice";
import { BaseItem, CreditNoteItem,  defaultCreditNoteItem } from "../models/invoiceItem";
import { CreditNoteTypeSchema } from "../types/creditNoteType";
import { invoiceComplianceStatusSchema } from "../types/invoiceComplianceStatus";
import { invoiceStatusSchema } from "../types/invoiceStatus";
import { nextNumber } from "../types/nextNumber";

type creditNoteFormValues = z.infer<typeof invoiceCreditNoteCreateSchema>;
export type InvoiceDetailsProps = {
    invoiceId: string
}
export default function useCreateCreditNote({ invoiceId }: InvoiceDetailsProps) {
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [TtnModalOpen, setTtnModalOpen] = useState(false);
    const [loadingInvoice, setLoadingInvoice] = useState(false);
    const [loadingTTN, seloadingTTN] = useState(false);
    const [sent, setSent] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const invoiceRef = useRef<HTMLDivElement>(null);
    const [pdfUrl, setPdfUrl] = useState<File | null>(null);
    const [itemSearchMap, setItemSearchMap] = useState<Record<number, string>>({});
    const [showDropdownMap, setShowDropdownMap] = useState<Record<number, boolean>>({});
    const [creditNoteItemMap, setCreditNoteItemMap] = useState<Record<number, any>>({});
    const [invoice, setInvoice] = useState<Invoice>();
    const [nextNumber, setNextNumber] = useState<nextNumber>()
    const [loadingForm, setLoadingForm] = useState(false);

    const fetchNextNumber = async () => {
        try {

            const response = await InvoicesCreditNoteAPI.getNextInvoiceNumber();
            setNextNumber(response);
        }
        catch (error: any) {
            appToast.error("Erreur de fetch clients: ", getApiErrorMessage(error))
        }
    }
    useEffect(() => {
        fetchNextNumber()
    }, [])

    //Initialisation du formulaire
    const form = useForm<creditNoteFormValues>({
        resolver: zodResolver(invoiceCreditNoteCreateSchema),
        defaultValues: {
            invoiceCreditNoteNumber: uuidv4(),
            issueDate: new Date(),
            creationDate: new Date(),
            sentToclientDate: null,
            sentToTTNDate: null,
            motif: CreditNoteTypeSchema.enum["Quality Issue"],
            creditNoteItems: [defaultCreditNoteItem()],
            QRCode: " ",
            description: "description de facture d'avoir",
            invoiceCreditNoteComplianceStatus: invoiceComplianceStatusSchema.enum.TTN_ACCEPTED,
            invoiceCreditNoteStatus: invoiceStatusSchema.enum.DRAFT,
            invoiceCreditNoteDocument: null,
            totalExclTax: 0,
            totalInclTax: 0,
            vatAmount: 0,
            originalInvoice: invoice
        },
        mode: "onChange",
    });
    const { control, setValue, getValues, reset, handleSubmit, formState: { isDirty, isValid, errors } } = form;
    const { fields, append, remove, } = useFieldArray({
        control,
        name: "creditNoteItems",
        keyName: "fieldId",
    });
    const previewData = useWatch({ control });

    useEffect(() => {
        if (nextNumber?.value) {
            form.setValue("invoiceCreditNoteNumber", nextNumber.value, {
                shouldValidate: true,
                shouldDirty: false,
            });
        }
    }, [nextNumber]);



    useEffect(() => {
        reset({
            invoiceCreditNoteNumber: nextNumber?.value,
            issueDate: new Date(),
            creationDate: new Date(),
            sentToclientDate: null,
            sentToTTNDate: null,
            motif: CreditNoteTypeSchema.enum["Quality Issue"],
            creditNoteItems: [defaultCreditNoteItem()],
            QRCode: " ",
            description: "description de facture d'avoir",
            invoiceCreditNoteComplianceStatus: invoiceComplianceStatusSchema.enum.TTN_ACCEPTED,
            invoiceCreditNoteStatus: invoiceStatusSchema.enum.DRAFT,
            invoiceCreditNoteDocument: null,
            totalExclTax: 0,
            totalInclTax: 0,
            vatAmount: 0,
            originalInvoice: invoice
        });
    }, [invoice, reset]);


    const fetchInvoice = async () => {
        try {
            setLoadingInvoice(true)
            const invoice = await InvoicesAPI.getClientInvoiceById(invoiceId);
            setInvoice(invoice);
        } catch (error) {
            appToast.error("Erreur Fetch du client:", getApiErrorMessage(error));
        }
        finally {
            setLoadingInvoice(false)
        }
    };


    useEffect(() => {
        fetchInvoice();
    }, [invoiceId]);


    // Validation des données 
    const canCreateInvoice =
        isDirty &&
        isValid &&
        !!previewData.motif &&
        !!previewData.creditNoteItems?.length &&
        !!previewData.issueDate &&
        previewData.creditNoteItems.every(
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

        return invoice?.invoiceItems!.filter((item) =>
            !selectedDescriptions.includes(item.description)
        );
    }, [invoice, creditNoteItemMap]);

    // Synchronisation des items avec invoicePreview
    const syncItems = (newItems: BaseItem[]) => {

        const mappedItems: CreditNoteItem[] = newItems.map(item => ({
            ...item,
            idCreditNoteItem: (item as CreditNoteItem).idCreditNoteItem ?? uuidv4(),
            originalItem: (item as CreditNoteItem).originalItem,
        }));
        console.log(mappedItems.at(0)?.originalItem)
        setValue("creditNoteItems", mappedItems, {
            shouldValidate: true,
            shouldDirty: true,
        });

        calculateInvoiceTotals(getValues("creditNoteItems")!);
    };

    // L'ajout d'une carte pour une prestation
    const addItem = () => {
        const newIndex = fields.length;

        append(defaultCreditNoteItem(), { shouldFocus: false });
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
        const currentItems = getValues("creditNoteItems") ?? [];

        const index = currentItems.findIndex((item) => item.idCreditNoteItem === id);
        if (index !== -1) {
            remove(index);
        }

        // Recalculer les totaux sans l'élément supprimé
        const remainingItems = currentItems.filter((item) => item.idCreditNoteItem !== id);
        const totals = calculateInvoiceTotals(remainingItems);

        setValue("totalExclTax", totals.totalHT, { shouldValidate: true, shouldDirty: true });
        setValue("vatAmount", totals.totalTVA, { shouldValidate: true, shouldDirty: true });
        setValue("totalInclTax", totals.totalTTC, { shouldValidate: true, shouldDirty: true });
    };


    // Mis à jour les données d'item (QT, P.U, TVA ) et calcul de nouveau les totaux 
    const updateItem = (id: string, patch: Partial<CreditNoteItem>) => {
        const currentItems = getValues("creditNoteItems") ?? [];

        const updatedItems = currentItems.map((item) => {
            if (item.idCreditNoteItem !== id) return item;

            let updatedItem = {
                ...item,
                ...patch,
            };

            updatedItem = {
                ...calculUnityPrice(
                    updatedItem,
                    getValues("originalInvoice.invoiceCurrency"),
                    getValues("originalInvoice.appliedExchangeRate")
                ),
                idCreditNoteItem: updatedItem.idCreditNoteItem,
                originalItem: updatedItem.originalItem,
            } as CreditNoteItem;
            console.log(updatedItem)
            return recalculate(updatedItem);
        });

        const totals = calculateInvoiceTotals(updatedItems);

        setValue("creditNoteItems", updatedItems as CreditNoteItem[], { shouldValidate: true, shouldDirty: true });
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
            const file = await handleSaveAsPDF(element, getValues("invoiceCreditNoteNumber"));
            if (file) {
                setValue("invoiceCreditNoteDocument", file, { shouldValidate: true, shouldDirty: true });
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
    async function createCreditNoteInvoice() {
        try {
            setLoadingForm(true)

            const values = getValues();
            const documentFile = values.invoiceCreditNoteDocument ?? pdfUrl;

            console.log("values: ", values)
            if (!documentFile) {
                appToast.error("Erreur de création", "Le document PDF est vide.");
                return;
            }

            if (!values.originalInvoice) {
                appToast.error("Erreur de création", "Aucune facture sélectionné.");
                return;
            }
            const formData = new FormData();

            formData.append("invoiceCreditNoteNumber", values.invoiceCreditNoteNumber);
            formData.append("issueDate", values.issueDate.toISOString());
            formData.append("motif", values.motif);
            formData.append("description", values.description!);
            formData.append("originalInvoiceId", values.originalInvoice.idInvoice);


            if (values.creditNoteItems?.length) {
                const simplifiedItems = values.creditNoteItems.map((item) => ({
                    idInvoiceItem: item.originalItem,
                    quantity: item.quantity,
                }));
                formData.append("invoiceCreditNoteItemsList", JSON.stringify(simplifiedItems));
            }

            formData.append("invoiceDocument", documentFile);

            for (const pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const createdInvoice = await InvoicesCreditNoteAPI.createInvoiceCreditNote(formData);

            if (createdInvoice) {
                appToast.success("Facture d'avoir créée avec succès");
                setIsModalOpen(false);
                setSuccessMessage("La facture d'avoir a été créée avec succès.");
                setTtnModalOpen(true);
            }
        } catch (e: unknown) {
            const message = getApiErrorMessage(e);
            appToast.error("Échec de création, veuillez réessayer.", message);
        }
        finally{
            setLoadingForm(false)
        }

    }

    // Envoyer la facture au TTN 
    function sendToTTN() {
        seloadingTTN(true);
        setTimeout(() => {
            seloadingTTN(false)
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

        invoice,
        nextNumber,

        createCreditNoteInvoice,
        sendToTTN,
        invoiceRef,
        onCloseDocumentModal,
        isModalOpen,
        TtnModalOpen,
        setTtnModalOpen,
        pdfUrl,
        loadingForm,
        loadingInvoice,
        loadingTTN,
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