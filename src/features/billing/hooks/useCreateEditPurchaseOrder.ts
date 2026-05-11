import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import { BaseItem, InvoiceItem, PurchaseOrderItem, } from "../models/invoiceItem";
import {defaultPurchaseOrderItem} from "../models/invoiceItem";
import { Partner, PartnerSummary } from "../models/partner";
import { MOCK_PARTNERS } from "../mocks/clients-mocks";
import {
  calculateInvoiceTotals,
  calculUnityPrice,
  convertItemCurrency,
  recalculate,
} from "../lib/invoiceCalculation";
import { CurrencyType, currencyTypeSchema } from "../types/currency";
import { PaymentConditionSchema } from "../types/paymentCondition";
import { paymentMethodSchema } from "../types/paymentMethod";
import { exchangeRateSourceSchema } from "../types/exchangeRateSource";
import { PurchaseOrder, basePurchaseOrderSchema, PurchaseOrderDetails } from "../models/purchaseOrder";
import { purchaseOrderStatusSchema } from "../types/purchaseOrderStatus";
import { handleSaveAsPDF } from "../lib/buildInvoicePDF";
import { nextNumber } from "../types/nextNumber";
import { ExchangeRateAPI, partnersApi, PurchaseOrderAPI } from "../api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { purchaseOrderTypeSchema } from "../types/PurchaseOrderType";
import { ExchangeRate } from "../types/exchangeRate";

export type PropsPurchaseOrder = {
  params: {
    purchaseOrderId: string
  }
}
export type PurchaseOrderFormClientProps = {
  mode: "create" | "edit"
  purchaseOrderId?: string
}
type UpdateableField =
  | "description"
  | "quantity"
  | "unityPriceEXclTax"
  | "vatRate"
  | "operationCategory";


