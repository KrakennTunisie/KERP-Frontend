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
import { BaseItem, defaultInvoiceItem, defaultPurchaseOrderItem, InvoiceItem, PurchaseOrderItem } from "../models/invoiceItem";
import { exchangeRateSourceSchema } from "../types/exchangeRateSource";
import { invoiceComplianceStatusSchema } from "../types/invoiceComplianceStatus";
import { useRouter } from "next/navigation";
import { basePurchaseOrderSchema, ExtractedPurchaseOrder, PurchaseOrder, PurchaseOrderDetails, PurchaseOrderSummary } from "../models/purchaseOrder";
import { AddPartnerFormData, PartnerSummary } from "../models/partner";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { calculateInvoiceTotals, calculateInvoiceTotalsFromPurchaseOrder, calculUnityPrice, recalculate } from "../lib/invoiceCalculation";
import { discountTypeSchema } from "../types/discountType";

import { normalizeVatRatePercentage } from "../lib/normalizeTVA";

import { resolvePaymentMethod } from "../lib/normalizePaymentMethod";
import { normalizePaymentConditionToDbFormat } from "../lib/normalizePaymentCondition";
import { purchaseOrderTypeSchema } from "../types/PurchaseOrderType";
import { formatOperationCategoryLabel } from "../lib/normalizeOperationCategory";
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


