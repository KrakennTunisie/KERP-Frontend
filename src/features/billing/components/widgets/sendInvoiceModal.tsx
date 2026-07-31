"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Send, Mail, Paperclip } from "lucide-react";

import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";

import { InvoicesAPI, InvoicesCreditNoteAPI, MailingAPI, paymentsAPI, PurchaseOrderAPI } from "../../api/partners-api";

import { Invoice, InvoicePageItem } from "../../models/invoice";
import { PurchaseOrderPageItem } from "../../models/purchaseOrder";
import { InvoiceCreditNotePageItem } from "../../models/creditNote";
import { PaymentDetails } from "../../models/payment";
import { paymentStatusTypeSchema } from "../../types/paymentStatus";
import { invoiceStatusSchema } from "../../types/invoiceStatus";
import { purchaseOrderStatusSchema } from "../../types/purchaseOrderStatus";

type SendDocumentVariant =
  | "invoice"
  | "purchaseOrder"
  | "payment"
  | "invoiceCreditNote";

type SendableDocument =
  | Invoice
  | InvoicePageItem
  | PurchaseOrderPageItem
  | InvoiceCreditNotePageItem
  | PaymentDetails;

type SendDocumentModalProps = {
  document: SendableDocument | null | undefined;
  variant: SendDocumentVariant;
  isOpen: boolean;
  onClose: () => void;
};

