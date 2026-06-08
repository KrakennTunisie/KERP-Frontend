"use client";

import { BillingPageHeader } from "../widgets/billingHeader";
import { StatusFilterBar } from "../widgets/billingFilterBar";
import { BillingTable } from "../widgets/billingTable";
import {  PaymentListItem } from "../../models/payment";
import { usePaymentList } from "../../hooks/usePaymentList";
import { paymentMethodLabels,  paymentMethodWithAllLabels, paymentMethodWithAllSchema } from "../../types/paymentMethod";
import { DeleteInvoiceModal } from "../widgets/deleteInvoiceModal";


export default function PaymentsList() {
  const {
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
  } = usePaymentList();

        const paymentMethods = paymentMethodWithAllSchema.options
        .map((status) => ({
            value: status,
            label: paymentMethodWithAllLabels[status],
        }));
  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      {/* Header */}
      <BillingPageHeader
        title="Paiements"
        description="Gestion et suivi des paiements liés aux factures"
        createHref="/billing/payments/create"
        createLabel="Nouveau paiement"
      />

      {/* Filters */}
      <StatusFilterBar
        search={search}
        onSearchChange={setSearch}
        selectedStatus={methodFilter}
        onStatusChange={setMethodFilter}
        defaultStatus="ALL"
        statuses={paymentMethods}
        searchPlaceholder="Référence paiement ou facture..."
      />

      {/* Table */}
      <BillingTable<PaymentListItem>
        items={payments}
        variant="payment"
        secondColumnLabel="Facture liée"
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        loading={loading}
        onPageChange={setCurrentPage}
        onView={(payment) => {
          router.push(`/billing/payments/${payment.idPayment}`);
        }}
        onEdit={(payment) => {
          router.push(`/billing/payments/update/${payment.idPayment}`);
        }}
        onDelete={(payment) => {
          setSelectedPayment(payment);
          setDeleteOpen(true);
        }}
        getNumber={(payment) => payment.reference}
        getRelatedInvoiceNumber={(payment) => payment.invoice.invoiceNumber}
        getPaymentMethod={(payment) => paymentMethodLabels[ payment.method]}
        getAmountEUR={(payment) =>payment.currency=="EUR" ? payment.amount : null}
        getAmountTND={(payment) =>payment.currency=="TND" ? payment.amount : null}
        getDate={(payment) => new Date(payment.paymentDate)}
        emptyMessage="Aucun paiement trouvé."
      />
      <DeleteInvoiceModal 
      open={deleteOpen} 
      onClose={()=> setDeleteOpen(false)} 
      onConfirm={deletePayment}
      loading={deleteLoading}      
      />
    </div>
  );
}