"use client";

import { useEffect, useState } from "react";
import { Send, Mail, Paperclip } from "lucide-react";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { Modal } from "../ui/modal";
import {  MailingAPI } from "@/features/billing/api/partners-api";

export interface EmailAttachment {
  label: string;
  filename: string;
}

export interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTo?: string;
  defaultSubject?: string;
  defaultMessage?: string;
  recipientName?: string;
  attachments?: EmailAttachment[];
}

const LABEL = "block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5";
const INPUT  = `
w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50
text-sm font-semibold text-slate-700
focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400
transition
read-only:bg-slate-100 read-only:text-slate-400 read-only:cursor-not-allowed read-only:border-slate-200
`;

export function SendEmailModal({
  isOpen,
  onClose,
  defaultTo = "",
  defaultSubject = "",
  defaultMessage = "",
  recipientName,
  attachments = [],
}: SendEmailModalProps) {
  const [to, setTo]           = useState(defaultTo);
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState(defaultMessage);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTo(defaultTo);
      setSubject(defaultSubject);
      setMessage(defaultMessage);
    }
  }, [isOpen, defaultTo, defaultSubject, defaultMessage]);

  const handleSend = async () => {
    try {
      setSending(true);
     await MailingAPI.sendEmail({
        toEmail:to,
        subject:subject,
        body:message,
      })

        appToast.success("E-mail envoyé avec succès.");
        onClose();
    } catch (error) {
      appToast.error("Erreur d'envoi : " + getApiErrorMessage(error));
    } finally {
      setSending(false);
    }
  };

  const footer = (
    <>
      <button
        onClick={onClose}
        className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold text-slate-600 transition"
      >
        Annuler
      </button>

      <button
        onClick={handleSend}
        disabled={sending || !to || !subject}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition"
      >
        {sending ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Send size={14} strokeWidth={2} />
        )}
        {sending ? "Envoi…" : "Envoyer"}
      </button>
    </>
  );

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={recipientName ? `Envoyer un e-mail — ${recipientName}` : "Envoyer un e-mail"}
      footer={footer}
    >
      <div className="flex flex-col gap-4">

        {/* Destinataire */}
        <div>
          <label className={LABEL}>
            <Mail size={11} className="inline mr-1" />
            Destinataire
          </label>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="email@exemple.com"
            className={INPUT}
            readOnly
          />
        </div>

        {/* Objet */}
        <div>
          <label className={LABEL}>Objet</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Sujet de l'e-mail"
            className={INPUT}
          />
        </div>

        {/* Message */}
        <div>
          <label className={LABEL}>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={7}
            className={`${INPUT} resize-none`}
          />
        </div>

        {/* Pièces jointes */}
        {attachments.length > 0 && (
          <div>
            <label className={LABEL}>
              <Paperclip size={11} className="inline mr-1" />
              Pièces jointes
            </label>
            <div className="flex flex-col gap-2">
              {attachments.map((att) => (
                <div
                  key={att.filename}
                  className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Paperclip size={14} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {att.label}
                    </p>
                    <p className="text-sm font-semibold text-blue-800">{att.filename}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
}