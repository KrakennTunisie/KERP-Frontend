import { useEffect, useRef, useState } from "react";
import { Invoice, InvoiceCreate, invoiceCreateSchema } from "../models/invoice";
import { ExchangeRate } from "../types/exchangeRate";
import { ExchangeRateAPI, InvoicesAPI, partnersApi, PurchaseOrderAPI } from "../api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { useFieldArray, useForm } from "react-hook-form";
import { invoiceStatusSchema } from "../types/invoiceStatus";
import { PaymentConditionSchema } from "../types/paymentCondition";
import { paymentMethodSchema } from "../types/paymentMethod";
import { CurrencyType, currencyTypeSchema } from "../types/currency";
import { v4 as uuidv4 } from "uuid";
import { nextNumber } from "../types/nextNumber";
import { BaseItem, defaultInvoiceItem, InvoiceItem } from "../models/invoiceItem";
import { exchangeRateSourceSchema } from "../types/exchangeRateSource";
import { invoiceComplianceStatusSchema } from "../types/invoiceComplianceStatus";
import { useRouter } from "next/navigation";
import { PurchaseOrderDetails, PurchaseOrderSummary } from "../models/purchaseOrder";
import { PartnerSummary } from "../models/partner";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { calculateInvoiceTotals, calculateInvoiceTotalsFromPurchaseOrder, calculUnityPrice, recalculate } from "../lib/invoiceCalculation";
import { InvoiceData } from "../components/widgets/invoicePreview";
import { useInvoiceStore } from "./useSupplierInvoiceList";
export type InvoiceFormClientProps = {
    mode: "create" | "edit" | "clone";
    invoiceId?: string
}

type UpdateableField =
    | "description"
    | "quantity"
    | "unityPriceEXclTax"
    | "vatRate"
    | "operationCategory"
    | "discountType"
    | "discountValue";

export type InvoiceFormModalProps = {
    open: boolean;
    mode: "create" | "edit";
    loading?: boolean;
    // extractedData?: ExtractedInvoiceData; // données renvoyées par l'OCR/IA
    onClose: () => void;
    onSubmit?: (data: any) => Promise<void>; // remplace "any" par ton InvoiceFormValues
};


