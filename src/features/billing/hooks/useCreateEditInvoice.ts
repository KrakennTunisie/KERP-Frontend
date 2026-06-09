import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { appToast } from "@/shared/lib/toast";
import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { ExchangeRateAPI, InvoicesAPI, partnersApi, PurchaseOrderAPI } from "../api/partners-api";
import { handleSaveAsPDF } from "../lib/buildInvoicePDF";
import { Invoice, InvoiceCreate, invoiceCreateSchema } from "../models/invoice";
import { BaseItem, InvoiceItem, PurchaseOrderItem } from "../models/invoiceItem";
import { PartnerSummary } from "../models/partner";
import {
  calculateInvoiceTotals,
  calculateInvoiceTotalsFromPurchaseOrder,
  calculUnityPrice,
  recalculate,
} from "../lib/invoiceCalculation";
import defaultItem from "../mocks/invoice-items-mocks";
import { CurrencyType, currencyTypeSchema } from "../types/currency";
import { PurchaseOrderDetails, PurchaseOrderSummary } from "../models/purchaseOrder";
import { ExchangeRate } from "../types/exchangeRate";
import { exchangeRateSourceSchema } from "../types/exchangeRateSource";
import { invoiceComplianceStatusSchema } from "../types/invoiceComplianceStatus";
import { invoiceStatusSchema } from "../types/invoiceStatus";
import { nextNumber } from "../types/nextNumber";
import { PaymentConditionSchema } from "../types/paymentCondition";
import { paymentMethodSchema } from "../types/paymentMethod";
import { generatePdfFile } from "@/shared/pdf/pdfGenerator";
import { invoiceToPdfData } from "@/shared/pdf/documentAdapter";

export type InvoiceFormClientProps = {
  mode: "create" | "edit"
  invoiceId?: string
}

type UpdateableField =
  | "description"
  | "quantity"
  | "unityPriceEXclTax"
  | "vatRate"
  | "operationCategory";


