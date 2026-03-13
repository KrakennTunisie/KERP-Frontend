"use client";

import React from "react";

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function Modal({ open, title, onClose, children, footer }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-xl border border-gray-100">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          {title && (
            <p className="text-lg font-black text-gray-900">{title}</p>
          )}

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 font-black cursor-pointer"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div>{children}</div>

        {/* Footer */}
        {footer && (
          <div className="mt-6 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}