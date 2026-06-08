import { CreditCard, Eye, Pencil, Trash2 } from "lucide-react";
import Card from "./card";
import { BillingTable } from "./billingTable";
import { PaymentListItem } from "../../models/payment";
import { paymentMethodLabels } from "../../types/paymentMethod";
import { usePaymentListTab } from "../../hooks/usePaymentListTab";
import { DeleteInvoiceModal } from "./deleteInvoiceModal";
import Link from "next/link";

export function InvoicePaymentsTab({
  invoiceId,
  type,
}: any) {

  const {
  payments,
  currentPage,
  setCurrentPage,
  totalPages,
  totalElements,
  loading,
  refresh,
  setDeleteId,
  setDeleteOpen,
  setSelectedPayment,
  deleteLoading,
  deleteOpen,
  onDelete, router
} = usePaymentListTab({
  invoiceId,
  type,
});

  const totalPaid = payments.reduce(
    (sum: number, payment: any) => sum + Number(payment.amount ?? 0),
    0
  );

  return (
    <Card>
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
        <p className="text-base font-bold text-slate-900">
        Paiements liés
        </p>
        <p className="mt-1 text-sm text-slate-500">
        Consultez les règlements associés à cette facture.
        </p>
    </div>

    <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
        <CreditCard className="h-3.5 w-3.5" />
        {payments.length} paiement(s)
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
        Total payé : {totalPaid.toFixed(2)}
        </div>

        <Link
        href={`/billing/payments/create`}
        className="
            inline-flex items-center gap-1.5
            rounded-lg bg-emerald-600 px-3 py-2
            text-xs font-semibold text-white shadow-sm
            transition-colors hover:bg-emerald-700
        "
        >
        <span className="text-sm leading-none">+</span>
        Ajouter paiement
        </Link>
    </div>
    </div>

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
          setDeleteId(payment.idPayment);
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
            onConfirm={onDelete}
            loading={deleteLoading}      
            />
    </Card>
  );
}