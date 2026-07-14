import { useCallback, useEffect, useRef, useState } from "react";
import { ExtractedInvoice, Invoice, InvoiceCreate, invoiceCreateSchema } from "../models/invoice";
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
import { AddPartnerFormData, PartnerSummary } from "../models/partner";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { calculateInvoiceTotals, calculateInvoiceTotalsFromPurchaseOrder, calculUnityPrice, recalculate } from "../lib/invoiceCalculation";
import { InvoiceData } from "../components/widgets/invoicePreview";
import { useInvoiceStore } from "./useSupplierInvoiceList";
import { OperationCategory } from "../types/operationCategory";
import { discountTypeOptions, discountTypeSchema } from "../types/discountType";
import { partnerTypeSchema } from "../types/partnerType";
import UseCreatePartner from "./useCreatePartner";
import { tvaRateSchema, tvaRateStringSchema } from "../types/tvaRate";
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
    const [extractedData, setExtractedData] = useState<Partial<ExtractedInvoice> | null>(null);
    const [newSupplier, setNewSupplier] = useState<PartnerSummary>();
    const [newSupplierName, setNewSupplierName] = useState<string>("");
    const [supplierSummary, setSupplierSummary] = useState<PartnerSummary>();
    const [supplierExist, setSupplierExist] = useState<boolean>(false)
    const router = useRouter()
    const { onSubmit } = UseCreatePartner({ mode: "create", type: "SUPPLIER" });
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

    useEffect(() => {
        const stored = localStorage.getItem('extractedInvoiceData');
        if (stored) {
            setExtractedData(JSON.parse(stored));
            localStorage.removeItem('extractedInvoiceData');
        }
    }, []);

    /***** Initialisation .... */
    const form = useForm<InvoiceCreate>({
        resolver: zodResolver(invoiceCreateSchema),
        defaultValues: {
            invoiceType: "PURCHASE",
            invoiceNumber: nextNumber?.value,
            idInvoice: uuidv4(),
            invoiceStatus: invoiceStatusSchema.enum["DRAFT"],
            issueDate: undefined,
            creationDate: new Date(),
            sentToclientDate: null,
            sentToTTNDate: null,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
            invoiceItems: [defaultInvoiceItem()],
            totalExclTax: 0,
            totalInclTax: 0,
            vatRate: 0,
            paymentCondition: PaymentConditionSchema.enum.IMMEDIATE,
            paymentMethod: paymentMethodSchema.enum.CASH,
            partner: null,
            purchaseOrder: null,
            invoiceCurrency: currencyTypeSchema.enum.TND,
            appliedExchangeRate: 3,
            exchangeRateReferenceDate: new Date(),
            exchangeRateSource: exchangeRateSourceSchema.enum.EXTERNAL_API,
            complianceQRcode: "",
            invoiceComplianceStatus: invoiceComplianceStatusSchema.enum.RECEIVED,
            invoiceDocument: null,
            comment: "",
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

    useEffect(() => {
        console.log(extractedData?.invoiceItems![0].unityPriceExclTax)
        if (extractedData) {
            reset({
                ...getValues(), // garde les valeurs déjà saisies/par défaut
                issueDate: extractedData.issueDate ? new Date(extractedData.issueDate) : undefined,
                dueDate: extractedData.dueDate ? new Date(extractedData.dueDate) : undefined,
                invoiceItems: extractedData.invoiceItems
                    ? extractedData.invoiceItems.map((item) => ({
                        idInvoiceItem: crypto.randomUUID(),
                        invoice: "",
                        description: item.description ?? "",
                        quantity: item.quantity ?? 1,
                        unityPriceEXclTax: item.unityPriceExclTax ?? 0,
                        vatRate: item.vatRate ?? extractedData.vatRate ?? 0,
                        itemTotalExclTax: item.itemTotalExclTax ?? 0,
                        itemTaxAmount: 0,
                        itemTotalInclTax: item.itemTotalInclTax ?? 0,
                        discountType: discountTypeSchema.enum.AMOUNT,
                        discountValue: item.discountValue ?? 0,
                        operationCategory:  "OTHER" as OperationCategory,
                        purchaseOrderItem: null,
                        creditedQuantity: 0,
                    }))
                    : [defaultInvoiceItem()],
                totalExclTax: extractedData.totalExclTax ?? 0,
                totalInclTax: extractedData.totalInclTax ?? 0,
                partner: {
                    companyName: extractedData.companyName ?? undefined,
                    email: extractedData.issuerEmail ?? undefined,
                    professionnalPhoneNumber: extractedData.issuerPhone ?? undefined,
                    taxRegistrationNumber: extractedData.issuerTaxId ?? undefined,
                    billingAddress: {
                        street1: extractedData.companyAddress ?? undefined,
                    },
                },
                invoiceCurrency: extractedData?.invoiceCurrency === "TND"
                    ? currencyTypeSchema.enum.TND
                    : extractedData?.invoiceCurrency === "EUR"
                        ? currencyTypeSchema.enum.EUR
                        : extractedData?.invoiceCurrency === "USD"
                            ? currencyTypeSchema.enum.USD
                            : currencyTypeSchema.enum.TND,
                comment: extractedData.comments ?? "",
            });
            setNewSupplier(
                {
                    companyName: extractedData.companyName ?? "",
                    email: extractedData.issuerEmail ?? null,
                    professionnalPhoneNumber: Number(extractedData.issuerPhone) ?? null,
                    taxRegistrationNumber: extractedData.issuerTaxId ?? null,
                    currency: extractedData?.invoiceCurrency === "TND"
                        ? currencyTypeSchema.enum.TND
                        : extractedData?.invoiceCurrency === "EUR"
                            ? currencyTypeSchema.enum.EUR
                            : extractedData?.invoiceCurrency === "USD"
                                ? currencyTypeSchema.enum.USD
                                : currencyTypeSchema.enum.TND,
                    taxRate: "",
                    billingAddress: {
                        street1: extractedData.companyAddress ?? null,
                        street2: null,
                        city: null,
                        state: null,
                        zipCode: null,
                        addressType: "Billing Address"
                    },
                    maritalStatus: "",
                    partnerName: "",
                    partnerType: "SUPPLIER",
                    idPartner: crypto.randomUUID(),
                }
            )
        }
    }, [extractedData]);

    const checkSupplierExists = useCallback(async () => {
        if (!newSupplier?.companyName) return;
        try {
            console.log("debug1")
            const exists = await partnersApi.existsByCompanyName(newSupplier.companyName);
            setSupplierExist(exists);

            if (exists) {
                console.log("exisiting supplier");
                try {
                    const getExistedSupplier = await partnersApi.getSupplierByCompanyName(newSupplier.companyName);
                    selectSupplier(getExistedSupplier);
                } catch (error) {
                    console.error("Erreur lors de la récupération du fournisseur:", error);
                }
            } else {
                selectSupplier(newSupplier);
            }
        } catch (error) {
            console.error("Erreur lors de la vérification du fournisseur:", error);
        }
    }, [newSupplier]);

    const handleSupplierAdded = async () => {
        try {
            console.log("debug1")
            await getClients();
            await checkSupplierExists();

        } catch (error) {
            console.error("Erreur lors du rafraîchissement après ajout:", error);
        }
    };
    useEffect(() => {
        checkSupplierExists();
        getClients();
    }, [newSupplier]);



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


    const [showAddPCModal, setShowAddPCModal] = useState(false);
    const [showAddOPCModal, setShowAddOPCModal] = useState(false);
    const [showAddTVAModal, setShowAddTVAModal] = useState(false);


    // UI state only
    const [supplierSearch, setSupplierSearch] = useState("");
    const [suppliers, setSuppliers] = useState<PartnerSummary[] | []>([])
    const [loadingSuppliers, setLoadingSuppliers] = useState(false)
    const [loadingSave, setLoadingSave] = useState(false)
    const [loadingDraft, setLoadingDraft] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false);
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
    }



    //Filtrage de la liste des clients lors de la recherche 
    const debouncedSearchQuery = useDebounce(supplierSearch, 2000);

    const getClients = async () => {
        try {
            console.log("debug")
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
        syncItems(updatedItems);

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
    // Sélection d'un fournisseur
    const selectSupplier = (client: PartnerSummary) => {
        setValue("partner", client, { shouldValidate: true, shouldDirty: true, });
        setSupplierSearch(client.companyName!);
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


    const handleAddOption = async (value: string) => {

    };

    const handleClose = () => {
        reset();
    };

    const handleSave = form.handleSubmit(async (data) => {
        console.log("hi")
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
        supplierExist,
        showDropdown,
        setShowDropdown,
        selectSupplier,
        clearSupplier,
        supplierSummary,
        newSupplier,
        handleSupplierAdded,


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


        purchaseOrders,

        //data validation

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

        handleAddOption,



        //Navigation
        router,

        invoice
    }
}
