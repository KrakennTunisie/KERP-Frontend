"use client";

import Card from "../widgets/card";
import { OperationCategoryLabels } from "../../types/operationCategory";
import { Invoice } from "../../models/invoice";
import { InvoiceItem } from "../../models/invoiceItem";
import { getDiscountLabel, getDiscountValue } from "../../lib/invoiceItemHelpers";

type InvoiceItemsCardProps = {
  invoice: Invoice | undefined;
};

export function InvoiceItemsCard({ invoice }: InvoiceItemsCardProps) {
  const items: InvoiceItem[] = invoice?.invoiceItems ?? [];
  const currency = invoice?.invoiceCurrency ?? "EUR";

  const subtotal =
    currency === "EUR"
      ? invoice?.totalExclTaxEUR
      : currency === "TND"
        ? invoice?.totalExclTaxTND
        : invoice?.totalExclTaxUSD;

  const total =
    currency === "EUR"
      ? invoice?.totalInclTaxEUR
      : currency === "TND"
        ? invoice?.totalInclTaxTND
        : invoice?.totalInclTaxUSD;

  const vat =
    Number(total ?? 0) - Number(subtotal ?? 0);

    const totalDiscount = items.reduce((sum, item) => {
      const quantity = Number(item.quantity ?? 0);
      const unitPrice = Number(item.unityPriceEXclTax ?? 0);
      const subtotal = quantity * unitPrice;

      const discount =
          getDiscountValue(item, subtotal)

      return sum + discount;
    }, 0);

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[15px] font-bold text-slate-900">
          Détails des prestations
        </span>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
          {items.length} ligne{items.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_70px_90px_100px_120px_100px] gap-2 border-b border-slate-100 pb-2.5">
        {[
          "Désignation",
          "Qté",
          "P.U HT",
          "Total HT",
          "Remise",
          "Net HT",
        ].map((header) => (
          <span
            key={header}
            className={`text-[10px] font-bold uppercase tracking-widest text-slate-400 ${
              header !== "Désignation" ? "text-right" : ""
            }`}
          >
            {header}
          </span>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
          <p className="text-sm font-bold text-slate-500">
            Aucune prestation
          </p>

          <p className="mt-1 text-xs font-medium text-slate-400">
            Cette facture ne contient aucune ligne.
          </p>
        </div>
      ) : (
        <div
          className="max-h-[300px] overflow-y-auto pr-2"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#CBD5E1 transparent",
          }}
        >
        {items.map((item: InvoiceItem, index: number) => {
          const quantity = Number(item.quantity ?? 0);
          const unitPrice = Number(item.unityPriceEXclTax ?? 0);

          const subtotal = quantity * unitPrice;

          const discount =getDiscountValue(item, subtotal)

          const lineTotal = Math.max(0, subtotal - discount);

          return (
            <div
              key={item.idInvoiceItem ?? index}
              className={`grid grid-cols-[1fr_70px_90px_100px_120px_100px] items-center gap-2 py-3.5 ${
                index < items.length - 1 ? "border-b border-slate-50" : ""
              }`}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {item.description ?? "—"}
                </p>

                <p className="mt-0.5 text-xs text-slate-400">
                  TVA {item.vatRate ?? 0}%
                </p>

                {item.operationCategory && (
                  <p className="mt-0.5 text-xs text-slate-400">
                    {item.operationCategory}
                  </p>
                )}
              </div>

              <p className="text-right text-sm text-slate-700">
                {quantity}
              </p>

              

              <p className="text-right text-sm text-slate-700">
                {unitPrice.toFixed(2)}
              </p>

              {/* Total HT before discount */}
              <p className="text-right text-sm text-slate-700">
                {subtotal.toFixed(2)}
              </p>

              {/* Discount */}
              <p className="text-right text-sm text-slate-700">
                {getDiscountLabel(item,currency)}
              </p>

              {/* Total HT */}
              <p className="text-right text-sm font-bold text-slate-900">
                {lineTotal.toFixed(2)}
              </p>
            </div>
          );
        })}
        </div>
      )}

      <div className="mt-4 flex flex-col items-end gap-2">
        <TotalLine label="Total Net HT" value={subtotal} />

        <TotalLine
          label="Total remise"
          value={`-${totalDiscount.toFixed(2)}`}
        />

        <TotalLine label="Total TVA" value={vat.toFixed(2)} />

        <div className="my-1 h-px w-64 bg-slate-200" />

        <div className="flex w-64 items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">
            Total TTC
          </span>

          <span className="text-2xl font-extrabold tracking-tight text-blue-600">
            {total != null ? `${total} ${currency}` : "—"}
          </span>
        </div>
      </div>
    </Card>
  );
}

function TotalLine({
  label,
  value,
}: {
  label: string;
  value?: number | string | null;
}) {
  return (
    <div className="flex w-64 justify-between">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </span>

      <span className="text-sm font-semibold text-slate-900">
        {value ?? "—"}
      </span>
    </div>
  );
}