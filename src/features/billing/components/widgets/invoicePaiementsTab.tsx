import { CreditCard } from "lucide-react";
import Link from "next/link";
import { usePaymentListTab } from "../../hooks/usePaymentListTab";
import { PaymentListItem } from "../../models/payment";
import { paymentMethodLabels } from "../../types/paymentMethod";
import { BillingTable } from "./billingTable";
import Card from "./card";
import { DeleteInvoiceModal } from "./deleteInvoiceModal";
import { paymentStatusTypeSchema } from "../../types/paymentStatus";
import { SendDocumentModal } from "./sendInvoiceModal";

export function InvoicePaymentsTab({
  invoiceId,
  type,
  isDisabled
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
    selectedPayment,
    deleteLoading,
    fetchPayments,
    openSendMail, setSendOpenMail,
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
      {/* Header */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <p className="text-sm font-semibold text-slate-900">
            Paiements liés
          </p>
          <p className="text-xs text-slate-500">
            Règlements associés à cette facture
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">

          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
            <CreditCard className="h-3 w-3" />
            {payments.length}
          </div>

          <div className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
            {totalPaid.toFixed(2)} €
          </div>

          <Link
            href={isDisabled ? "#" : `/billing/payments/create?invoiceId=${invoiceId}`}
            onClick={(e) => isDisabled && e.preventDefault()}
            className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition
          ${isDisabled
                ? "cursor-not-allowed bg-slate-200 text-slate-500"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
          >
            + Ajouter
          </Link>
        </div>
      </div>

      {/* Table */}
      <BillingTable<PaymentListItem>
        items={payments}
        variant="payment"
        secondColumnLabel="Facture"
        currentPage={currentPage}
        totalPages={totalPages}
        totalElements={totalElements}
        loading={loading}
        onPageChange={setCurrentPage}
        onView={(payment) =>
          router.push(`/billing/payments/${payment.idPayment}`)
        }
        onEdit={(payment) =>
          router.push(`/billing/payments/update/${payment.idPayment}`)
        }
        onSend={(payment) => {
          if (payment.paymentStatus == paymentStatusTypeSchema.enum.NOT_SENT) {
            setSendOpenMail(true);
            setSelectedPayment(payment);
          }
        }}
        onDelete={(payment) => {
          setSelectedPayment(payment);
          setDeleteId(payment.idPayment);
          setDeleteOpen(true);
        }}
        getNumber={(payment) => payment.reference}
        getPaymentStatus={(payment) => payment.paymentStatus}
        getCurrency={(payment) => payment.invoice.invoiceCurrency}
        getRelatedInvoiceNumber={(payment) => payment.invoice.invoiceNumber}
        getPaymentMethod={(payment) => paymentMethodLabels[payment.method]}
        getAmountEUR={(payment) =>
          payment.currency === "EUR" ? payment.amount : null
        }
        getAmountTND={(payment) =>
          payment.currency === "TND" ? payment.amount : null
        }
        getDate={(payment) => new Date(payment.paymentDate)}
        emptyMessage="Aucun paiement"
      />

      <DeleteInvoiceModal
        documentType="payment"
        documentRef={selectedPayment?.reference}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={onDelete}
        loading={deleteLoading}
      />
      <SendDocumentModal
        document={selectedPayment ?? null}
        variant="payment"
        isOpen={openSendMail}
        onClose={async () => { setSendOpenMail(false); await fetchPayments() }}
      />
    </Card>
  );
}