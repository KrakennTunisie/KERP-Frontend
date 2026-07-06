"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, FileText, Search, X } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Label } from "./label";
import { InvoicePageItem } from "@/features/billing/models/invoice";

type SearchableInvoiceSelectProps = {
  label?: string;
  value?: string;
  invoices: InvoicePageItem[];
  error?: string;
  required?: boolean;
  tooltip?: string;
  placeholder?: string;
  search?: string,
  setSearch: (search: string)=> void,
  onChange: (invoiceNumber: string) => void;
};

export function SearchableInvoiceSelect({
  label = "Facture",
  value,
  invoices,
  error,
  required,
  tooltip,
  placeholder = "Rechercher une facture...",
  search,
  setSearch,
  onChange,
}: SearchableInvoiceSelectProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);

  const selectedInvoice = useMemo(() => {
    return invoices.find((invoice) => invoice.invoiceNumber === value);
  }, [invoices, value]);

  const handleSelect = (invoiceNumber: string) => {
    onChange(invoiceNumber);
    setSearch("");
    setOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setSearch("");
    setOpen(false);
  };

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
      setSearch("");
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


        const total =
      selectedInvoice?.invoiceCurrency === "EUR"
        ? selectedInvoice?.totalInclTaxEUR
        : selectedInvoice?.invoiceCurrency  === "TND"
          ? selectedInvoice?.totalInclTaxTND
          : selectedInvoice?.totalInclTaxUSD;

  return (
    <div ref={containerRef} className="relative space-y-2">
      {label && (
        <Label required={required} tooltip={tooltip}>
          {label}
        </Label>
      )}

      <div className="relative">
        <div className="pointer-events-none absolute left-3.5 top-1/2 flex -translate-y-1/2 items-center text-slate-400">
          <FileText className="h-4 w-4 text-blue-600" />
        </div>

        <input
          type="text"
          value={open ? search : selectedInvoice?.invoiceNumber ?? ""}
          placeholder={
            selectedInvoice && !open
              ? selectedInvoice.invoiceNumber
              : placeholder
          }
          onFocus={() => {
            setOpen(true);
            setSearch("");
          }}
          onChange={(event) => {
            setSearch(event.target.value);
            setOpen(true);
          }}
          className={cn(
            "flex h-11 w-full min-w-0 rounded-xl border bg-white py-2 pl-10 pr-20 text-sm text-slate-800 shadow-sm outline-none transition-all",
            "placeholder:text-slate-400",
            "hover:border-slate-300 hover:bg-slate-50/70",
            "focus-visible:border-blue-500 focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue-100",
            error
              ? "border-red-500 bg-red-50/30 focus-visible:border-red-500 focus-visible:ring-red-100"
              : "border-slate-200"
          )}
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-10 top-1/2 flex -translate-y-1/2 items-center text-slate-400 transition hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center text-slate-400 transition hover:text-slate-700"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              open && "rotate-180"
            )}
          />
        </button>
      </div>

      {selectedInvoice && !open && (
        <p className="text-xs font-medium text-slate-500">
          {selectedInvoice.partner.companyName} · Reste à payer :{" "}
          <span className="font-bold text-slate-800">
            {selectedInvoice.remainingAmount.toFixed(2)+" "+selectedInvoice.invoiceCurrency}
          </span>
        </p>
      )}

    {open && (
    <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2 text-xs font-semibold text-slate-400">
        <Search className="h-4 w-4" />
        {invoices.length} facture
        {invoices.length > 1 ? "s" : ""} trouvée
        {invoices.length > 1 ? "s" : ""}
        </div>

        <div
        className="max-h-64 overflow-y-auto overscroll-contain pr-1"
        style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#CBD5E1 transparent",
        }}
        >
        {invoices.length === 0 ? (
            <div className="px-4 py-6 text-center">
            <p className="text-sm font-semibold text-slate-500">
                Aucune facture trouvée
            </p>
            <p className="mt-1 text-xs text-slate-400">
                Essayez avec un autre numéro ou client.
            </p>
            </div>
        ) : (
            invoices.map((invoice) => {
            const selected = invoice.invoiceNumber === value;

            return (
                <button
                key={invoice.idInvoice}
                type="button"
                onClick={() => handleSelect(invoice.invoiceNumber)}
                className={cn(
                    "flex w-full items-start justify-between gap-4 px-4 py-3 text-left transition hover:bg-blue-50",
                    selected && "bg-blue-50"
                )}
                >
                <div className="min-w-0">
                    <p className="truncate text-sm font-black text-slate-900">
                    {invoice.invoiceNumber}
                    </p>

                    <p className="mt-0.5 truncate text-xs font-medium text-slate-500">
                    {invoice.partner.companyName}
                    </p>
                </div>

                <div className="shrink-0 text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Reste
                    </p>

                    <p className="text-xs font-black text-slate-800">
                    {total}
                    </p>
                </div>
                </button>
            );
            })
        )}
        </div>
    </div>
    )}

      {error && (
        <p className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}