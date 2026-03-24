import { useMemo, useRef, useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation"
import { invoiceSchema } from "../models/invoice";
import { InvoiceItem } from "../models/invoiceItem";
import { Partner } from "../models/partner";
import { paymentMethod } from "../types/paymentMethod";
import { MOCK_PARTNERS } from "../mocks/clients-mocks";
import {
  convertItemCurrency,
  defaultItem,
  recalculate,
} from "../lib/invoiceCalculation";
import { CurrencyType } from "../types/currency";

type InvoiceFormValues = z.infer<typeof invoiceSchema>;
type UpdateableField =
  | "description"
  | "quantity"
  | "unityPriceEXclTax"
  | "vatRate";

export function useCreateInvoice() {
  const router = useRouter()
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceType: "SALE",
      invoiceNumber: "FAC-609535",
      issueDate: new Date(),
      dueDate: new Date(),
      PaymentCondition: "Net 15 jours",
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

  // Watch business values directly from RHF
  const previewData = useWatch({ control });
  const currency = useWatch({ control, name: "currency" }) as CurrencyType;
  const exchangeRate = useWatch({ control, name: "appliedExchangeRate" }) ?? 4;
  const selectedClient = useWatch({ control, name: "partner" }) as Partner | null;
  const conditions = useWatch({ control, name: "PaymentCondition" }) ?? "Net 15 jours";
  const methode = useWatch({ control, name: "paymentMethod" }) as
    | paymentMethod
    | undefined;
  const items = useWatch({ control, name: "invoiceItems" }) ?? [];

  const previousCurrencyRef = useRef<CurrencyType>("TND");

  const filteredClients = useMemo(() => {
    return MOCK_PARTNERS.filter(
      (p) =>
        p.partnerType === "CLIENT" &&
        p.name.toLowerCase().includes(clientSearch.toLowerCase())
    );
  }, [clientSearch]);

  const syncItems = (newItems: InvoiceItem[]) => {
    replace(newItems);
    setValue("invoiceItems", newItems, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const addItem = () => {
    append(defaultItem(), {
      shouldFocus: false,
    });
  };

  const removeItem = (id: string) => {
    const index = items.findIndex((item) => item.idInvoiceItem === id);
    if (index !== -1) {
      remove(index);
    }
  };

  const updateItem = (
    id: string,
    field: UpdateableField,
    value: string | number
  ) => {
    const currentItems = getValues("invoiceItems") ?? [];

    const updatedItems = currentItems.map((item) =>
      item.idInvoiceItem !== id
        ? item
        : recalculate(
            {
              ...item,
              [field]: value,
            },
            currency,
            exchangeRate
          )
    );

    syncItems(updatedItems);
  };

  const setCurrency = (newCurrency: CurrencyType) => {
    const oldCurrency = previousCurrencyRef.current;
    const currentItems = getValues("invoiceItems") ?? [];

    const convertedItems = currentItems.map((item) =>
      convertItemCurrency(item, oldCurrency, newCurrency, exchangeRate)
    );

    previousCurrencyRef.current = newCurrency;

    setValue("currency", newCurrency, {
      shouldValidate: true,
      shouldDirty: true,
    });

    syncItems(convertedItems);
  };

  const setExchangeRate = (value: number) => {
    const currentItems = getValues("invoiceItems") ?? [];

    setValue("appliedExchangeRate", value, {
      shouldValidate: true,
      shouldDirty: true,
    });

    const recalculatedItems = currentItems.map((item) =>
      recalculate(item, currency, value)
    );

    syncItems(recalculatedItems);
  };

  const selectClient = (client: Partner) => {
    setValue("partner", client, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setClientSearch(client.name);
    setShowDropdown(false);
  };

  const clearClient = () => {
    setValue("partner", null, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setClientSearch("");
  };

  const setConditions = (value: string) => {
    setValue("PaymentCondition", value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const setMethode = (value: paymentMethod) => {
    setValue("paymentMethod", value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const onSubmit = handleSubmit((data) => {
    console.log("Invoice payload:", data);
  });

  return {
    form,
    onSubmit,

    // Preview
    previewData,

    // Items
    items,
    fields,
    addItem,
    removeItem,
    updateItem,

    // Client UI
    clientSearch,
    setClientSearch,
    showDropdown,
    setShowDropdown,
    filteredClients,
    selectedClient,
    selectClient,
    clearClient,
     
    // Payment / currency
    conditions,
    setConditions,
    methode,
    setMethode,
    currency,
    setCurrency,
    exchangeRate,
    setExchangeRate,

    //Navigation
    router
  };
}