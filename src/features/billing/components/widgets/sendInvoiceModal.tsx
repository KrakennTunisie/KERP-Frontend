"use client";

import { useEffect, useState } from "react";
import { X, Download, Send, Mail } from "lucide-react";
import {  InvoicePageItem } from "../../models/invoice";
import { InvoicesAPI } from "../../api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";


interface SendInvoiceModalProps {
  invoice: InvoicePageItem | null;
  isOpen: boolean;
  onClose: () => void;
}




export function SendInvoiceModal({
  invoice,
  isOpen,
  onClose,
}: SendInvoiceModalProps) {
const formatAmount = () => {
  if (!invoice) return "";

  switch (invoice.invoiceCurrency) {
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

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [hoverCancel, setHoverCancel] = useState(false);
  const [hoverSend, setHoverSend] = useState(false);

  useEffect(()=>{
    const defaultMessage = invoice
      ? `Bonjour ${invoice.partner.name},

    Veuillez trouver ci-joint la facture ${invoice.invoiceNumber} pour un montant de ${formatAmount()}.

    Cordialement,`
    :"";
    setMessage(defaultMessage)
    setTo(invoice?.partner.email ?? "")
    setSubject(`Facture ${invoice?.invoiceNumber}`)
  },[invoice?.idInvoice])

  if (!isOpen) return null;

  const handleSend = async () => {
    try {

    setSending(true);
    if(invoice!==null){
      await InvoicesAPI.sendEmailWithInvoice(invoice?.idInvoice,{
              toEmail: to,
              subject: subject, 
              body: message
            });

      appToast.success("Facture envoyé avec succès.");
      onClose();
    }
     
    } catch (error) {
    appToast.error("Erreur d'envoi : ", getApiErrorMessage(error));

    }
    finally{
    setSending(false);
    }

  };

  const font = "'Segoe UI', system-ui, sans-serif";

  const inputStyle = (field: string): React.CSSProperties => ({
    width: "100%",
    padding: "11px 14px",
    border: `1.5px solid ${focusedField === field ? "#2563EB" : "#eff6ff"}`,
    borderRadius: 10,
    fontSize: 14,
    color: "#1a2e22",
    background: focusedField === field ? "#fff" : "#fafcfb",
    outline: "none",
    boxShadow: focusedField === field ? "0 0 0 3px rgba(26,122,74,0.1)" : "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    fontFamily: font,
    resize: "none" as const,
    boxSizing: "border-box" as const,
    lineHeight: "1.6",
  });

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,20,10,0.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: 16,
      }}
    >
      {/* Modal container */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#ffffff",
          borderRadius: 20,
          width: "100%",
          maxWidth: 480,
          boxShadow: "0 24px 60px rgba(0,80,40,0.18), 0 4px 12px rgba(0,0,0,0.08)",
          overflow: "hidden",
          fontFamily: font,
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
            padding: "18px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: "rgba(255,255,255,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <Send size={18} strokeWidth={2} />
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 15, margin: 0, letterSpacing: "0.01em" }}>
                Envoyer la facture
              </p>
              <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 12, margin: "2px 0 0", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                À {invoice?.partner!.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "none",
              background: "rgba(255,255,255,0.15)",
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Body ── */}
        <div
          style={{
            padding: "22px 22px 8px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
            maxHeight: "calc(100svh - 220px)",
            overflowY: "auto",
          }}
        >
          {/* Invoice card */}
          <div
            style={{
              background: "linear-gradient(135deg, #f0f6fa 0%, #e4eef6 100%)",
              border: "1px solid #c3e8d2",
              borderRadius: 14,
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#1d4ed8", textTransform: "uppercase" }}>
                FACTURE
              </span>
              <span style={{ fontSize: 19, fontWeight: 800, color: "#0f2848", letterSpacing: "-0.02em" }}>
                {invoice?.invoiceNumber}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#1d4ed8", textTransform: "uppercase" }}>
                MONTANT
              </span>
              <span style={{ fontSize: 19, fontWeight: 800, color: "#1e3a8a", letterSpacing: "-0.02em" }}>
                {formatAmount()}
              </span>
            </div>
          </div>

          {/* Destinataire */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <Mail size={13} color="#666" />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#666", textTransform: "uppercase" }}>
                DESTINATAIRE
              </span>
            </div>
            <input
              readOnly
              type="email"
              value={to}
              style={inputStyle("to")}
            />
          </div>

          {/* Objet */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#666", textTransform: "uppercase" }}>
              OBJET
            </span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              onFocus={() => setFocusedField("subject")}
              onBlur={() => setFocusedField(null)}
              style={inputStyle("subject")}
            />
          </div>

          {/* Message */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#666", textTransform: "uppercase" }}>
              MESSAGE
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onFocus={() => setFocusedField("message")}
              onBlur={() => setFocusedField(null)}
              rows={7}
              style={inputStyle("message")}
            />
          </div>

          {/* Attachment */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "#f4f9ff",
              border: "1.5px solid #d6e8f8",
              borderRadius: 12,
              padding: "13px 16px",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: "#ddeeff",
                color: "#2563EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Download size={16} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 2px" }}>
                Pièce jointe
              </p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1e3a8a", margin: 0 }}>
              
              </p>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ display: "flex", gap: 12, padding: "16px 22px 22px" }}>
          <button
            onClick={onClose}
            onMouseEnter={() => setHoverCancel(true)}
            onMouseLeave={() => setHoverCancel(false)}
            style={{
              flex: 1,
              padding: 13,
              borderRadius: 12,
              border: `1.5px solid ${hoverCancel ? "#ccc" : "#e0e0e0"}`,
              background: hoverCancel ? "#f5f5f5" : "#fff",
              color: "#555",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: font,
              transition: "background 0.15s, border-color 0.15s",
            }}
          >
            Annuler
          </button>

          <button
            onClick={handleSend}
            disabled={sending}
            onMouseEnter={() => setHoverSend(true)}
            onMouseLeave={() => setHoverSend(false)}
            style={{
              flex: 2,
              padding: "13px 20px",
              borderRadius: 12,
              border: "none",
              background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              cursor: sending ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              opacity: sending ? 0.7 : hoverSend ? 0.92 : 1,
              transform: hoverSend && !sending ? "translateY(-1px)" : "none",
              transition: "opacity 0.15s, transform 0.12s",
              fontFamily: font,
              letterSpacing: "0.01em",
            }}
          >
            {sending ? (
              <span
                style={{
                  width: 15,
                  height: 15,
                  border: "2px solid rgba(255,255,255,0.35)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                }}
              />
            ) : (
              <Send size={15} strokeWidth={2} />
            )}
            {sending ? "Envoi…" : "Envoyer au client"}
          </button>
        </div>
      </div>

      {/* Keyframe spinner — seul élément impossible à faire en inline */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
