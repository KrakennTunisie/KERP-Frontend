"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useDebounce } from "@/shared/hooks/useDebounce";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";


import { InvoiceStatus, invoiceStatusSchema } from "../types/invoiceStatus";
import { PaymentListItem } from "../models/payment";
import { paymentsAPI } from "../api/partners-api";

type UsePaymentListTabParams = {
  invoiceId: string;
  type: "CLIENT" | "SUPPLIER";
};

export function usePaymentListTab({
  invoiceId,
  type,
}: UsePaymentListTabParams) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filtre, setFiltre] = useState<InvoiceStatus>("ALL");

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [invoiceRef, setInvoiceRef] = useState(invoiceId);
  const [paymentRef, setPaymentRef] = useState<string>();

  const [payments, setPayments] = useState<PaymentListItem[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentListItem>();

  const [idInvoice, setIdInvoice] = useState("");

  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearchQuery = useDebounce(search, 2000);

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const keyword =
        debouncedSearchQuery.trim().length >= 3
          ? debouncedSearchQuery.trim()
          : undefined;

      const response = await paymentsAPI.getPaymentsByInvoivce(invoiceRef, {
        keyword,
        filter:
          filtre === invoiceStatusSchema.enum.ALL ? "" : filtre?.toString(),
        page: currentPage - 1,
      });

      setPayments(response.content ?? []);
      setTotalPages(response.totalPages ?? 1);
      setTotalElements(response.totalElements ?? 0);
    } catch (error) {
      appToast.error(
        "Erreur lors du chargement des paiements : ",
        getApiErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInvoiceRef(invoiceId);
  }, [invoiceId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, filtre]);

  useEffect(() => {
    if (!invoiceRef) return;

    fetchPayments();
  }, [invoiceRef, debouncedSearchQuery, currentPage, filtre]);

  const onDelete = async () => {
    try {
      setDeleteLoading(true);

      await paymentsAPI.deletePayment(deleteId);

      appToast.success("Paiement supprimé avec succès.");

      setDeleteId("");
      setDeleteOpen(false);

      await fetchPayments();
    } catch (error) {
      appToast.error(
        "Erreur de suppression : ",
        getApiErrorMessage(error)
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const refresh = () => fetchPayments();

  return {
    router,

    search,
    setSearch,

    filtre,
    setFiltre,

    open,
    setOpen,

    deleteOpen,
    setDeleteOpen,

    invoiceRef,
    setInvoiceRef,

    paymentRef,
    setPaymentRef,

    payments,
    selectedPayment,
    setSelectedPayment,

    currentPage,
    setCurrentPage,

    totalElements,
    totalPages,

    idInvoice,
    setIdInvoice,

    loading,

    deleteId,
    setDeleteId,

    deleteLoading,
    onDelete,

    refresh,
  };
}