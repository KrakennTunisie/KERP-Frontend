import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation"
import { Invoice, invoiceSchema } from "../models/invoice";
import { InvoiceItem } from "../models/invoiceItem";
import { Partner } from "../models/partner";
import { MOCK_PARTNERS } from "../mocks/clients-mocks";
import {
  calculateInvoiceTotals,
  calculUnityPrice,
  convertItemCurrency,
  recalculate,
} from "../lib/invoiceCalculation";
import { CurrencyType } from "../types/currency";
import { PaymentConditionSchema } from "../types/paymentCondition";
import defaultItem from "../mocks/invoice-items-mocks";

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
      issueDate: new Date(),
      dueDate: new Date(),
      PaymentCondition: PaymentConditionSchema.enum.NET_15,
      paymentMethod: undefined,
      partner: null,
      currency: "TND",
      appliedExchangeRate: 4,
      invoiceItems: [defaultItem()],
    },
    mode: "onChange",
  });

  const { control, setValue, getValues, handleSubmit } = form;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "invoiceItems",
  });

  // UI state only
  const [clientSearch, setClientSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const previousCurrencyRef = useRef<CurrencyType>("TND"); 
  const previewData = useWatch({ control });
  
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
 const updateItem = ( id: string,  field: UpdateableField,value: string | number) => {
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
    setValue("partner", client, { shouldValidate: true, shouldDirty: true,});
    setClientSearch(client.name);
    setShowDropdown(false);
  };


// Suppression de client selectionnée 
  const clearClient = () => {
    setValue("partner", null, { shouldValidate: true,shouldDirty: true,});
    setClientSearch("");
  };
  

  // changement de la devise EUR -> TND et vice versa
  const setCurrency = (newCurrency: CurrencyType) => {
    const oldCurrency = previousCurrencyRef.current;
    const currentItems = getValues("invoiceItems") ?? [];
    const convertedItems = currentItems.map((item) =>convertItemCurrency(item, oldCurrency, newCurrency, getValues("appliedExchangeRate")));

  previousCurrencyRef.current = newCurrency;
  setValue("currency", newCurrency, {shouldValidate: true,shouldDirty: true, });
  const totals = calculateInvoiceTotals(convertedItems);
  setValue("totalExclTax", totals.totalHT, { shouldValidate: true, shouldDirty: true });
  setValue("vatAmount", totals.totalTVA, { shouldValidate: true, shouldDirty: true });
  setValue("totalInclTax", totals.totalTTC, { shouldValidate: true, shouldDirty: true });
  syncItems(convertedItems);
  };

 
  // Permet la génération de la facture une fois remplie 
  const onSubmit = handleSubmit((data) => {
    if (mode === "create") {
      console.log("create invoice", data)
    } else {
      console.log("update invoice", data)
    }
  })



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
     
    
    //Navigation
    router,
  
  };
}