export default function useCreateSupplierInvoice() {
    const [nextNumber, setNextNumber] = useState<nextNumber>()
    const [exchangeRate, setExchangeRate] = useState<ExchangeRate>()
    const [invoice, setInvoice] = useState<Invoice>()
    const invoiceSupplier = useInvoiceStore(state => state.fileUrl);
    const invoiceSupplierType = useInvoiceStore(state => state.file);
    const router = useRouter()

    /*** Affichage le nombre suivant du facture => Série des nombre */
    const fetchNextNumber = async () => {
        try {

            const response = await InvoicesAPI.getNextInvoiceNumber();
            setNextNumber(response);
        }
        catch (error: any) {
            appToast.error("Erreur de fetch clients: ", getApiErrorMessage(error))
        }
    }
    useEffect(() => {
        fetchNextNumber()
        fetchPurchaseOrderSummary()
    }, [])

    /***** Initialisation .... */
    const form = useForm<InvoiceCreate>({
        resolver: zodResolver(invoiceCreateSchema),
        defaultValues: {
            invoiceType: "PURCHASE",
            invoiceNumber: nextNumber?.value,
            idInvoice: uuidv4(),
            invoiceStatus: invoiceStatusSchema.enum["DRAFT"],
            issueDate: new Date(),
            creationDate: new Date(),
            sentToclientDate: null,
            sentToTTNDate: null,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
            invoiceItems: [defaultInvoiceItem()],
            totalExclTax: 0,
            totalInclTax: 0,
            vatRate: 0,
            paymentCondition: PaymentConditionSchema.enum.NET_15,
            paymentMethod: paymentMethodSchema.enum.BANK_TRANSFER,
            partner: null,
            purchaseOrder: null,
            invoiceCurrency: currencyTypeSchema.enum.TND,
            appliedExchangeRate: 3,
            exchangeRateReferenceDate: new Date(),
            exchangeRateSource: exchangeRateSourceSchema.enum.EXTERNAL_API,
            complianceQRcode: "",
            invoiceComplianceStatus: invoiceComplianceStatusSchema.enum.RECEIVED,
            invoiceDocument: null,
            vatAmount: 0,
        },
        mode: "onChange",
    });
    const { control, setValue, getValues, handleSubmit, register, reset, formState: { isDirty, isValid, errors } } = form;
    const { append, remove, replace } = useFieldArray({
        control,
        name: "invoiceItems",
    });

    useEffect(() => {
        nextNumber?.value &&
            form.setValue("invoiceNumber", nextNumber.value, {
                shouldValidate: true,
                shouldDirty: false,
            });

    }, [nextNumber]);
    /**** Récupération de l'éxchange rate */
    const fetchExchangeRate = async (toCurrency: string) => {
        try {

            if (!toCurrency || toCurrency === "TND") {
                form.setValue("appliedExchangeRate", 1, {
                    shouldValidate: true,
                    shouldDirty: false,
                });


                const response = await ExchangeRateAPI.getExchangeRate({
                    fromCurrency: "TND",
                    toCurrency: toCurrency,
                });
                console.log("response: exchangeRate", response)
                setExchangeRate(response);
            }
        }
        catch (error: any) {
            appToast.error("Erreur de fetch de taux de change: ", getApiErrorMessage(error))
        }
    }
    const selectedCurrency = form.watch("invoiceCurrency");

    useEffect(() => {

        fetchExchangeRate(selectedCurrency);
    }, [selectedCurrency]);

    useEffect(() => {

        if (selectedCurrency === "TND") {
            form.setValue("appliedExchangeRate", 1, {
                shouldValidate: true,
                shouldDirty: false,
            });
            return;
        }

        if (exchangeRate?.quote) {
            form.setValue("appliedExchangeRate", exchangeRate.quote, {
                shouldValidate: true,
                shouldDirty: false,
            });
        }
    }, [exchangeRate, selectedCurrency]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [TtnModalOpen, setTtnModalOpen] = useState(false);
    const [loadingForm, setLoadingForm] = useState(false);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [loadingPurchaseOrders, setLoadingPurchaseOrders] = useState(false);
    const [loadingTTN, setLoadingTTN] = useState(false);
    const [sent, setSent] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [pdfUrl, setPdfUrl] = useState<File | null>(null);

    const [linkedToPO, setLinkedToPO] = useState(false);
    const [selectedPO, setSelectedPO] = useState<PurchaseOrderDetails | null>(null);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderSummary[] | []>([])

    const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
    const [newSupplierName, setNewSupplierName] = useState("");

    const [showAddPCModal, setShowAddPCModal] = useState(false);
    const [showAddOPCModal, setShowAddOPCModal] = useState(false);
    const [showAddTVAModal, setShowAddTVAModal] = useState(false);
    const [addModalTarget, setAddModalTarget] = useState("");


    // UI state only
    const [supplierSearch, setSupplierSearch] = useState("");
    const [suppliers, setSuppliers] = useState<PartnerSummary[] | []>([])
    const [loadingSuppliers, setLoadingSuppliers] = useState(false)
    const [loadingSave, setLoadingSave] = useState(false)
    const [loadingDraft, setLoadingDraft] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false);
    const previousCurrencyRef = useRef<CurrencyType>("TND");
    const previewData = getValues();

    const getError = (field: keyof InvoiceCreate) => {
              return errors[field]?.message as string | undefined;
          };

    const getItemError = (
          index: number,
          field: keyof InvoiceItem
        ) => {
          return errors.invoiceItems?.[index]?.[field]?.message as
            | string
            | undefined;
        };

    // Validation des données obligatoire
    const canSaveInvoice =
        isDirty &&
        isValid &&
        !!previewData.partner &&
        !!previewData.invoiceItems?.length &&
        !!previewData.dueDate &&
        !!previewData.issueDate &&
        !!previewData.paymentCondition &&
        !!previewData.paymentMethod &&
        previewData.invoiceItems.every(
            (item) =>
                item.description?.trim() &&
                item.operationCategory?.trim() &&
                item.quantity! > 0 &&
                item.unityPriceEXclTax! >= 0 &&
                item.vatRate! >= 0
        );



    //Filtrage de la liste des clients lors de la recherche 
    const debouncedSearchQuery = useDebounce(supplierSearch, 2000);

    const getClients = async () => {
        try {
            setLoadingSuppliers(true);
            const keyword =
                debouncedSearchQuery.trim().length >= 3
                    ? debouncedSearchQuery.trim()
                    : undefined;

            const response = await partnersApi.getSummarySuppliers({
                keyword: keyword,
            });

            setSuppliers(response);
        } catch (error) {
            appToast.error("Erreur de fetch clients: ", getApiErrorMessage(error))
        } finally {
            setLoadingSuppliers(false);
        }
    };

    useEffect(() => {
        getClients();
    }, [debouncedSearchQuery]);

    //Synchronisation des items lors d'un nouveau item
    const syncItems = (newItems: BaseItem[]) => {

        const mappedItems: InvoiceItem[] = newItems.map((item: any) => ({
            ...item,
            idInvoiceItem: (item as InvoiceItem).idInvoiceItem ?? uuidv4(),
            invoice: (item as InvoiceItem).invoice ?? null,
            purchaseOrderItem: null,
            creditedQuantity: 0,

        }));

        replace(mappedItems);
        setValue("invoiceItems", mappedItems, {
            shouldValidate: true,
            shouldDirty: true,
        });


    };

    /***** Synchronisation des items lorsque la facture est réliée à un bon de commande */
    const SyncPurchaseOrderItems = (newItems: BaseItem[], isInitialSync: boolean = false) => {
        const mappedItems: InvoiceItem[] = newItems
            .map((item: any) => {
                const sourcePOItem = item.purchaseOrderItem ?? item;

                const {
                    idInvoiceItem,
                    invoice,
                    purchaseOrderItem,
                    ...cleanPurchaseOrderItem
                } = sourcePOItem;

                const quantity = isInitialSync
                    ? (sourcePOItem.quantity ?? 0) - (sourcePOItem.invoicedQuantity ?? 0)
                    : (item.quantity ?? 0);

                return {
                    idInvoiceItem: item.idInvoiceItem ?? uuidv4(),
                    invoice: item.invoice ?? null,
                    description: item.description,
                    unityPriceEXclTax: item.unityPriceEXclTax,
                    vatRate: item.vatRate,
                    itemTotalExclTax: (quantity * item.unityPriceEXclTax),
                    itemTaxAmount: (quantity * item.unityPriceEXclTax) * (item.vatRate / 100),
                    itemTotalInclTax: (quantity * item.unityPriceEXclTax) * (1 + item.vatRate / 100),
                    operationCategory: item.operationCategory,
                    quantity,
                    discountType: item.discountType,
                    discountValue: item.discountValue,
                    purchaseOrderItem: cleanPurchaseOrderItem,
                    creditedQuantity: 0,
                };
            })
            .filter(item => item.quantity > 0);

        console.log(mappedItems);

        replace(mappedItems);

        setValue("invoiceItems", mappedItems, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    // Ajout d'un card qui permet l'ajout les données d'unt item (P.U ,QT , TVA)
    const addItem = () => {
        append(defaultInvoiceItem(), {
            shouldFocus: false,
        });
    };


    // Suppression d'item et la mis à jour des totaux TTC / HT /TVA  
    const removeItem = (id: string) => {
        const currentItems = getValues("invoiceItems") ?? [];
        console.log(currentItems)
        console.log(id);
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
                    getValues("invoiceCurrency"),
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
        if (linkedToPO && selectedPO || invoice?.purchaseOrder != null) {
            SyncPurchaseOrderItems(updatedItems, false);
        } else {
            syncItems(updatedItems);
        }
    };

    // récupération de la quantité initiale d'un item lors de la modification => pour faire la référence
    const getInitialQuantity = (idInvoiceItem: string) => {
        const originalItem = invoice?.invoiceItems!.find(
            (invoiceItem) => invoiceItem.idInvoiceItem === idInvoiceItem
        );
        return originalItem?.quantity ?? 0;
    };
    const getMaxQuantity = (item: InvoiceItem) => {
        if (item.purchaseOrderItem) {
            const remaining = (item.purchaseOrderItem?.quantity ?? 0) -
                (item.purchaseOrderItem?.invoicedQuantity ?? 0);
            const initialQty = getInitialQuantity(item.idInvoiceItem!);
            console.log(initialQty)
            return remaining + initialQty;
        }
        if (selectedPO && linkedToPO) {
            return (item.purchaseOrderItem!.quantity ?? 0) -
                (item.purchaseOrderItem!.invoicedQuantity ?? 0);
        }

        return undefined;
    };
    // Sélection d'un client
    const selectSupplier = (client: PartnerSummary) => {
        setValue("partner", client, { shouldValidate: true, shouldDirty: true, });
        setSupplierSearch(client.partnerName!);
        setShowDropdown(false);
    };


    // Suppression de client selectionnée 
    const clearSupplier = () => {
        setValue("partner", null, { shouldValidate: true, shouldDirty: true, });
        setSupplierSearch("");
    };

    const fetchPurchaseOrderSummary = async () => {
        try {

            setLoadingPurchaseOrders(true)
            const purchaseorders = await PurchaseOrderAPI.getSupplierPurchaseOrderSummary();
            setPurchaseOrders(purchaseorders);


        } catch (error) {
            appToast.error("Erreur Fetch du fournisseur:", getApiErrorMessage(error));
        }
        finally {
            setLoadingPurchaseOrders(false)
        }
    }
    // récupérer un bon de commande séléctionnée
    const fetchPurchaseOrder = async (idPurchaseOrder: string) => {
        try {
            //   setLoading(true)
            const purchaseOrder = await PurchaseOrderAPI.getSupplierPurchaseOrderById(idPurchaseOrder);
            return purchaseOrder;
        } catch (error) {
            appToast.error("Erreur Fetch du client:", getApiErrorMessage(error));
        }
        finally {
            //   setLoading(false)
        }
    };

    // désélectionnée un bon de commande
    function handleTogglePO(checked: boolean) {
        setLinkedToPO(checked);
        if (!checked) {
            setSelectedPO(null);

            clearSupplier();
            setValue("invoiceItems", [defaultInvoiceItem()], { shouldValidate: true, shouldDirty: true, });
            setValue("issueDate", new Date(), { shouldValidate: true, shouldDirty: true, });
            setValue("invoiceCurrency", currencyTypeSchema.enum.TND, { shouldValidate: true, shouldDirty: true, });
            setValue("paymentCondition", PaymentConditionSchema.enum.NET_15, { shouldValidate: true, shouldDirty: true, });
            setValue("paymentMethod", paymentMethodSchema.enum.BANK_TRANSFER, { shouldValidate: true, shouldDirty: true, });
            setValue("totalExclTax", 0, { shouldValidate: true, shouldDirty: true });
            setValue("vatAmount", 0, { shouldValidate: true, shouldDirty: true });
            setValue("totalInclTax", 0, { shouldValidate: true, shouldDirty: true });
            setValue("purchaseOrder", null);
        }
    }




    // calcule de la date d'échance lors la saisie de condition de paiement 
    const calculateDueDate = (): Date => {
        const date = new Date(getValues("issueDate"));
        console.log(date)
        switch (getValues("paymentCondition")) {
            case PaymentConditionSchema.enum.NET_15: date.setDate(date.getDate() + 15); break;
            case PaymentConditionSchema.enum.NET_30: date.setDate(date.getDate() + 30); break;
            case PaymentConditionSchema.enum.NET_45: date.setDate(date.getDate() + 45); break;
            case "IMMEDIATE": break;
        }
        setValue("dueDate", date, { shouldValidate: true });
        return date;
    };
    // Pré-remplissage à chaque ouverture avec les données extraites
    /* useEffect(() => {
       if (open && extractedData) {
         form.reset({
           invoiceNumber: extractedData.invoiceNumber ?? "",
           issueDate: extractedData.issueDate ?? new Date(),
           invoiceCurrency: extractedData.currency ?? "TND",
           appliedExchangeRate: extractedData.exchangeRate ?? 1,
           paymentCondition: extractedData.paymentTerms ?? "NET_15",
           paymentMethod: extractedData.paymentMethod ?? "TRANSFER",
           invoiceItems: extractedData.items ?? [],
           // ... mappe les autres champs extraits vers ton schema de form
         });
       }
     }, [open, extractedData, form]);*/

    const handleAddOption = async (value: string) => {

        if (addModalTarget === "paymentCondition") {
            // ...
        }
    };

    const handleClose = () => {
        reset();
    };

    const handleSave = form.handleSubmit(async (data) => {
        setLoadingSave(true)
        await createInvoice();
        setLoadingSave(false)
        handleClose();
    });

    /******* Création d'une facture */
    async function createInvoice() {
        try {
            setLoadingForm(true)
            const values = getValues();
            const documentFile = values.invoiceDocument ?? pdfUrl;

            console.log("values: ", values)
            if (!documentFile) {
                appToast.error("Erreur de création", "Le document PDF est vide.");
                return;
            }

            if (!values.partner) {
                appToast.error("Erreur de création", "Aucun client sélectionné.");
                return;
            }
            const formData = new FormData();

            formData.append("invoiceNumber", values.invoiceNumber);

            formData.append("issueDate", values.issueDate.toISOString());
            formData.append("dueDate", values.dueDate.toISOString());
            if (selectedPO) {
                formData.append("purchaseOrder", selectedPO?.idPurchaseOrder)
            }
            formData.append("invoiceType", values.invoiceType);
            formData.append("invoiceCurrency", values.invoiceCurrency);
            formData.append("vatRate", String(values.vatRate));
            formData.append("paymentMethod", values.paymentMethod);
            formData.append("paymentCondition", values.paymentCondition);

            formData.append(
                "exchangeRateReferenceDate", values.exchangeRateReferenceDate.toISOString()
            );
            formData.append(
                "appliedExchangeRate",
                String(values.appliedExchangeRate)
            );
            formData.append("exchangeRateSource", values.exchangeRateSource);

            formData.append("partner", values.partner.idPartner);

            if (values.invoiceItems?.length) {
                const invoiceItemsToSend = values.invoiceItems.map(({ purchaseOrderItem, ...rest }: any) => ({
                    ...rest,
                    idPurchaseOrderItem: purchaseOrderItem?.idPurchaseOrderItem ?? null,
                }));

                formData.append("invoiceItemsList", JSON.stringify(invoiceItemsToSend));
            }

            formData.append("invoiceDocument", documentFile);

            for (const pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const createdInvoice = await InvoicesAPI.createClientInvoice(formData);

            if (createdInvoice) {
                appToast.success("Facture créée avec succès");
                setIsModalOpen(false);
                setSuccessMessage("La facture a été créée avec succès.");
                setTtnModalOpen(true);
            }
        } catch (e: unknown) {
            const message = getApiErrorMessage(e);
            appToast.error("Échec de création, veuillez réessayer.", message);
        }
        finally {
            setLoadingForm(false)
        }
    }


    return {
        form,
        reset,
        register,
        handleClose,
        handleSave,
        loadingSave,
        // Preview
        previewData,

        loadingDraft,

        // Items

        addItem,
        removeItem,
        updateItem,
        getMaxQuantity,

        // Client UI
        supplierSearch,
        setSupplierSearch,
        suppliers,
        showDropdown,
        setShowDropdown,
        selectSupplier,
        clearSupplier,


        setTtnModalOpen,
        TtnModalOpen,
        isModalOpen,
        sent,
        loadingTTN,
        successMessage,
        loadingForm,
        loadingEdit,
        loadingSuppliers,
        loadingPurchaseOrders,

        pdfUrl,
        invoiceSupplier,
        invoiceSupplierType,

        linkedToPO,
        setLinkedToPO,
        selectedPO,
        handleTogglePO,


        purchaseOrders,

        //data validation

        canSaveInvoice,
        errors,
        getItemError,
        getError,

        //dueDate
        calculateDueDate,

        //createInvoice
        createInvoice,

        showAddSupplierModal,
        setShowAddSupplierModal,
        newSupplierName,
        setNewSupplierName,

        showAddPCModal,
        setShowAddPCModal,
        showAddTVAModal,
        setShowAddTVAModal,
        showAddOPCModal,
        setShowAddOPCModal,
        addModalTarget,
        setAddModalTarget,
        handleAddOption,



        //Navigation
        router,

        invoice
    }
}