export function useCreatePurchaseOrder({ mode, purchaseOrderId }: PurchaseOrderFormClientProps) {
  const [nextNumber, setNextNumber] = useState<nextNumber>()
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate>()
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrderDetails>()
      const [loadingEdit, setLoadingEdit] = useState(false);
      const [loadingForm, setLoadingForm] = useState(false);

  const router = useRouter()
  const form = useForm<PurchaseOrder>({
    resolver: zodResolver(basePurchaseOrderSchema),
    defaultValues: {
      purchaseOrderNumber: nextNumber?.value,
      idPurchaseOrder: uuidv4(),
      purchaseOrderStatus: purchaseOrderStatusSchema.enum.DRAFT,
      purchaseOrderType: purchaseOrderTypeSchema.enum.SALE,
      issueDate: new Date(),
      purchaseOrderItems: [defaultPurchaseOrderItem()],
      totalExclTax: 0,
      totalInclTax: 0,
      vatAmount: 0,
      paymentCondition: PaymentConditionSchema.enum.NET_15,
      paymentMethod: paymentMethodSchema.enum.BANK_TRANSFER,
      partner: null,
      currency: currencyTypeSchema.enum.TND,
      appliedExchangeRate: 4,
      exchangeRateReferenceDate: new Date(),
      exchangeRateSource: exchangeRateSourceSchema.enum.EXTERNAL_API,
    },
    mode: "onChange",
  });


  const { control, setValue, getValues, handleSubmit, reset, formState: { isDirty, isValid, errors } } = form;
  const { append, remove, replace } = useFieldArray({
    control,
    name: "purchaseOrderItems",
  });

  const fetchClientPurchaseOrder = async () => {
    try {
      setLoadingEdit(true)
      console.log(purchaseOrderId)
      const po = await PurchaseOrderAPI.getClientPurchaseOrderById(purchaseOrderId);
      setPurchaseOrder(po);
    } catch (error) {
      appToast.error("Erreur Fetch du client:", getApiErrorMessage(error));
    }
    finally {
      setLoadingEdit(false)
    }
  }
  const fetchNextNumber = async () => {
    try {
      if (mode == "create") {

        const response = await PurchaseOrderAPI.getNextPurchaseOrderNumber();
        setNextNumber(response);
      }
      else {
        await fetchClientPurchaseOrder()
      }
    }
    catch (error: any) {
       console.error("Erreur complète:", error); 
      appToast.error("Erreur de fetch des bon de commande: ", getApiErrorMessage(error))
    }
  }
  useEffect(() => {
    fetchNextNumber()
  }, [])

  useEffect(() => {
    if (nextNumber?.value) {
      form.setValue("purchaseOrderNumber", nextNumber.value, {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
  }, [nextNumber]);



  const fetchExchangeRate = async (toCurrency: string) => {
    try {
      if (mode == "create") {

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
    }
    catch (error: any) {
      appToast.error("Erreur de fetch de taux de change: ", getApiErrorMessage(error))
    }
  }

  const selectedCurrency = form.watch("currency");

  useEffect(() => {
    if (mode !== "create") return;
    fetchExchangeRate(selectedCurrency);
  }, [selectedCurrency, mode]);


    useEffect(() => {
      if (mode !== "create") return;
  
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
    }, [exchangeRate, selectedCurrency, mode]);



  useEffect(() => {
    if (mode === "edit" && purchaseOrder) {
      console.log("Status reçu:", purchaseOrder?.purchaseOrderStatus);
      reset({
        idPurchaseOrder: purchaseOrder.idPurchaseOrder,
        purchaseOrderNumber: purchaseOrder.purchaseOrderNumber,
        issueDate: new Date(purchaseOrder.issueDate),
        totalExclTax: purchaseOrder.purchaseCurrency === currencyTypeSchema.enum.EUR
          ? purchaseOrder.totalExclTaxEUR
          : purchaseOrder.totalExclTaxTND,

        totalInclTax: purchaseOrder.purchaseCurrency === currencyTypeSchema.enum.EUR
          ? purchaseOrder.totalInclTaxEUR
          : purchaseOrder.totalInclTaxTND,

        purchaseOrderItems:
          purchaseOrder.purchaseOrderItems && purchaseOrder.purchaseOrderItems.length > 0
            ? purchaseOrder.purchaseOrderItems
            : [defaultPurchaseOrderItem()],
        vatAmount: purchaseOrder.vatRate ?? 0,
        paymentCondition:
          purchaseOrder.paymentCondition ?? PaymentConditionSchema.enum.NET_15,
        paymentMethod:
          purchaseOrder.paymentMethod ?? paymentMethodSchema.enum.BANK_TRANSFER,
        partner: purchaseOrder.partner ?? null,
        currency: purchaseOrder.purchaseCurrency ?? currencyTypeSchema.enum.TND,
        appliedExchangeRate: purchaseOrder.appliedExchangeRate ?? 4,
        exchangeRateReferenceDate: purchaseOrder.exchangeRateReferenceDate
          ? new Date(purchaseOrder.exchangeRateReferenceDate)
          : new Date(),
        exchangeRateSource:
          purchaseOrder.exchangeRateSource ??
          exchangeRateSourceSchema.enum.EXTERNAL_API,
        purchaseOrderDocument: null,
        purchaseOrderStatus: purchaseOrder.purchaseOrderStatus,
        purchaseOrderType : purchaseOrder.purchaseOrderType
      });
      console.log(purchaseOrder)
    }
  }, [mode, purchaseOrder, reset]);

  // UI state only
  const [clientSearch, setClientSearch] = useState("");
  const [clients, setClients] = useState<PartnerSummary[] | []>([])
  const [loadingClients, setLoadingClients] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const purchaseOrderRef = useRef<HTMLDivElement>(null);
  const [pdfUrl, setPdfUrl] = useState<File | null>(null);
  const previousCurrencyRef = useRef<CurrencyType>("TND");
  const previewData = useWatch({ control });

  // Validation des données obligatoire

  const canCreatePurchaseOrder =
    isDirty &&
    isValid &&
    !!previewData.partner &&
    !!previewData.purchaseOrderItems?.length &&
    !!previewData.issueDate &&
    !!previewData.paymentCondition &&
    !!previewData.paymentMethod &&
    previewData.purchaseOrderItems.every(
      (item) =>
        item.description?.trim() &&
        item.operationCategory?.trim() &&
        item.quantity! > 0 &&
        item.unityPriceEXclTax! >= 0 &&
        item.vatRate! >= 0
    );



  //Filtrage de la liste des clients lors de la recherche 
  const debouncedSearchQuery = useDebounce(clientSearch, 2000);

  const getClients = async () => {
    try {
      setLoadingClients(true);
      const keyword =
        debouncedSearchQuery.trim().length >= 3
          ? debouncedSearchQuery.trim()
          : undefined;

      const response = await partnersApi.getSummaryClients({
        keyword: keyword,
      });

      setClients(response);
    } catch (error) {
      appToast.error("Erreur de fetch clients: ", getApiErrorMessage(error))
    } finally {
      setLoadingClients(false);
    }
  };

  useEffect(() => {

    getClients();
  }, [debouncedSearchQuery]);

  //Synchronisation des items lors d'un nouveau item
  const syncItems = (newItems: BaseItem[]) => {
    const mappedItems: PurchaseOrderItem[] = newItems.map(item => ({
        ...item,
        idPurchaseOrderItem: (item as PurchaseOrderItem).idPurchaseOrderItem ?? uuidv4(),
        purchaseOrder: (item as PurchaseOrderItem).purchaseOrder ?? null,
        invoicedQuantity: (item as PurchaseOrderItem).invoicedQuantity ?? 0,
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

  // Sélection d'un client
  const selectClient = (client: PartnerSummary) => {
    setValue("partner", client, { shouldValidate: true, shouldDirty: true, });
    setClientSearch(client.name);
    setShowDropdown(false);
  };


  // Suppression de client selectionnée
  const clearClient = () => {
    setValue("partner", null, { shouldValidate: true, shouldDirty: true, });
    setClientSearch("");
  };


  // changement de la devise EUR -> TND et vice versa
  const setCurrency = (newCurrency: CurrencyType) => {
    const oldCurrency = previousCurrencyRef.current;
    const currentItems = getValues("purchaseOrderItems") ?? [];
    const convertedItems = currentItems.map((item) => convertItemCurrency(item, oldCurrency, newCurrency, getValues("appliedExchangeRate")));

    previousCurrencyRef.current = newCurrency;
    setValue("currency", newCurrency, { shouldValidate: true, shouldDirty: true, });
    const totals = calculateInvoiceTotals(convertedItems);
    setValue("totalExclTax", totals.totalHT, { shouldValidate: true, shouldDirty: true });
    setValue("vatAmount", totals.totalTVA, { shouldValidate: true, shouldDirty: true });
    setValue("totalInclTax", totals.totalTTC, { shouldValidate: true, shouldDirty: true });
    syncItems(convertedItems);
  };


  // Permet la visualisation  de la facture en PDF une fois remplie
  /* eslint-disable react-hooks/refs */
  const onSubmit = handleSubmit(
    async () => {
      const element = purchaseOrderRef.current;

      if (!element) return;
      const file = await handleSaveAsPDF(element, getValues("purchaseOrderNumber"));
      if (file) {
        setValue("purchaseOrderDocument", file, { shouldValidate: true, shouldDirty: true });
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

  //Création de bon commande
  async function createPurchaseOrder() {
  
    try {
  
      setLoadingForm(true)

      const values = getValues();
      const documentFile = values.purchaseOrderDocument ?? pdfUrl;

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

      formData.append("purchaseOrderNumber", values.purchaseOrderNumber);
      formData.append("issueDate", values.issueDate.toISOString());
      formData.append("purchaseOrderStatus", values.purchaseOrderStatus);
      formData.append("purchaseOrderType", values.purchaseOrderType)
      formData.append("purchaseCurrency", values.currency);
      formData.append("vatRate", String(0));
      formData.append("paymentMethod", values.paymentMethod);
      formData.append("paymentCondition", values.paymentCondition);
      formData.append(
        "exchangeRateReferenceDate", values.exchangeRateReferenceDate.toISOString());
      formData.append("appliedExchangeRate", String(values.appliedExchangeRate));
      formData.append("exchangeRateSource", values.exchangeRateSource);

      formData.append("partner", values.partner.idPartner);

      if (values.purchaseOrderItems?.length) {
        formData.append("purchaseOrderItemsList", JSON.stringify(values.purchaseOrderItems));
      }

      formData.append("purchaseOrderDocument", documentFile);

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const createdInvoice = await PurchaseOrderAPI.createClientPurchaseOrder(formData);

      if (createdInvoice) {
        appToast.success("Bon de commande créée avec succès");
        setIsModalOpen(false);

      }
    } catch (e: unknown) {
      const message = getApiErrorMessage(e);
      appToast.error("Échec de création, veuillez réessayer.", message);
    }
    finally{
            setLoadingForm(false)
    }
  }
  const updatePurchaseOrder = async () => {
  

      try {

        setLoadingForm(true)

        const values = getValues();
        const documentFile = values.purchaseOrderDocument ?? pdfUrl;
    
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
  
        formData.append("idPurchaseOrder", values.idPurchaseOrder);
  
        formData.append("purchaseOrderNumber", values.purchaseOrderNumber);
        formData.append("issueDate", values.issueDate.toISOString());
  
        formData.append("purchaseOrderStatus", purchaseOrderStatusSchema.enum.IN_DELIVERY)
        formData.append("purchaseOrderType", values.purchaseOrderType)
        formData.append("purchaseCurrency", values.currency);
        formData.append("vatRate", String(0));
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
  
  
        if (values.purchaseOrderItems?.length) {
  
          formData.append("purchaseOrderItemsList", JSON.stringify(values.purchaseOrderItems));
        }
  
        formData.append("purchaseOrderDocument", documentFile);
  
        for (const pair of formData.entries()) {
          console.log(pair[0], pair[1]);
        }
        const createdInvoice = await PurchaseOrderAPI.updateClientPurchaseOrder(values.idPurchaseOrder, formData);
  
        if (createdInvoice) {
          appToast.success("Facture mise à jour avec succès");
          setIsModalOpen(false);
        }
      } catch (e: unknown) {
        const message = getApiErrorMessage(e);
        appToast.error("Échec de création, veuillez réessayer.", message);
      }
      finally{
        setLoadingForm(false)
      }
  
    }




  return {
    form,
    onSubmit,

    // Preview
    previewData,

    // Items

    addItem,
    removeItem,
    updateItem,

    // Client UI
    clientSearch,
    setClientSearch,
    clients,
    showDropdown,
    setShowDropdown,
    selectClient,
    clearClient,
    setCurrency,

    //data validation

    canCreatePurchaseOrder,
    errors,

    //Document
    purchaseOrderRef,
    setIsModalOpen,
    isModalOpen,
    createPurchaseOrder,
    onCloseDocumentModal,
    pdfUrl,

    exchangeRate,

    // update

    updatePurchaseOrder,

    //Navigation
    router,

    loadingEdit,
    loadingForm,
    loadingClients

  };


}