export function useCreateInvoice({ mode, invoiceId }: InvoiceFormClientProps) {
  const [nextNumber, setNextNumber] = useState<nextNumber>()
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate>()
  const [invoice, setInvoice] = useState<Invoice>()

  /** Appel de la fonction qui permet la récupération des données lorsque la facture est en mode = edit */
  const fetchClientInvoice = async () => {
    try {
      if (mode == "edit") {
        setLoadingEdit(true)
        const invoice = await InvoicesAPI.getClientInvoiceById(invoiceId);
        setInvoice(invoice);
      }
    } catch (error) {
      appToast.error("Erreur Fetch du client:", getApiErrorMessage(error));
    }
    finally {
      setLoadingEdit(false)
    }
  }

  /*** Affichage le nombre suivant du facture => Série des nombre */
  const fetchNextNumber = async () => {
    try {
      if (mode == "create") {

        const response = await InvoicesAPI.getNextInvoiceNumber();
        setNextNumber(response);
      }
      else {
        await fetchClientInvoice()
      }
    }
    catch (error: any) {
      appToast.error("Erreur de fetch clients: ", getApiErrorMessage(error))
    }
  }

  useEffect(() => {
    fetchNextNumber()
    fetchPurchaseOrderSummary()
  }, [])

  const router = useRouter()
  /***** Initialisation .... */
  const form = useForm<InvoiceCreate>({
    resolver: zodResolver(invoiceCreateSchema),
    defaultValues: {
      invoiceType: "SALE",
      invoiceNumber: nextNumber?.value,
      idInvoice: uuidv4(),
      invoiceStatus: invoiceStatusSchema.enum["DRAFT"],
      issueDate: new Date(),
      creationDate: new Date(),
      sentToclientDate: null,
      sentToTTNDate: null,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 15)),
      invoiceItems: [defaultItem()],
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

  const { control, setValue, getValues, handleSubmit, reset, formState: { isDirty, isValid, errors } } = form;
  const { append, remove, replace } = useFieldArray({
    control,
    name: "invoiceItems",
  });
  /*** Récupération des données de la facture lorsque le mode est edit */
  useEffect(() => {
    if (mode === "edit" && invoice) {
      console.log(invoice.issueDate)
      reset({
        idInvoice: invoice.idInvoice,
        invoiceType: invoice.invoiceType,
        invoiceNumber: invoice.invoiceNumber,
        issueDate: new Date(invoice.issueDate),
        dueDate: new Date(invoice.dueDate),
        creationDate: new Date(),
        sentToclientDate: null,
        sentToTTNDate: null,
        totalExclTax: invoice.invoiceCurrency == "EUR"
          ? invoice.totalExclTaxEUR
          : invoice.invoiceCurrency == "TND"
            ? invoice.totalExclTaxTND
            : invoice.totalExclTax,
        totalInclTax: invoice.invoiceCurrency == "EUR"
          ? invoice.totalInclTaxEUR
          : invoice.invoiceCurrency == "TND"
            ? invoice.totalInclTaxTND
            : invoice.totalInclTax,
        invoiceItems: invoice.purchaseOrder
          ? invoice.invoiceItems!.map((item: any) => ({
            idInvoiceItem: item.idInvoiceItem,
            purchaseOrderItem : item.purchaseOrderItem,
            invoice: item.invoice ?? null,
            description: item.description,
            unityPriceEXclTax: item.unityPriceEXclTax,
            vatRate: item.vatRate,
            itemTotalExclTax: item.itemTotalExclTax,
            itemTaxAmount: item.itemTaxAmount,
            itemTotalInclTax: item.itemTotalInclTax,
            operationCategory: item.operationCategory,
            quantity: item.quantity,
            creditedQuantity: 0
          }))
          : invoice.invoiceItems,
        vatRate: invoice.vatRate ?? 0,
        paymentCondition:
          invoice.paymentCondition ?? PaymentConditionSchema.enum.NET_15,
        paymentMethod:
          invoice.paymentMethod ?? paymentMethodSchema.enum.BANK_TRANSFER,
        partner: invoice.partner ?? null,
        purchaseOrder: invoice.purchaseOrder ? {
          idPurchaseOrder: invoice.purchaseOrder?.idPurchaseOrder,
          purchaseOrderNumber: invoice.purchaseOrder?.purchaseOrderNumber,
          issueDate: new Date(invoice.purchaseOrder!.issueDate),
          purchaseOrderStatus: invoice.purchaseOrder?.purchaseOrderStatus,
          currency: invoice.invoiceCurrency,
        } : null,
        invoiceCurrency: invoice.invoiceCurrency ?? currencyTypeSchema.enum.TND,
        appliedExchangeRate: invoice.appliedExchangeRate ?? 4,
        exchangeRateReferenceDate: invoice.exchangeRateReferenceDate
          ? new Date(invoice.exchangeRateReferenceDate)
          : new Date(),
        exchangeRateSource:
          invoice.exchangeRateSource ??
          exchangeRateSourceSchema.enum.EXTERNAL_API,
        vatAmount: 0,
        invoiceDocument: null,
        complianceQRcode: "",
        invoiceComplianceStatus: invoice.invoiceComplianceStatus,
        invoiceStatus: invoice.invoiceStatus,
      });
    }
  }, [mode, invoice, reset]);

  useEffect(() => {
    if (nextNumber?.value) {
      form.setValue("invoiceNumber", nextNumber.value, {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
    if (mode == "edit") {
    }
  }, [nextNumber]);

  /**** Récupération de l'éxchange rate */
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

  const selectedCurrency = form.watch("invoiceCurrency");

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [TtnModalOpen, setTtnModalOpen] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingPurchaseOrders, setLoadingPurchaseOrders] = useState(false);
  const [loadingTTN, setLoadingTTN] = useState(false);
  const [sent, setSent] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [pdfUrl, setPdfUrl] = useState<File | null>(null);


  const [linkedToPO, setLinkedToPO] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrderDetails | null>(null);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderSummary[] | []>([])

  // UI state only
  const [clientSearch, setClientSearch] = useState("");
  const [clients, setClients] = useState<PartnerSummary[] | []>([])
  const [loadingClients, setLoadingClients] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false);
  const previousCurrencyRef = useRef<CurrencyType>("TND");
  // const previewData = useWatch({ control });
  const previewData = getValues();

  // Validation des données obligatoire
  const canCreateInvoice =
    (mode == "create" ? isDirty : true) &&
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
          itemTaxAmount: (quantity * item.unityPriceEXclTax)*(item.vatRate/100),
          itemTotalInclTax: (quantity * item.unityPriceEXclTax)*(1+item.vatRate/100),
          operationCategory: item.operationCategory,
          quantity,
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
    append(defaultItem(), {
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
    if (linkedToPO && selectedPO || invoice?.purchaseOrder!=null) {
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
    console.log(originalItem?.quantity)
    return originalItem?.quantity ?? 0;
  };
  const getMaxQuantity = (item: InvoiceItem) => {
    if (mode === "edit" && item.purchaseOrderItem) {
      const remaining = (item.purchaseOrderItem?.quantity ?? 0) -
        (item.purchaseOrderItem?.invoicedQuantity ?? 0);

      const initialQty = getInitialQuantity(item.idInvoiceItem!);
      console.log(initialQty)
      return remaining + initialQty;
    }
    if (mode === "create" && selectedPO && linkedToPO) {
      return (item.purchaseOrderItem?.quantity ?? 0) -
        (item.purchaseOrderItem?.invoicedQuantity ?? 0);
    }

    return undefined;
  };


  // Sélection d'un client
  const selectClient = (client: PartnerSummary) => {
    setValue("partner", client, { shouldValidate: true, shouldDirty: true, });
    setClientSearch(client.partnerName);
    setShowDropdown(false);
  };


  // Suppression de client selectionnée 
  const clearClient = () => {
    setValue("partner", null, { shouldValidate: true, shouldDirty: true, });
    setClientSearch("");
  };


  

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

  // récupérer la liste des bons de commande disponible en cours de livraison ou bien broullion 
  const fetchPurchaseOrderSummary = async () => {
    try {
    //  setLoading(true)
    if(mode=="create"){

      setLoadingPurchaseOrders(true)
      const purchaseorders = await PurchaseOrderAPI.getPurchaseOrderSummary();
      setPurchaseOrders(purchaseorders);
    }

    } catch (error) {
      appToast.error("Erreur Fetch du client:", getApiErrorMessage(error));
    }
    finally {
      setLoadingPurchaseOrders(false)
    }
  }
  // récupérer un bon de commande séléctionnée
  const fetchPurchaseOrder = async (idPurchaseOrder: string) => {
    try {
      //   setLoading(true)
      const purchaseOrder = await PurchaseOrderAPI.getClientPurchaseOrderById(idPurchaseOrder);
      return purchaseOrder;
    } catch (error) {
      appToast.error("Erreur Fetch du client:", getApiErrorMessage(error));
    }
    finally {
      //   setLoading(false)
    }
  };

  // Recupération les données d'un bon de commande lorsque la facture est liée à un bon de commande 
  async function handleSelectPO(idPurchaseOrder: string) {
    console.log(idPurchaseOrder)
    const po = await fetchPurchaseOrder(idPurchaseOrder);
    if (!po) return;
    setSelectedPO(po);

    form.setValue("issueDate", new Date(po!.issueDate));
    console.log(po!.paymentCondition);
    form.setValue("paymentCondition", po!.paymentCondition);
    form.setValue("paymentMethod", po!.paymentMethod);
    calculateDueDate()
    form.setValue("invoiceCurrency", po!.purchaseCurrency);
    po?.partner && selectClient(po?.partner);
    const totals = calculateInvoiceTotalsFromPurchaseOrder(po!.purchaseOrderItems!);
    setValue("totalExclTax", totals.totalHT, { shouldValidate: true, shouldDirty: true });
    setValue("vatAmount", totals.totalTVA, { shouldValidate: true, shouldDirty: true });
    setValue("totalInclTax", totals.totalTTC, { shouldValidate: true, shouldDirty: true });
    setValue("purchaseOrder", {
      idPurchaseOrder: po.idPurchaseOrder,
      purchaseOrderNumber: po.purchaseOrderNumber,
      issueDate: new Date(po.issueDate),
      purchaseOrderStatus: po.purchaseOrderStatus,
      currency: po.purchaseCurrency,
    });
    console.log(po!.purchaseOrderItems);
    SyncPurchaseOrderItems(po!.purchaseOrderItems!, true)
    console.log(form.getValues("invoiceItems"))

  }

  // désélectionnée un bon de commande
  function handleTogglePO(checked: boolean) {
    setLinkedToPO(checked);
    if (!checked) {
      setSelectedPO(null);

      clearClient();
      setValue("invoiceItems", [defaultItem()], { shouldValidate: true, shouldDirty: true, });
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

  // Permet la visualisation  de la facture en PDF une fois remplie
  /* eslint-disable react-hooks/refs */
  const onSubmit = handleSubmit(
    async () => {
      const element = invoiceRef.current;

      if (!element) return;
            const values = getValues();

      console.log(getValues("purchaseOrder"))
      const file = await handleSaveAsPDF(element, getValues("invoiceNumber"));
      const pdfFile = await generatePdfFile(invoiceToPdfData(values));
      if (pdfFile) {
        setValue("invoiceDocument", pdfFile, { shouldValidate: true, shouldDirty: true });
        setPdfUrl(pdfFile);
      }
      setIsModalOpen(true);
    },
    (errors) => {
      console.log("erreurs validation", errors);
    }
  );

  //fermer le document modal 
  function onCloseDocumentModal() {
    setIsModalOpen(false);
    setPdfUrl(null);
  }

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

  //******** Modifier une facture */

  const updateInvoice = async () => {

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

      formData.append("idInvoice", values.idInvoice);

      formData.append("invoiceNumber", values.invoiceNumber);
      formData.append("issueDate", values.issueDate.toISOString());
      formData.append("dueDate", values.dueDate.toISOString());

      formData.append("invoiceStatus", values.invoiceStatus)

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

      if (invoice!.purchaseOrder) {
        formData.append("purchaseOrder", invoice!.purchaseOrder.idPurchaseOrder);
      }
     
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
      const createdInvoice = await InvoicesAPI.updateClientInvoice(values.idInvoice, formData);

      if (createdInvoice) {
        appToast.success("Facture mise à jour avec succès");
        setIsModalOpen(false);
        setSuccessMessage("La facture a été mise à jour avec succès.");
        setTtnModalOpen(true);
      }
    } catch (e: unknown) {
      const message = getApiErrorMessage(e);
      appToast.error("Échec de modification, veuillez réessayer.", message);
    } finally {
      setLoadingForm(false)

    }

  }

  // Envoyer la facture au TTN 
  function sendToTTN() {
    setLoadingTTN(true);
    setTimeout(() => {
      setLoadingTTN(false)
      setSuccessMessage("La facture a été envoyée avec succès au TTN.")
      setSent(true)
    }, 10000);
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


    setTtnModalOpen,
    TtnModalOpen,
    isModalOpen,
    sendToTTN,
    sent,
    loadingTTN,
    successMessage,
    loadingForm,
    loadingEdit,
    loadingClients,
    loadingPurchaseOrders,
    onCloseDocumentModal,
    invoiceRef,
    pdfUrl,

    linkedToPO,
    setLinkedToPO,
    selectedPO,
    handleSelectPO,
    handleTogglePO,

    purchaseOrders,

    //data validation

    canCreateInvoice,
    errors,

    //dueDate
    calculateDueDate,

    //createInvoice
    createInvoice,

    updateInvoice,
    //Navigation
    router,
    getMaxQuantity,
    invoice

  };


}