const formatMoney = (
  value?: number | null,
  currency: "EUR" | "TND" | "USD" = "TND"
) => {
  if (value === null || value === undefined) return "-";

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const getDocumentLabel = (variant: SendDocumentVariant) => {
  switch (variant) {
    case "invoice":
      return "facture";
    case "purchaseOrder":
      return "bon de commande";
    case "payment":
      return "paiement";
    case "invoiceCreditNote":
      return "facture d’avoir";
    default:
      return "document";
  }
};

const getDocumentNumber = (
  document: SendableDocument | null | undefined,
  variant: SendDocumentVariant
) => {
  if (!document) return "";

  switch (variant) {
    case "invoice":
      return (document as Invoice | InvoicePageItem).invoiceNumber;

    case "purchaseOrder":
      return (document as PurchaseOrderPageItem).purchaseOrderNumber;

    case "payment":
      return (document as PaymentDetails).reference;

    case "invoiceCreditNote":
      return (document as InvoiceCreditNotePageItem).invoiceCreditNoteNumber;

    default:
      return "";
  }
};

const getDocumentId = (
  document: SendableDocument | null | undefined,
  variant: SendDocumentVariant
) => {
  if (!document) return "";

  switch (variant) {
    case "invoice":
      return (document as Invoice | InvoicePageItem).idInvoice;

    case "purchaseOrder":
      return (document as PurchaseOrderPageItem).idPurchaseOrder;

    case "payment":
      return (document as PaymentDetails).idPayment;

    case "invoiceCreditNote":
      return (document as InvoiceCreditNotePageItem).idInvoiceCreditNote;

    default:
      return "";
  }
};

const getDocumentPartnerName = (
  document: SendableDocument | null | undefined,
  variant: SendDocumentVariant
) => {
  if (!document) return "";

  switch (variant) {
    case "invoice":
      return (document as Invoice | InvoicePageItem).partner?.partnerName ?? "";

    case "purchaseOrder":
      return (document as PurchaseOrderPageItem).partner?.partnerName ?? "";

    case "payment":
      return (
        (document as PaymentDetails).invoice?.partner?.partnerName ??
        ""
      );

    case "invoiceCreditNote":
      return (
        (document as InvoiceCreditNotePageItem).invoice?.partner?.partnerName ??
        ""
      );

    default:
      return "";
  }
};

const getDocumentEmail = (
  document: SendableDocument | null | undefined,
  variant: SendDocumentVariant
) => {
  if (!document) return "";

  switch (variant) {
    case "invoice":
      return (document as Invoice | InvoicePageItem).partner?.email ?? "";

    case "purchaseOrder":
      return (document as PurchaseOrderPageItem).partner?.email ?? "";

    case "payment":
      return (
        (document as PaymentDetails).invoice?.partner?.email ??
        ""
      );

    case "invoiceCreditNote":
      return (
        (document as InvoiceCreditNotePageItem).invoice?.partner?.email ?? ""
      );

    default:
      return "";
  }
};



const getDocumentSalutation = (
  document: SendableDocument | null | undefined,
  variant: SendDocumentVariant
) => {
  if (!document) return "";

  switch (variant) {
    case "invoice":
      return (document as Invoice | InvoicePageItem).partner?.maritalStatus ?? "";

    case "purchaseOrder":
      return (document as PurchaseOrderPageItem).partner?.maritalStatus ?? "";

    case "payment":
      return (
        (document as PaymentDetails).invoice?.partner?.maritalStatus ??
        ""
      );

    case "invoiceCreditNote":
      return (
        (document as InvoiceCreditNotePageItem).invoice?.partner?.maritalStatus ?? ""
      );

    default:
      return "";
  }
};

const getDocumentCurrency = (
  document: SendableDocument | null | undefined,
  variant: SendDocumentVariant
): "EUR" | "TND" | "USD" => {
  if (!document) return "TND";

  switch (variant) {
    case "invoice":
      return (
        (document as Invoice | InvoicePageItem).invoiceCurrency ?? "TND"
      ) as "EUR" | "TND" | "USD";

    case "purchaseOrder":
      return (
        (document as PurchaseOrderPageItem).purchaseCurrency ?? "TND"
      ) as "EUR" | "TND" | "USD";

    case "payment":
      return (
        (document as PaymentDetails).currency ??
        (document as PaymentDetails).invoice?.invoiceCurrency ??
        "TND"
      ) as "EUR" | "TND" | "USD";

    case "invoiceCreditNote":
      return (
        (document as InvoiceCreditNotePageItem).invoice?.invoiceCurrency ?? "TND"
      ) as "EUR" | "TND" | "USD";

    default:
      return "TND";
  }
};

const getDocumentAmount = (
  document: SendableDocument | null | undefined,
  variant: SendDocumentVariant
) => {
  if (!document) return "-";

  const currency = getDocumentCurrency(document, variant);

  if (variant === "payment") {
    const payment = document as PaymentDetails;

    return payment.amount + " " + payment.currency;
  }

  const item = document as Invoice | InvoicePageItem | PurchaseOrderPageItem;

  if (currency === "EUR") return formatMoney(item.totalInclTaxEUR, "EUR");
  if (currency === "USD") return formatMoney(item.totalInclTaxUSD, "USD");

  return formatMoney(item.totalInclTaxTND, "TND");
};

export function SendDocumentModal({
  document,
  variant,
  isOpen,
  onClose,
}: SendDocumentModalProps) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const documentLabel = useMemo(() => getDocumentLabel(variant), [variant]);

  const documentNumber = useMemo(
    () => getDocumentNumber(document, variant),
    [document, variant]
  );

  const partnerName = useMemo(
    () => getDocumentPartnerName(document, variant),
    [document, variant]
  );

  const salutation = useMemo(
    () => getDocumentSalutation(document, variant),
    [document, variant]
  );
  const idEntity = useMemo(
    () => getDocumentId(document, variant), 
    [document, variant]);

  const amount = useMemo(
    () => getDocumentAmount(document, variant),
    [document, variant]
  );

  useEffect(() => {
    if (!document) return;

    setTo(getDocumentEmail(document, variant));
    setSubject(`${documentLabel} ${documentNumber}`);

    setMessage(`Bonjour ${salutation} ${partnerName},

        Veuillez trouver ci-joint le document suivant : ${documentLabel} ${documentNumber}, pour un montant de ${amount}.

        Cordialement,`
    );
  }, [document, variant, documentLabel, documentNumber, partnerName, amount]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!document) return;

    try {
      setSending(true);

      const documentId = getDocumentId(document, variant);

      const payload = {
        toEmail: to,
        subject,
        body: message,
      };

      switch (variant) {
        case "invoice":
          await MailingAPI.sendEmailWithInvoice(documentId, payload);
          /*const status = new FormData();
          status.append("status",invoiceStatusSchema.enum.TO_COLLECT)
          await InvoicesAPI.updateClientInvoiceStatus(idEntity,status);*/
          break;

        case "purchaseOrder":
          await MailingAPI.sendEmailWithPurchaseOrder(documentId, payload);
          /*const purchaseOrderStatus = new FormData();
          purchaseOrderStatus.append("status",purchaseOrderStatusSchema.enum.IN_DELIVERY)
          await PurchaseOrderAPI.updateSupplierPurchaseOrderStatus(idEntity,purchaseOrderStatus);*/
          break;

        case "invoiceCreditNote":
          await MailingAPI.sendEmailWithCreditNote(documentId, payload);
          /*const formData = new FormData();
          formData.append("status",invoiceStatusSchema.enum.IN_PROGRESS)
          await InvoicesCreditNoteAPI.updateInvoiceCreditNoteStatus(documentNumber, formData);*/
          break;

        case "payment":
          await MailingAPI.sendEmailWithPayment(documentId, payload);
          await paymentsAPI.updatePaymentStatus(idEntity, paymentStatusTypeSchema.enum.SENT);
          break;
      }

      appToast.success("Mail envoyé avec succès.");
      onClose();
    } catch (error) {
      appToast.error("Erreur d'envoi : ", getApiErrorMessage(error));
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[480px] overflow-hidden rounded-[20px] bg-white font-sans shadow-[0_24px_60px_rgba(0,80,40,0.18),0_4px_12px_rgba(0,0,0,0.08)]"
      >
        <div className="flex items-center justify-between bg-gradient-to-br from-blue-600 to-blue-700 px-[22px] py-[18px]">
          <div className="flex items-center gap-3">
            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-[10px] bg-white/20 text-white">
              <Send size={18} strokeWidth={2} />
            </div>

            <div>
              <p className="m-0 text-[15px] font-bold tracking-wide text-white">
                Envoyer le document
              </p>
              <p className="mt-0.5 text-xs uppercase tracking-wider text-white/70">
                À {partnerName || "-"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border-0 bg-white/15 text-white transition hover:bg-white/25"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex max-h-[calc(100svh-220px)] flex-col gap-4 overflow-y-auto px-[22px] pb-2 pt-[22px]">
          <div className="flex items-center justify-between rounded-[14px] border border-blue-100 bg-gradient-to-br from-blue-50 to-slate-100 px-5 py-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-blue-700">
                {documentLabel}
              </span>
              <span className="text-[19px] font-extrabold tracking-tight text-slate-900">
                {documentNumber}
              </span>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-blue-700">
                Montant
              </span>
              <span className="text-[19px] font-extrabold tracking-tight text-blue-900">
                {amount}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block">
              <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                <Mail className="h-3.5 w-3.5" />
                Destinataire
              </span>
              <input
                value={to}
                onChange={(event) => setTo(event.target.value)}
                placeholder="email@exemple.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Objet
              </span>
              <input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Message
              </span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={7}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium leading-6 text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </label>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
            <Paperclip className="h-4 w-4 text-slate-500" />
            Le PDF du document sera ajouté automatiquement en pièce jointe.
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-[22px] py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={sending || !to || !subject || !message}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {sending ? "Envoi..." : "Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
}