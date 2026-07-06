"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Path, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createPaymentSchema,
  CreatePaymentFormInput,
  CreatePaymentFormValues,
  UpdatePaymentFormValues,
  Payment,
} from "../models/payment";

import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";
import { InvoicesAPI, paymentsAPI } from "../api/partners-api";
import { InvoicePageItem } from "../models/invoice";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { nextNumber } from "../types/nextNumber";
import { generatePdfFile } from "@/shared/pdf/pdfGenerator";
import { paymentToPdfData } from "@/shared/pdf/documentAdapter";

type UseCreatePaymentProps = {
  mode?: "create" | "update" | "clone";
  paymentId?: string;
  invoiceId?: string | null;
};

export default function useCreatePayment({
  mode = "create",
  paymentId,
  invoiceId
}: UseCreatePaymentProps = {}) {
  const router = useRouter();

  const isUpdate = mode === "update";
    const isClone = mode === "clone";
    const isEditMode = isUpdate || isClone;

  const [nextNumber, setNextNumber] = useState<nextNumber>();
  const [invoices, setInvoices] = useState<InvoicePageItem[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [loadingInvoice, setLoadingInvoice] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoicePageItem>();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdf, setPdf]= useState<File | null>(null)
  const[max, setMax]= useState(0)
  const[total, setTotal]= useState(0)
  const [payment, setPayment]= useState<Payment| null>(null)

  const debouncedSearchQuery = useDebounce(search, 500);

  const fields = {
    reference: "reference" as Path<CreatePaymentFormInput>,
    date: "date" as Path<CreatePaymentFormInput>,
    amount: "amount" as Path<CreatePaymentFormInput>,
    method: "method" as Path<CreatePaymentFormInput>,
    invoiceNumber: "invoiceNumber" as Path<CreatePaymentFormInput>,
    currency: "currency" as Path<CreatePaymentFormInput>,
    comment: "comment" as Path<CreatePaymentFormInput>,
  };

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePaymentFormInput, unknown, CreatePaymentFormValues>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      reference: "",
      date: new Date().toISOString().slice(0, 10),
      amount: 0,
      method: "BANK_TRANSFER",
      invoiceNumber: "",
      currency: "EUR",
      paymentDocument: null,
      paymentNumber: "",
      invoice: null,
      comment:""
    },
  });

  const selectedInvoiceNumber = watch("invoiceNumber");

  const getError = (field: keyof CreatePaymentFormInput) => {
    return errors[field]?.message as string | undefined;
  };

  const handleInvoiceChange = (invoiceNumber: string, invoiceToSelect?:InvoicePageItem) => {
    const invoice =
    invoiceToSelect ??
    invoices.find((item) => item.invoiceNumber === invoiceNumber);

    setValue("invoiceNumber", invoiceNumber, {
      shouldValidate: true,
      shouldDirty: true,
    });

    
    if (invoice) {
      setSelectedInvoice(invoice)
      setValue("amount", Number(invoice.remainingAmount.toFixed(2)) ?? 0, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setValue("currency", invoice.invoiceCurrency, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };


  const fetchNextNumber = async () => {
    if (isUpdate) return;

    try {
      const response = await paymentsAPI.getNextPaymentNumber();
      setNextNumber(response);

      if (response?.value) {
        setValue("reference", response.value, {
          shouldValidate: true,
          shouldDirty: false,
        });
      }
    } catch (error) {
      appToast.error(
        "Erreur lors de la récupération du numéro de paiement",
        getApiErrorMessage(error)
      );
    }
  };

  const fetchInvoices = async () => {
    try {
      setLoadingInvoices(true);

      const response =
        await InvoicesAPI.getClientsInvoicesToPay(debouncedSearchQuery);

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

  const fetchSelectedInvoice = async () => {
      if(!invoiceId) return ;
      try {
        setLoadingInvoice(true);

        const response =
          await InvoicesAPI.getClientInvoiceItemById(invoiceId);

        handleInvoiceChange(response.invoiceNumber, response)
      } catch (error) {
        appToast.error(
          "Erreur lors du chargement des factures",
          getApiErrorMessage(error)
        );
      } finally {
        setLoadingInvoice(false);
      }
  };

const fetchPaymentDetails = async () => {
  if (!isEditMode || !paymentId) return;

  try {
    setLoadingPayment(true);

    const payment = await paymentsAPI.getPaymentDetails(paymentId);

    let paymentNumber = payment.reference ?? payment.reference ?? "";

    if (isClone) {
      const nextPaymentNumber = await paymentsAPI.getNextPaymentNumber();
      paymentNumber = nextPaymentNumber?.value ?? "";
    }

    reset({
      reference: paymentNumber,
      date: new Date().toISOString().slice(0, 10),
      amount: payment.amount ?? 0,
      method: payment.method ?? "BANK_TRANSFER",
      invoiceNumber:
        payment.invoice?.invoiceNumber  ?? "",
      currency:
        payment.currency ??
        payment.invoice?.invoiceCurrency ??
        payment.invoice?.invoiceCurrency ??
        "EUR",
      invoice: null,
      paymentDocument: null,
      paymentNumber: paymentNumber,
      comment: payment.comment ?? "",
    });

    if (payment.invoice) {
      setSelectedInvoice({
          ...payment.invoice
      }  as InvoicePageItem);
    }
    setPayment(payment as unknown as Payment)
  } catch (error) {
    appToast.error(
      isClone
        ? "Erreur lors du clonage du paiement"
        : "Erreur lors du chargement du paiement",
      getApiErrorMessage(error)
    );
  } finally {
    setLoadingPayment(false);
  }
};

  useEffect(() => {
    fetchNextNumber();
  }, [mode]);

  useEffect(()=>{
    if(!invoiceId) return;
    fetchSelectedInvoice()
  },[invoiceId])

  useEffect(() => {
    fetchInvoices();
  }, [debouncedSearchQuery]);

  useEffect(() => {
    fetchPaymentDetails();
  }, [mode, paymentId]);



  const onSubmit = handleSubmit(
    async () => {

     const values = getValues();

     console.log("values: ", values)

      const pdfFile = await generatePdfFile(paymentToPdfData(values));
      if (pdfFile) {
        setValue("paymentDocument", pdfFile, { shouldValidate: true, shouldDirty: true });
        setPdf(pdfFile);
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
    setPdf(null);
  }

  const buildFormData = async (data: CreatePaymentFormValues) => {
    const formData = new FormData();

    if(!selectedInvoice) return;

    formData.append("invoiceNumber", selectedInvoice?.idInvoice);
    formData.append("paymentNumber", data.reference);
    formData.append("date", data.date);
    formData.append("amount", String(data.amount));
    formData.append("currency", data.currency);
    formData.append("method", data.method);
    formData.append("comment", data.comment)
    
    if( data.paymentDocument)
    formData.append("paymentDocument", data.paymentDocument)

    return formData;
  };

  const createPayment = async (data: CreatePaymentFormValues ) => {
    if(!selectedInvoice) return ;
    try {
      setCreateLoading(true);

      const formData = await buildFormData(data);

      if(!formData) return;
      
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

  const updatePayment = async (data: CreatePaymentFormValues) => {
    if (!paymentId) return;

    try {
      setUpdateLoading(true);

      const formData = await buildFormData(data);
      if(!formData) return;
      formData.append('idPayment', paymentId)


      const updatedPayment = await paymentsAPI.updatePayment(
        paymentId,
        formData
      );

      if (updatedPayment) {
        appToast.success("Paiement modifié avec succès");
        router.push(`/billing/payments/${paymentId}`);
      }
    } catch (error) {
      appToast.error(
        "Échec de modification du paiement, veuillez réessayer.",
        getApiErrorMessage(error)
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  const submitPayment = async () => {
    if (isUpdate) {
      await updatePayment(getValues());
      return;
    }

    await createPayment(getValues());
  };


function getInvoiceTotalByCurrency(invoice: InvoicePageItem): number {
  switch (invoice.invoiceCurrency) {
    case "EUR":
      return invoice.totalInclTaxEUR ?? 0;
    case "TND":
      return invoice.totalInclTaxTND ?? 0;
    case "USD":
      return invoice.totalInclTaxUSD ?? 0;
    default:
      return 0;
  }
}

  useEffect(()=>{
    if(mode=="create")
    {
      setMax(selectedInvoice ?  selectedInvoice.remainingAmount : 0);
      setTotal(selectedInvoice ? getInvoiceTotalByCurrency(selectedInvoice) : 0)
    }
    if(mode=="update"){
        setMax(payment ?  payment.amount : 0);
        setTotal(selectedInvoice ? getInvoiceTotalByCurrency(selectedInvoice) : 0)
    }
  },[selectedInvoice])

  return {
    router,
    pdf,
    mode,
    isUpdate,

    fields,

    register,
    handleSubmit,
    onSubmit,
    submitPayment,
    onCloseDocumentModal,
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
    loadingPayment,

    handleInvoiceChange,

    createPayment,
    updatePayment,
    createLoading,
    updateLoading,

    search,
    setSearch,

    max,
    total,
    loadingInvoice, setLoadingInvoice,
    isModalOpen, setIsModalOpen
  };
}