"use client";

import { DocumentPreviewModal } from "@/shared/components/ui/documentPreviewModal";
import PageLoader from "@/shared/components/ui/pageLoader";
import React from "react";
import usePurchaseOrderDetails from "../../hooks/usePurchaseOrderDetails";
import { PaymentConditionLabels } from "../../types/paymentCondition";
import { paymentMethodLabels } from "../../types/paymentMethod";
import Card from "../widgets/card";
import { SectionLabel } from "../widgets/sectionLabel";


type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function PurchaseOrderModal({ open, title, onClose, children, footer }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-3xl rounded-xl p-6 shadow-xl border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {title && <p className="text-lg font-black text-gray-900">{title}</p>}
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl border border-gray-300 hover:bg-gray-50 font-black text-black cursor-pointer"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div>{children}</div>

        {/* Footer */}
        {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}


export function PurchaseOrderModalContent({
  
 
  purchaseOrderId,
  onClose,
}: {

  purchaseOrderId: string
  onClose: () => void;
}) {
  const { router, purchaseOrder, purchaseOrderItems, successMessage, setPreviewDocument, previewDocument, loadingDetails } = usePurchaseOrderDetails({ purchaseOrderId })
  

  if (loadingDetails) {
    return (
      <PageLoader label="Chargement de bon de commande ..." />
    )
  }
  return (
    <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
      {/* Client + Admin */}
      <div className="grid grid-cols-2 gap-4">
        {/* Client info */}
        <Card>
          <SectionLabel>Informations client</SectionLabel>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <svg width="18" height="18" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{purchaseOrder?.partner?.companyName}</p>
              <p className="text-xs text-blue-500 font-medium">Client</p>
            </div>
          </div>
          <DocumentPreviewModal
            open={!!previewDocument}
            onClose={() => setPreviewDocument(null)}
            document={previewDocument}
          />

          {/* Contact details */}
          <div className="space-y-2.5 mb-4 divide-y divide-gray-100">
            <div className="flex items-center gap-2.5 py-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <svg width="13" height="13" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <p className="text-xs text-gray-700">{purchaseOrder?.partner?.professionnalPhoneNumber}</p>
            </div>

            <div className="flex items-center gap-2.5 py-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <svg width="13" height="13" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <p className="text-xs text-gray-700">{purchaseOrder?.partner?.email}</p>
            </div>

            <div className="flex items-center gap-2.5 py-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <svg width="13" height="13" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <p className="text-xs text-gray-700">{purchaseOrder?.partner?.billingAddress.region}</p>
            </div>
          </div>

          {/* Matricule fiscal */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <svg width="13" height="13" fill="none" stroke="#3b82f6" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Matricule fiscal</p>
                <p className="text-xs font-bold text-gray-900 font-mono">{purchaseOrder?.partner?.taxRegistrationNumber}</p>
              </div>
            </div>
          </div>
        </Card>
        {/* Admin details */}
        {/* Admin details */}
        <Card>
          <SectionLabel>Détails administratifs</SectionLabel>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                Référence
              </p>
              <p className="text-sm font-bold text-gray-900">{purchaseOrder?.purchaseOrderNumber ?? "—"}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                Méthode de paiement
              </p>
              <p className="text-sm font-bold text-gray-900">
                {purchaseOrder?.paymentMethod ? paymentMethodLabels[purchaseOrder.paymentMethod] : "—"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                Devise
              </p>
              <p className="text-sm font-semibold text-gray-700">{purchaseOrder?.purchaseCurrency ?? "—"}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                Condition de paiement
              </p>
              <p className="text-sm font-semibold text-gray-700">{purchaseOrder?.paymentCondition ? PaymentConditionLabels[purchaseOrder.paymentCondition] : "—"}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <SectionLabel>Documents attachés</SectionLabel>
            {purchaseOrder?.purchaseOrderDocument ? (
              <div
                onClick={() => setPreviewDocument(purchaseOrder.purchaseOrderDocument)}
                className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-blue-50 hover:border-blue-100 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                    <svg width="15" height="15" fill="none" stroke="#e11d48" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {purchaseOrder.purchaseOrderDocument.fileName}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Bon de commande · PDF</p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-400 group-hover:text-blue-600 transition-colors">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-dashed border-gray-200">
                <svg width="15" height="15" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <p className="text-xs text-gray-400">Aucun document attaché</p>
              </div>
            )}
          </div>
        </Card>
      </div>
      {/* Items table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[15px] font-bold text-gray-900">
            Détails des prestations
          </span>
        </div>

        {/* Header row */}
        <div className="grid grid-cols-[1fr_70px_90px_100px] gap-2 pb-2.5 border-b border-gray-100">
          {["Désignation", "Qté", "P.U HT", "Total HT"].map((h) => (
            <span
              key={h}
              className={`text-[10px] font-bold uppercase tracking-widest text-gray-400 ${h !== "Désignation" ? "text-right" : ""
                }`}
            >
              {h}
            </span>
          ))}
        </div>

        {/* Rows */}
        <div
          className="max-h-[220px] overflow-y-auto pr-2"
          style={{ scrollbarWidth: "thin", scrollbarColor: "#CBD5E1 transparent" }}
        >
          {purchaseOrder?.purchaseOrderItems!.map((item, index) => (
            <div
              key={item.idPurchaseOrderItem}
              className={`grid grid-cols-[1fr_70px_90px_100px] gap-2 py-3.5 items-center ${index < purchaseOrder?.purchaseOrderItems!.length - 1 ? "border-b border-gray-50" : ""
                }`}
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {item.description}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">TVA {item.vatRate}%</p>
              </div>
              <p className="text-sm text-gray-700 text-right">{item.quantity}</p>
              <p className="text-sm text-gray-700 text-right">
                {item.unityPriceEXclTax}
              </p>
              <p className="text-sm font-bold text-gray-900 text-right">
                {item.quantity * item.unityPriceEXclTax}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-4 flex flex-col items-end gap-2">
          {[
            {
              label: 'Sous-total HT', value: purchaseOrder?.purchaseCurrency == "EUR"
                ? purchaseOrder.totalExclTaxEUR
                : purchaseOrder?.purchaseCurrency == "TND"
                  ? purchaseOrder.totalExclTaxTND
                  : purchaseOrder?.totalExclTaxUSD
            },
            {
              label: 'Total TVA', value: purchaseOrder?.purchaseCurrency == "EUR"
                ? (purchaseOrder.totalInclTaxEUR - purchaseOrder.totalExclTaxEUR).toFixed(2)
                : purchaseOrder?.purchaseCurrency == "TND"
                  ? (purchaseOrder.totalInclTaxTND - purchaseOrder.totalExclTaxTND).toFixed(2)
                  :
                  purchaseOrder?.purchaseCurrency == "USD"
                    ? (purchaseOrder?.totalInclTaxUSD - purchaseOrder?.totalExclTaxUSD).toFixed(2)
                    : 0
            },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between w-64">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {label}
              </span>
              <span className="text-sm font-semibold text-gray-900">{value}</span>
            </div>
          ))}
          <div className="w-64 h-px bg-gray-200 my-1" />
          <div className="flex justify-between w-64 items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-700">
              Total TTC
            </span>
            <span className="text-2xl font-extrabold text-blue-600 tracking-tight">
              {purchaseOrder?.purchaseCurrency == "EUR"
                ? purchaseOrder.totalInclTaxEUR + " EUR"
                : purchaseOrder?.purchaseCurrency == "TND"
                  ? purchaseOrder.totalInclTaxTND + " TND"
                  : purchaseOrder?.totalInclTaxUSD + " USD"}
            </span>
          </div>
        </div>
      </Card>

      {/* Footer buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-xl border border-blue-200 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

