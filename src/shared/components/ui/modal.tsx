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
    <div className="fixed inset-0 bg-black/25 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl rounded-2xl p-6 shadow-lg border border-gray-100 transform transition-all duration-300 scale-100 opacity-100">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          {title && (
            <p
              className="text-xl font-semibold text-gray-900 truncate max-w-[80%]"
              title={title}
            >
              {title}
            </p>
          )}

          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:bg-gray-100 transition cursor-pointer"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 text-gray-700 text-sm">
          {children}
        </div>

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