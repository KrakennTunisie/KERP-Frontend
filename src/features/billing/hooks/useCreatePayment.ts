"use client";

import { useEffect,  useState } from "react";
import { useRouter } from "next/navigation";
import { Path, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createPaymentSchema,
  CreatePaymentFormValues,
} from "../models/payment";

import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";
import { InvoicesAPI, paymentsAPI } from "../api/partners-api";
import { InvoicePageItem } from "../models/invoice";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { nextNumber } from "../types/nextNumber";



export default function useCreatePayment() {
  const router = useRouter();
  const [nextNumber, setNextNumber] = useState<nextNumber>()

  const [invoices, setInvoices] = useState<InvoicePageItem[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice]=useState<InvoicePageItem>()
  const [search, setSearch] = useState("")
  const debouncedSearchQuery = useDebounce(search, 2000);

    const fetchNextNumber = async () => {
    try {

        const response = await paymentsAPI.getNextPaymentNumber();
        setNextNumber(response);
    }
    catch (error: any) {
      appToast.error("Erreur de fetch clients: ", getApiErrorMessage(error))
    }
  }

  
  useEffect(() => {
    fetchNextNumber()
  }, [])
  
  const fields = {
    paymentNumber: "paymentNumber" as Path<CreatePaymentFormValues>,
    date: "date" as Path<CreatePaymentFormValues>,
    amount: "amount" as Path<CreatePaymentFormValues>,
    method: "method" as Path<CreatePaymentFormValues>,
    invoiceNumber: "invoiceNumber" as Path<CreatePaymentFormValues>,
  };


  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePaymentFormValues>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      reference: nextNumber?.value,
      date: new Date().toISOString().slice(0, 10),
      amount: 0,
      method: "BANK_TRANSFER",
      invoiceNumber: "",
    },
  });

  
    useEffect(() => {
      if (nextNumber?.value) {
      setValue("reference", nextNumber.value, {
          shouldValidate: true,
          shouldDirty: false,
        });
      }
    }, [nextNumber]);

  const selectedInvoiceNumber = watch("invoiceNumber");



  const getError = (field: keyof CreatePaymentFormValues) => {
    return errors[field]?.message as string | undefined;
  };

  const fetchInvoices = async () => {
    try {
      setLoadingInvoices(true);

      /**
       * À adapter selon ton endpoint réel.
       *
       * Exemple attendu :
       * const response = await invoicesApi.getInvoicesToPay();
       */
      const response = await InvoicesAPI.getClientsInvoicesToPay(debouncedSearchQuery);

      setInvoices(response);
    } catch (error) {
      appToast.error(
        "Erreur lors du chargement des factures",
        getApiErrorMessage(error)
      );
    } finally {
      setLoadingInvoices(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [debouncedSearchQuery]);

  const handleInvoiceChange = (invoiceNumber: string) => {
    const invoice = invoices.find(
      (item) => item.invoiceNumber === invoiceNumber
    );
    setSelectedInvoice(invoice)

    setValue("invoiceNumber", invoiceNumber, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (invoice) {
      setValue("amount", invoice.totalExclTaxEUR, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("currency", invoice.invoiceCurrency, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("invoiceNumber", invoice.idInvoice, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const createPayment = async (data: CreatePaymentFormValues) => {
    try {
      setCreateLoading(true);

      const formData = new FormData();

      formData.append("invoiceNumber", data.invoiceNumber);
  
      formData.append("paymentNumber", data.reference);
      formData.append("date", data.date);
      formData.append("amount", data.amount.toString());
      formData.append("currency", data.currency);
      formData.append("method", data.method);

      const createdPayment = await paymentsAPI.createPayment(formData);

      if (createdPayment) {
        appToast.success("Paiement créé avec succès");
        router.push("/billing/payments");
      }
    } catch (error) {
      appToast.error(
        "Échec de création du paiement, veuillez réessayer.",
        getApiErrorMessage(error)
      );
    } finally {
      setCreateLoading(false);
    }
  };

  const onSubmit = handleSubmit(createPayment);

  return {
    router,

    fields,

    register,
    handleSubmit,
    onSubmit,
    setValue,
    getValues,
    watch,
    reset,

    errors,
    getError,
    isSubmitting,

    invoices,
    selectedInvoice,
    selectedInvoiceNumber,
    loadingInvoices,

    handleInvoiceChange,

    createPayment,
    createLoading,
    search,
    setSearch
  };
}