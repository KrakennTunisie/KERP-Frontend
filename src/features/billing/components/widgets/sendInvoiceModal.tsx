"use client";

import { useEffect, useMemo, useState } from "react";
import { X, Send, Mail, Paperclip } from "lucide-react";

import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";

import { MailingAPI } from "../../api/partners-api";
import { InvoicePageItem } from "../../models/invoice";
import { InvoiceCreditNotePageItem } from "../../models/creditNote";

type SendableInvoice = InvoicePageItem | InvoiceCreditNotePageItem;

interface SendInvoiceModalProps {
  invoice: SendableInvoice | null;
  isOpen: boolean;
  onClose: () => void;
}

const isCreditNote = (
  invoice: SendableInvoice | null,
): invoice is InvoiceCreditNotePageItem => {
  return !!invoice && "invoiceCreditNoteNumber" in invoice;
};

const getInvoiceNumber = (invoice: SendableInvoice | null) => {
  if (!invoice) return "";

  return isCreditNote(invoice)
    ? invoice.invoiceCreditNoteNumber
    : invoice.invoiceNumber;
};

const getInvoiceCurrency = (invoice: SendableInvoice | null) => {
  if (!invoice) return "";

  return isCreditNote(invoice)
    ? invoice.invoice.invoiceCurrency
    : invoice.invoiceCurrency;
};

const getInvoiceEmail = (invoice: SendableInvoice | null) => {
  if (!invoice) return "";

  return isCreditNote(invoice)
    ? invoice.invoice.partner.email
    : invoice.partner.email;
};

const getInvoicePartnerName = (invoice: SendableInvoice | null) => {
  if (!invoice) return "";

  return isCreditNote(invoice)
    ? invoice.invoice.partner.name
    : invoice.partner.name;
};

const getInvoiceId = (invoice: SendableInvoice | null) => {
  if (!invoice) return "";

  return isCreditNote(invoice)
    ? invoice.idInvoiceCreditNote
    : invoice.idInvoice;
};

export const formatAmount = (invoice: SendableInvoice | null) => {
  if (!invoice) return "";

  switch (getInvoiceCurrency(invoice)) {
    case "EUR":
      return `${invoice.totalInclTaxEUR?.toLocaleString("fr-FR")} €`;
    case "TND":
      return `${invoice.totalInclTaxTND?.toLocaleString("fr-FR")} TND`;
    case "USD":
      return `${invoice.totalInclTaxUSD?.toLocaleString("fr-FR")} $`;
    default:
      return "";
  }
};

export function SendInvoiceModal({
  invoice,
  isOpen,
  onClose,
}: SendInvoiceModalProps) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const documentNumber = useMemo(() => getInvoiceNumber(invoice), [invoice]);

  const documentLabel = isCreditNote(invoice)
    ? "facture d'avoir"
    : "facture";

  useEffect(() => {
    if (!invoice) return;

    setTo(getInvoiceEmail(invoice) ?? "");
    setSubject(`${isCreditNote(invoice) ? "Facture d'avoir" : "Facture"} ${documentNumber}`);

    setMessage(`Bonjour ${getInvoicePartnerName(invoice)},

Veuillez trouver ci-joint la ${documentLabel} ${documentNumber} pour un montant de ${formatAmount(invoice)}.

Cordialement,`);
  }, [invoice, documentNumber, documentLabel]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!invoice) return;

    try {
      setSending(true);

      isCreditNote(invoice) 
      
      ? await MailingAPI.sendEmailWithCreditNote(getInvoiceId(invoice),{
        toEmail: to,
        subject,
        body: message
      })

      : await MailingAPI.sendEmailWithInvoice(getInvoiceId(invoice), {
        toEmail: to,
        subject,
        body: message,
      });

      appToast.success(`${documentLabel} envoyée avec succès.`);
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
                Envoyer la {documentLabel}
              </p>
              <p className="mt-0.5 text-xs uppercase tracking-wider text-white/70">
                À {getInvoicePartnerName(invoice)}
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
                {isCreditNote(invoice) ? "Facture d'avoir" : "Facture"}
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
                {formatAmount(invoice)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <Mail size={13} className="text-slate-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
                Destinataire
              </span>
            </div>

            <input
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="w-full rounded-[10px] border-[1.5px] border-blue-50 bg-slate-50 px-3.5 py-[11px] text-sm leading-relaxed text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
              Sujet
            </span>

            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="w-full rounded-[10px] border-[1.5px] border-blue-50 bg-slate-50 px-3.5 py-[11px] text-sm leading-relaxed text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500">
              Message
            </span>

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={7}
              className="w-full resize-none rounded-[10px] border-[1.5px] border-blue-50 bg-slate-50 px-3.5 py-[11px] text-sm leading-relaxed text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
            />
          </div>
        <div className="flex items-center gap-3 rounded-xl border-[1.5px] border-[#d6e8f8] bg-[#f4f9ff] px-4 py-[13px]">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Paperclip size={14} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {"Pièce ointe"}
            </p>
            <p className="text-sm font-semibold text-blue-800">{getInvoiceNumber(invoice)}</p>
          </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 px-[22px] py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={sending}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={16} />
            {sending ? "Envoi..." : "Envoyer"}
          </button>
        </div>
      </div>
    </div>
  );
}