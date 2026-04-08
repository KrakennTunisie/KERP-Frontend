import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation"
import { invoiceSchema } from "../models/invoice";
import { InvoiceItem } from "../models/invoiceItem";
import { Partner } from "../models/partner";
import { MOCK_PARTNERS } from "../mocks/clients-mocks";
import {
  calculateInvoiceTotals,
  calculUnityPrice,
  convertItemCurrency,
  recalculate,
} from "../lib/invoiceCalculation";
import { CurrencyType, currencyTypeSchema } from "../types/currency";
import { PaymentConditionSchema } from "../types/paymentCondition";
import defaultItem from "../mocks/invoice-items-mocks";
import { invoiceStatusSchema } from "../types/invoiceStatus";
import { invoiceComplianceStatusSchema } from "../types/invoiceComplianceStatus";
import { paymentMethodSchema } from "../types/paymentMethod";
import { exchangeRateSourceSchema } from "../types/exchangeRateSource";
import { handleSaveAsPDF } from "../lib/buildInvoicePDF";

export type InvoiceFormClientProps = {
  mode: "create" | "edit"
  invoiceId?: String
}

type InvoiceFormValues = z.infer<typeof invoiceSchema>;
type UpdateableField =
  | "description"
  | "quantity"
  | "unityPriceEXclTax"
  | "vatRate"
  | "operationCategory";


export function useCreateInvoice({ mode, invoiceId }: InvoiceFormClientProps) {
  const router = useRouter()
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceType: "SALE",
      invoiceNumber: "FAC-609535",
      idInvoice: crypto.randomUUID(),
      invoiceStatus: invoiceStatusSchema.enum["À ENCAISSER"],
      issueDate: new Date(),
      creationDate: new Date(),
      sentToclientDate: null,
      sentToTTNDate: null,
      dueDate:new Date(new Date().setDate(new Date().getDate() + 15)) ,
      invoiceItems: [defaultItem()],
      totalExclTax: 0,
      totalInclTax: 0,
      vatAmount: 0,
      PaymentCondition: PaymentConditionSchema.enum.NET_15,
      paymentMethod: paymentMethodSchema.enum.BANK_TRANSFER,
      partner: null,
      purchaseOrder: null,
      currency: currencyTypeSchema.enum.TND,
      appliedExchangeRate: 4,
      exchangeRateReferenceDate: new Date(),
      exchangeRateSource: exchangeRateSourceSchema.enum.EXTERNAL_API,
      complianceQRcode: "",
      invoiceComplianceStatus: invoiceComplianceStatusSchema.enum.RECEIVED,
      invoiceDocument: null


    },
    mode: "onChange",
  });

  const { control, setValue, getValues, handleSubmit ,formState: { isDirty, isValid,errors} } = form;
  const { append, remove, replace } = useFieldArray({
    control,
    name: "invoiceItems",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [TtnModalOpen, setTtnModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [pdfUrl, setPdfUrl] = useState< File | null>(null);


  // UI state only
  const [clientSearch, setClientSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const previousCurrencyRef = useRef<CurrencyType>("TND");
  const previewData = useWatch({ control });

  // Validation des données obligatoire

const canCreateInvoice =
  isDirty &&
  isValid &&
  !!previewData.partner &&
  !!previewData.invoiceItems?.length &&
  !!previewData.dueDate &&
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





  //Filtrage de la liste des clients lors de la recherche 
  const filteredClients = useMemo(() => {
    return MOCK_PARTNERS.filter(
      (p) =>
        p.partnerType === "CLIENT" &&
        p.name.toLowerCase().includes(clientSearch.toLowerCase())
    );
  }, [clientSearch]);

  //Synchronisation des items lors d'un nouveau item
  const syncItems = (newItems: InvoiceItem[]) => {
    replace(newItems);
    setValue("invoiceItems", newItems, {
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



  // Sélection d'un client
  const selectClient = (client: Partner) => {
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
    const currentItems = getValues("invoiceItems") ?? [];
    const convertedItems = currentItems.map((item) => convertItemCurrency(item, oldCurrency, newCurrency, getValues("appliedExchangeRate")));

    previousCurrencyRef.current = newCurrency;
    setValue("currency", newCurrency, { shouldValidate: true, shouldDirty: true, });
    const totals = calculateInvoiceTotals(convertedItems);
    setValue("totalExclTax", totals.totalHT, { shouldValidate: true, shouldDirty: true });
    setValue("vatAmount", totals.totalTVA, { shouldValidate: true, shouldDirty: true });
    setValue("totalInclTax", totals.totalTTC, { shouldValidate: true, shouldDirty: true });
    syncItems(convertedItems);
  };

  // calcule de la date d'échance lors la saisie de condition de paiement 
  
  const calculateDueDate = (): Date => {
   const date = new Date(getValues("issueDate"));
   console.log(date)
  switch (getValues("PaymentCondition")) {
    case PaymentConditionSchema.enum.NET_15: date.setDate(date.getDate() + 15); break;
    case  PaymentConditionSchema.enum.NET_30: date.setDate(date.getDate() + 30); break;
    case  PaymentConditionSchema.enum.NET_45: date.setDate(date.getDate() + 45); break;
    case "IMMEDIATE": break;
  }
   setValue("dueDate", date, { shouldValidate: true });
  return date;
};

  // Permet la visualisation  de la facture en PDF une fois remplie
  const onSubmit = handleSubmit(
    async (data) => {
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

  //fermer le document modal 
  function onCloseDocumentModal()
  {
  setIsModalOpen(false);
  setPdfUrl(null);
  }

 //créer facture
 function createInvoice(){
  //Appel de l'api
  setIsModalOpen(false); 
  setSuccessMessage("La facture a été créée avec succès.")      
  setTtnModalOpen(true);
 
 }

 // Envoyer la facture au TTN 
 function sendToTTN ()
 {
  setLoading(true);
  setTimeout(() => {
    setLoading(false)
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
    filteredClients,
    showDropdown,
    setShowDropdown,
    selectClient,
    clearClient,
    setCurrency,

    
    setTtnModalOpen,
    TtnModalOpen,
    isModalOpen,
    sendToTTN,
    sent,
    successMessage,
    loading,
    onCloseDocumentModal,
    invoiceRef,
    pdfUrl,
  
 

    //data validation
   
    canCreateInvoice,
    errors,

    //dueDate
    calculateDueDate,

    //createInvoice
    createInvoice,
    //Navigation
    router,

  };


}