export default function useCreateClientPurchaseOrder() {
    const [nextNumber, setNextNumber] = useState<nextNumber>()
    const [exchangeRate, setExchangeRate] = useState<ExchangeRate>()
    const [invoice, setInvoice] = useState<Invoice>()
    const clientPurchaseOrder = useInvoiceStore(state => state.fileUrl);
    const clientPurchaseOrderType = useInvoiceStore(state => state.file);
    const [extractedData, setExtractedData] = useState<Partial<ExtractedPurchaseOrder> | null>(null);
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
            console.log("debug2")
            const response = await InvoicesAPI.getNextInvoiceNumber();
            setNextNumber(response);
        }
        catch (error: any) {
            appToast.error("Erreur de netxt invoice number: ", getApiErrorMessage(error))
        }
    }
    useEffect(() => {
        fetchNextNumber();
    }, [])

    // récupération des données extraites depuis n8n à partir de local storage
    useEffect(() => {
        const stored = localStorage.getItem('extractedInvoiceData');
        if (stored) {
            setExtractedData(JSON.parse(stored));
        }
    }, []);

    /***** Initialisation .... */
    const form = useForm<PurchaseOrder>({
        resolver: zodResolver(basePurchaseOrderSchema),
        defaultValues: {
            purchaseOrderNumber: nextNumber?.value,
            idPurchaseOrder: uuidv4(),
            purchaseOrderStatus: invoiceStatusSchema.enum["DRAFT"],
            purchaseOrderType: purchaseOrderTypeSchema.enum.SALE,
            issueDate: undefined,
            purchaseOrderItems: [defaultInvoiceItem()],
            totalExclTax: 0,
            totalInclTax: 0,
            paymentCondition: "",
            paymentMethod: paymentMethodSchema.enum.CASH,
            partner: null,
            currency: currencyTypeSchema.enum.TND,
            appliedExchangeRate: 3,
            exchangeRateReferenceDate: new Date(),
            exchangeRateSource: exchangeRateSourceSchema.enum.EXTERNAL_API,
            purchaseOrderDocument: null,
            vatAmount: 0,
        },
        mode: "onChange",
    });
    const { control, setValue, getValues, handleSubmit, register, reset, formState: { isDirty, isValid, errors } } = form;
    const { append, remove, replace } = useFieldArray({
        control,
        name: "purchaseOrderItems",
    });

    useEffect(() => {
        nextNumber?.value &&
            form.setValue("purchaseOrderNumber", nextNumber.value, {
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
                   return;
            }

                const response = await ExchangeRateAPI.getExchangeRate({
                    fromCurrency: "TND",
                    toCurrency: toCurrency,
                });
                console.log("response: exchangeRate", response)
                setExchangeRate(response);
            
        }
        catch (error: any) {
            appToast.error("Erreur de fetch de taux de change: ", getApiErrorMessage(error))
        }
    }
    const selectedCurrency = form.watch("currency");

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
            
            console.log(extractedData.paymentMethod!)
           
            console.log(resolvePaymentMethod(extractedData.paymentMethod!))
       
            
            reset({
                ...getValues(), // garde les valeurs déjà saisies/par défaut
                issueDate: extractedData.issueDate ? new Date(extractedData.issueDate) : undefined,
                purchaseOrderItems: extractedData.purchaseOrderItems
                    ? extractedData.purchaseOrderItems.map((item) => ({
                        idPurchaseOrderItem: crypto.randomUUID(),
                        description: item.description ?? "",
                        quantity: item.quantity ?? 1,
                        unityPriceEXclTax: item.unityPriceExclTax ?? 0,
                        vatRate: normalizeVatRatePercentage(item.vatRate) ?? normalizeVatRatePercentage(extractedData?.vatRate) ?? 0,
                        itemTotalExclTax: item.itemTotalExclTax ?? 0,
                        itemTaxAmount: 0,
                        itemTotalInclTax: item.itemTotalInclTax ?? 0,
                        discountType: discountTypeSchema.enum.AMOUNT,
                        discountValue: item.discountValue ?? 0,
                        operationCategory: formatOperationCategoryLabel(item.operationCategory) ,
                        invoicedQuantity: 0,
                        purchaseOrder:null
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
                currency: extractedData?.purchaseCurrency === "TND"
                    ? currencyTypeSchema.enum.TND
                    : extractedData?.purchaseCurrency === "EUR"
                        ? currencyTypeSchema.enum.EUR
                        : extractedData?.purchaseCurrency === "USD"
                            ? currencyTypeSchema.enum.USD
                            : currencyTypeSchema.enum.TND,

            });
            setNewSupplier(
                {
                    companyName: extractedData.companyName ?? "",
                    email: extractedData.issuerEmail ?? null,
                    professionnalPhoneNumber: Number(extractedData.issuerPhone) ?? null,
                    taxRegistrationNumber: extractedData.issuerTaxId ?? null,
                    currency: extractedData?.purchaseCurrency === "TND"
                        ? currencyTypeSchema.enum.TND
                        : extractedData?.purchaseCurrency === "EUR"
                            ? currencyTypeSchema.enum.EUR
                            : extractedData?.purchaseCurrency === "USD"
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

            const exists = await partnersApi.clientExistsByCompanyName(companyName);
            setSupplierExist(exists);

            if (exists) {

                try {
                    const getExistedSupplier = await partnersApi.getClientByCompanyName(companyName);
                    selectSupplier(getExistedSupplier);
                } catch (error) {
                    console.error("Erreur lors de la récupération du client:", error);
                }
            } else {
                selectSupplier(newSupplier!);
            }
        } catch (error) {
            console.error("Erreur lors de la vérification du client:", error);
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

    const getError = (field: keyof PurchaseOrder) => {
        return errors[field]?.message as string | undefined;
    };

    const getItemError = (index: number, field: keyof PurchaseOrderItem) => {
        return errors.purchaseOrderItems?.[index]?.[field]?.message as
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

            const response = await partnersApi.getSummaryClients({
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

        const mappedItems: PurchaseOrderItem[] = newItems.map((item: any) => ({
            ...item,
            idPurchaseOrderItem: (item as PurchaseOrderItem).idPurchaseOrderItem ?? uuidv4(),
            purchaseOrder: (item as PurchaseOrderItem).purchaseOrder ?? null,
            invoicedQuantity: (item as PurchaseOrderItem).invoicedQuantity ?? 0,
            discountValue: (item as PurchaseOrderItem).discountValue ?? 0,
            discountType: (item as PurchaseOrderItem).discountType ?? null,

        }));

        replace(mappedItems);
        setValue("purchaseOrderItems", mappedItems, {
            shouldValidate: true,
            shouldDirty: true,
        });


    };

    // Ajout d'un card qui permet l'ajout les données d'unt item (P.U ,QT , TVA)
    const addItem = () => {
        append(defaultPurchaseOrderItem(), {
            shouldFocus: false,
        });
    };


    // Suppression d'item et la mis à jour des totaux TTC / HT /TVA  
    const removeItem = (id: string) => {
        const currentItems = getValues("purchaseOrderItems") ?? [];
        console.log(currentItems)
        console.log(id);
        const index = currentItems.findIndex((item) => item.idPurchaseOrderItem === id);
        if (index !== -1) {
            remove(index);
        }

        // Recalculer les totaux sans l'élément supprimé
        const remainingItems = currentItems.filter((item) => item.idPurchaseOrderItem !== id);
        const totals = calculateInvoiceTotals(remainingItems);

        setValue("totalExclTax", totals.totalHT, { shouldValidate: true, shouldDirty: true });
        setValue("vatAmount", totals.totalTVA, { shouldValidate: true, shouldDirty: true });
        setValue("totalInclTax", totals.totalTTC, { shouldValidate: true, shouldDirty: true });
    };


    // Mis à jour les données d'item (QT, P.U, TVA ) et calcul de nouveau les totaux
    const updateItem = (id: string, field: UpdateableField, value: string | number) => {
        const currentItems = getValues("purchaseOrderItems") ?? [];

        const updatedItems = currentItems.map((item) => {
            if (item.idPurchaseOrderItem !== id) return item;
            const updatedItem = { ...item, [field]: value };
            if (field === "unityPriceEXclTax") {
                const itemWithConvertedPrice = calculUnityPrice(
                    updatedItem,
                    getValues("currency"),
                    getValues("appliedExchangeRate")
                );
                return recalculate(itemWithConvertedPrice);
            }
            return recalculate(updatedItem);
        });
        const totals = calculateInvoiceTotals(updatedItems);
        setValue("totalExclTax", totals.totalHT, { shouldValidate: true, shouldDirty: true });
        setValue("vatAmount", totals.totalTVA, { shouldValidate: true, shouldDirty: true });
        setValue("totalInclTax", totals.totalTTC, { shouldValidate: true, shouldDirty: true });
        syncItems(updatedItems);
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

            if (!clientPurchaseOrderType) {
                appToast.error("Erreur de création", "Le document PDF est vide.");
                return;
            }

            if (!values.partner) {
                appToast.error("Erreur de création", "Aucun client sélectionné.");
                return;
            }
            const formData = new FormData();

            formData.append("purchaseOrderNumber", values.purchaseOrderNumber);
            formData.append("issueDate", values.issueDate.toISOString());
            formData.append("purchaseOrderStatus", values.purchaseOrderStatus);
            formData.append("purchaseOrderType", values.purchaseOrderType)
            formData.append("purchaseCurrency", values.currency);
            formData.append("vatRate", String(0));
            formData.append("paymentMethod", values.paymentMethod);
            formData.append("paymentCondition", values.paymentCondition);
            formData.append("exchangeRateReferenceDate", values.exchangeRateReferenceDate.toISOString());
            formData.append("appliedExchangeRate", String(values.appliedExchangeRate));
            formData.append("exchangeRateSource", values.exchangeRateSource);
            formData.append("partner", values.partner.idPartner);
            formData.append("purchaseOrderDocument", clientPurchaseOrderType);
            if (values.purchaseOrderItems?.length) {
                formData.append("purchaseOrderItemsList", JSON.stringify(values.purchaseOrderItems));
            }
            for (const pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const createdPurchaseOrder = await PurchaseOrderAPI.createClientPurchaseOrder(formData);

            if (createdPurchaseOrder) {
                appToast.success("Bon de commande créée avec succès");
                localStorage.removeItem('extractedInvoiceData');
                setIsModalOpen(false);
                setSuccessMessage("Le bon de commande a été créée avec succès.");
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


        clientPurchaseOrder,
        clientPurchaseOrderType,

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
