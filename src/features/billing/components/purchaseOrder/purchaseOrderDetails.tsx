"use client";

import React, { useState } from "react";
import Card from "../widgets/card";
import { SectionLabel } from "../widgets/sectionLabel";
import { Partner } from "../../models/partner";
import { InvoiceItem } from "../../models/invoiceItem";


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
      <div className="bg-white w-full max-w-3xl rounded-3xl p-6 shadow-xl border border-gray-100">
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
  client,
  items,
  onClose,
}: {
  client: Partner;
  items: InvoiceItem[];
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
      {/* Client + Admin */}
      <div className="grid grid-cols-2 gap-4">
        {/* Client info */}
        <Card>
          <SectionLabel>Informations client</SectionLabel>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{client.name}</p>
              <p className="text-xs text-gray-500 mt-1 leading-5">
                {client.address}
                <br />
                {client.country}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                Matricule fiscal
              </p>
              <p className="text-xs font-bold text-gray-900 font-mono">
                {client.taxRegistrationNumber}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                Contact
              </p>
              <p className="text-sm font-bold text-gray-900">{client.name}</p>
            </div>
          </div>
        </Card>

        {/* Admin details */}
        <Card>
          <SectionLabel>Détails administratifs</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                Bon de commande
              </p>
              <p className="text-sm font-bold text-gray-900">BC-2024-0042</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                Méthode de paiement
              </p>
              <p className="text-sm font-bold text-gray-900">Virement bancaire</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                Devise
              </p>
              <p className="text-sm font-semibold text-gray-700">TND</p>
            </div>
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
              className={`text-[10px] font-bold uppercase tracking-widest text-gray-400 ${
                h !== "Désignation" ? "text-right" : ""
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
          {items.map((item, index) => (
            <div
              key={item.idInvoiceItem}
              className={`grid grid-cols-[1fr_70px_90px_100px] gap-2 py-3.5 items-center ${
                index < items.length - 1 ? "border-b border-gray-50" : ""
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {item.description}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">TVA 19%</p>
              </div>
              <p className="text-sm text-gray-700 text-right">{item.quantity}</p>
              <p className="text-sm text-gray-700 text-right">
                {item.unityPriceEXclTax}
              </p>
              <p className="text-sm font-bold text-gray-900 text-right">
                {item.itemTotalExclTax}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="mt-4 flex flex-col items-end gap-2">
          {[
            { label: "Sous-total HT", value: "15 500 TND" },
            { label: "Total TVA", value: "2 945 TND" },
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
              18 445 TND
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

