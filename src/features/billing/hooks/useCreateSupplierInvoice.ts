import { useCallback, useEffect, useRef, useState } from "react";
import { ExtractedInvoice, Invoice, InvoiceCreate, invoiceCreateSchema } from "../models/invoice";
import { ExchangeRate } from "../types/exchangeRate";
import { ExchangeRateAPI, InvoicesAPI, partnersApi, PurchaseOrderAPI, TvaRateAPI } from "../api/partners-api";
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

import { discountTypeOptions, discountTypeSchema } from "../types/discountType";

import { normalizeVatRatePercentage } from "../lib/normalizeTVA";
import { formatOperationCategoryLabel } from "../lib/normalizeOperationCategory";
import { normalizePaymentConditionToDbFormat } from "../lib/normalizePaymentCondition";
import { resolvePaymentMethod } from "../lib/normalizePaymentMethod";
import { useInvoiceStore } from "../lib/globalStateFile";
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
    const [TVAExist, setTVAExist] = useState<boolean>(false)
    const [supplierExist, setSupplierExist] = useState<boolean>(false)
    const [newTvaExist, setNewTvaExist] = useState<string>("");
    const router = useRouter()


    /*** Affichage le nombre suivant du facture => Série des nombre */
    const fetchNextNumber = async () => {
        try {
           
            const response = await InvoicesAPI.getNextInvoiceNumber();
            setNextNumber(response);
        }
        catch (error: any) {
            appToast.error("Erreur de netxt invoice number: ", getApiErrorMessage(error))
        }
    }
    useEffect(() => {
        fetchNextNumber()
        fetchPurchaseOrderSummary()

    }, [])

    // récupération des données extraites depuis n8n à partir de local storage
    useEffect(() => {
        const stored = localStorage.getItem('extractedInvoiceData');
        if (stored) {
            setExtractedData(JSON.parse(stored));
           
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

    // affectation des données extraites depuis n8n  dans le formulaire 
    useEffect(() => {
        if (extractedData) {
            console.log(normalizeVatRatePercentage(extractedData?.vatRate))
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
                        vatRate: normalizeVatRatePercentage(item.vatRate) ?? normalizeVatRatePercentage(extractedData?.vatRate) ?? 0,
                        itemTotalExclTax: item.itemTotalExclTax ?? 0,
                        itemTaxAmount: 0,
                        itemTotalInclTax: item.itemTotalInclTax ?? 0,
                        discountType: discountTypeSchema.enum.AMOUNT,
                        discountValue: item.discountValue ?? 0,
                        operationCategory: formatOperationCategoryLabel(item.operationCategory),
                        purchaseOrderItem: null,
                        creditedQuantity: 0,
                    }))
                    : [defaultInvoiceItem()],
                paymentCondition: normalizePaymentConditionToDbFormat(extractedData.paymentCondition),
                paymentMethod: resolvePaymentMethod(extractedData.paymentMethod!) ?? undefined,
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

    // vérifier l'existence de la tva extraite depuis la facture 
    const checkTVAExisiting = async () => {
        const vatRatePercentage = normalizeVatRatePercentage(extractedData?.vatRate);
        if (vatRatePercentage == null) {
            return;
        }
        try {
            const tvaRateExisting = await TvaRateAPI.existTvaRateByLabel(`${vatRatePercentage}%`);
            setTVAExist(tvaRateExisting);
            if (!tvaRateExisting) {
                setNewTvaExist(vatRatePercentage.toString())
            }

        } catch (error: any) {
            if (error?.response?.status === 404) {
            } else {
                appToast.error("Erreur lors de la vérification du taux de TVA");
            }
        }
    };

    // vérifier l'existence de fournisseur
    const checkSupplierExists = useCallback(async (companyName: string) => {
        if (!companyName) return;
        try {
            const exists = await partnersApi.existsByCompanyName(companyName);
            setSupplierExist(exists);

            if (exists) {
                try {
                    const getExistedSupplier = await partnersApi.getSupplierByCompanyName(companyName);
                    selectSupplier(getExistedSupplier);
                } catch (error) {
                    console.error("Erreur lors de la récupération du fournisseur:", error);
                }
            } else {
                selectSupplier(newSupplier!);
            }
        } catch (error) {
            console.error("Erreur lors de la vérification du fournisseur:", error);
        }
    }, [newSupplier]);

    // rafraîchissement des données aprés l'ajout de nouveau fournisseur
    const handleSupplierAdded = async () => {
        try {
            await getClients();
            await checkSupplierExists(newSupplier!.companyName);
            setNewSupplier({
                companyName: "",
                email: null,
                professionnalPhoneNumber: null,
                taxRegistrationNumber: null,
                currency: currencyTypeSchema.enum.TND,
                taxRate: "",
                billingAddress: {
                    street1: null,
                    street2: null,
                    city: null,
                    state: null,
                    zipCode: null,
                    addressType: "Billing Address",
                },
                maritalStatus: "",
                partnerName: "",
                partnerType: "SUPPLIER",
                idPartner: crypto.randomUUID(),
            });

        } catch (error) {
            console.error("Erreur lors du rafraîchissement après ajout:", error);
        }
    };

    useEffect(() => {
        if (!newSupplier) return;
        checkTVAExisiting();
        checkSupplierExists(newSupplier.companyName);
        getClients();
    }, [newSupplier]);


    /******* UI state only ****/
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [TtnModalOpen, setTtnModalOpen] = useState(false);
    const [loadingForm, setLoadingForm] = useState(false);
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [loadingPurchaseOrders, setLoadingPurchaseOrders] = useState(false);
    const [loadingTTN, setLoadingTTN] = useState(false);
    const [sent, setSent] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");


    const [linkedToPO, setLinkedToPO] = useState(false);
    const [selectedPO, setSelectedPO] = useState<PurchaseOrderDetails | null>(null);
    const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderSummary[] | []>([])

    const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);


    const [showAddPCModal, setShowAddPCModal] = useState(false);
    const [showAddOPCModal, setShowAddOPCModal] = useState(false);
    const [showAddTVAModal, setShowAddTVAModal] = useState(false);



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

    const getItemError = (index: number, field: keyof InvoiceItem) => {
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
    const updateItem = (id: string, field: UpdateableField, value: string | number | null) => {
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

    // récupération de la liste des bon de commande
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

    // vérification des données et lancement de création de facture fournisseur
    const handleSave = form.handleSubmit(async (data) => {
        setLoadingSave(true);
        try {
            if (TVAExist && supplierExist) {
                await createInvoice();
                reset();
                router.back()
            } else {
                appToast.info("Donnée manquant", "Veuillez ajoutez les données manquantes");
            }
        } finally {
            setLoadingSave(false);
        }
    },
        (errors) => {
            console.log("Validation errors:", errors);
        }
    );

    /******* Création d'une facture */
    async function createInvoice() {
        try {
            setLoadingForm(true)
            const values = getValues();

            if (!invoiceSupplierType) {
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
            formData.append("exchangeRateReferenceDate", values.exchangeRateReferenceDate.toISOString());
            formData.append("appliedExchangeRate", String(values.appliedExchangeRate));
            formData.append("exchangeRateSource", values.exchangeRateSource);
            formData.append("partner", values.partner.idPartner);
            formData.append("invoiceDocument", invoiceSupplierType);
            if (values.invoiceItems?.length) {
                const invoiceItemsToSend = values.invoiceItems.map(({ purchaseOrderItem, ...rest }: any) => ({
                    ...rest,
                    idPurchaseOrderItem: purchaseOrderItem?.idPurchaseOrderItem ?? null,
                }));

                formData.append("invoiceItemsList", JSON.stringify(invoiceItemsToSend));
            }
            for (const pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const createdInvoice = await InvoicesAPI.createSupplierInvoice(formData);

            if (createdInvoice) {
                appToast.success("Facture créée avec succès");
                localStorage.removeItem('extractedInvoiceData');
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


        TVAExist,
        setTVAExist,
        newTvaExist,
        setNewTvaExist,

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



        //Navigation
        router,

        invoice
    }
}
