"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {  PaymentListItem } from "../models/payment";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { paymentsAPI } from "../api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";

export function usePaymentList() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] =useState(true)

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentListItem | null>(null);
    const debouncedSearchQuery = useDebounce(search, 2000);
  const [payments, setPayments] = useState<PaymentListItem[]|[]>([])
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);


      const fetchClientsInvoices = async () => {
          try {
            setLoading(true);
            const keyword =
              debouncedSearchQuery.trim().length >= 3
                ? debouncedSearchQuery.trim()
                : undefined;
  
            const response = await paymentsAPI.getPayments({
              keyword: keyword,
              filter: methodFilter?.toString() === "ALL" ? "" : methodFilter?.toString(),
              page: currentPage - 1,
            });
  
            setPayments(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
          } catch (error) {
            appToast.error("Erreur de fetch clients: ",getApiErrorMessage(error))
          } finally {
            setLoading(false);
          }
        };
  
  
      useEffect(() => {
        setCurrentPage(1);
      }, [debouncedSearchQuery]);
  
      useEffect(() => {
        
        fetchClientsInvoices();
      }, [debouncedSearchQuery, currentPage, methodFilter]);


      const deletePayment = async ()=>{
          try {
            if (!selectedPayment) return;
            setDeleteLoading(true);
            await paymentsAPI.deletePayment(selectedPayment?.idPayment);
            appToast.success('Paiement supprimé avec succès.')
            setSelectedPayment(null)
            setDeleteOpen(false)
            await fetchClientsInvoices()
          } catch (error) {
            appToast.error("Erreur de suppresion: ",getApiErrorMessage(error))
          } finally {
            setDeleteLoading(false);
          }
      }

  return {
    router,

    search,
    setSearch,

    methodFilter,
    setMethodFilter,

    payments,

    currentPage,
    setCurrentPage,
    totalElements,
    totalPages,

    loading,

    deletePayment,
    deleteLoading,
    deleteOpen,
    setDeleteOpen,
    selectedPayment,
    setSelectedPayment,
  };
}