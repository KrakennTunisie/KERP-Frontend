"use client"

import { tvaRateSchema } from "../../types/tvaRate"
import { paymentMethodLabels, paymentMethodSchema } from "../../types/paymentMethod"
import { SectionTitle } from "../widgets/sectionTitle"
import { InvoiceFormClientProps, useCreateInvoice } from "../../hooks/useCreateEditInvoice"
import { OperationCategoryLabels, operationCategorySchema } from "../../types/operationCategory"
import { invoiceTypeSchema } from "../../types/invoiceType"
import { CurrencyType, currencyTypeSchema } from "../../types/currency"
import { PaymentConditionLabels, PaymentConditionSchema } from "../../types/paymentCondition"
import { DocumentPreviewModal } from "@/shared/components/ui/documentPreviewModal"
import ErrorForm from "../widgets/errorForm"
import { SendToTTNModal } from "../widgets/ttnConfirmationModal"
import { useCreatePurchaseOrder } from "../../hooks/useCreateEditPurchaseOrder"

export default function CreatePurchaseOrder({
  mode,
  invoiceId,
}: InvoiceFormClientProps) {
  const {
    addItem,
    removeItem, updateItem, clientSearch, setClientSearch, showDropdown, setShowDropdown, canCreateInvoice, errors, selectClient, clearClient, filteredClients,
    setCurrency, previewData, form, onSubmit, router, isModalOpen, createPurchaseOrder, pdfUrl, onCloseDocumentModal
  } = useCreatePurchaseOrder({ mode, invoiceId })

  const { register } = form

  const inputClass =
    "w-full px-3 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"

  const selectClass =
    "w-full px-3 py-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"

  const labelClass =
    "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5"

  const cardClass =
    "bg-white rounded-2xl border border-slate-200 shadow-sm p-5"

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {mode === "create"
                  ? "Création du bon de commande"
                  : "Modification du bon de commande"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
            >
              Annuler
            </button>

            <button
              onClick={onSubmit}
              disabled={!canCreateInvoice}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition ${!canCreateInvoice
                  ? "cursor-not-allowed bg-gray-300 text-gray-500 shadow-none"
                  : "bg-blue-600 text-white shadow-md shadow-blue-200 hover:bg-blue-700"
                }`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              {mode === "create"
                ? "Créer"
                : "Modifier"}
            </button>
          </div>
        </div>
      </header>
      {/* Modal pour la facture générée  */}
      <DocumentPreviewModal
        open={isModalOpen}
        onClose={onCloseDocumentModal}
        onCreateInvoice={createPurchaseOrder}
        document={pdfUrl} />

      {/* Main */}
      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="space-y-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            {/* Top sections */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              {/* Référence */}
              <section>
                <SectionTitle
                  number="01"
                  label="RÉFÉRENCE"
                  invoiceType={invoiceTypeSchema.enum.SALE}
                />
                <div className={`${cardClass} mt-3 flex flex-col gap-4`}>
                  <div>
                    <label className={labelClass}>N° Facture</label>
                    <input
                      readOnly
                      type="text"
                      {...register("purchaseOrderNumber")}
                      className={`${inputClass} font-semibold`}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>Émission</label>
                      <input
                        type="date"
                        {...register("issueDate", {
                          valueAsDate: true,

                        })}
                        min={new Date().toISOString().split("T")[0]}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Client */}
              <section>
                <SectionTitle
                  number="02"
                  label="CLIENT"
                  invoiceType={invoiceTypeSchema.enum.SALE}
                />
                <div className={`${cardClass} mt-3 flex flex-col gap-4`}>
                  <div>
                    <label className={labelClass}>Sélectionner un client</label>

                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Rechercher un client..."
                        value={clientSearch}
                        onChange={(e) => {
                          setClientSearch(e.target.value)
                          setShowDropdown(true)
                        }}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                        className={`${inputClass} pr-10`}
                      />

                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg
                          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""
                            }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>

                      {showDropdown && filteredClients.length > 0 && (
                        <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                          {filteredClients.map((client) => (
                            <button
                              key={client.idPartner}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault()
                                selectClient(client)
                              }}
                              className="w-full border-b border-slate-50 px-4 py-3 text-left transition hover:bg-blue-50 last:border-0"
                            >
                              <p className="text-sm font-bold text-slate-800">
                                {client.name}
                              </p>
                              <p className="mt-0.5 text-xs text-slate-400">
                                {client.address}
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {previewData.partner && (
                    <div className="rounded-xl border-2 border-blue-100 bg-blue-50/40 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-blue-700">
                            {previewData.partner.name}
                          </p>
                          <p className="mt-0.5 text-xs text-blue-500">
                            {previewData.partner.address}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={clearClient}
                          className="text-slate-300 transition hover:text-red-400"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-blue-500">
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          {previewData.partner.email}
                        </span>

                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-blue-500">
                          <svg
                            className="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          {previewData.partner.phoneNumber}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Second row */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              {/* Devise */}
              <section>
                <SectionTitle
                  number="03"
                  label="DEVISE"
                  invoiceType={invoiceTypeSchema.enum.SALE}
                />

                <div className={`${cardClass} mt-3`}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>Devise de saisie</label>
                      <select
                        {...register("currency")}
                        onChange={(e) => setCurrency(e.target.value as CurrencyType)}
                        className={selectClass}
                      >
                        {currencyTypeSchema.options.map((currency) => (
                          <option key={currency} value={currency}>
                            {currency}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Taux de change</label>
                      <input
                        type="text"
                        readOnly
                        {...register("appliedExchangeRate", { valueAsNumber: true })}
                        className={`${inputClass} font-semibold`}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Paiement */}
              <section>
                <SectionTitle
                  number="05"
                  label="PAIEMENT"
                  invoiceType={invoiceTypeSchema.enum.SALE}
                />

                <div className={`${cardClass} mt-3`}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className={labelClass}>Conditions</label>
                      <select
                        {...register("PaymentCondition", {

                        })}
                        className={selectClass}
                      >
                        {PaymentConditionSchema.options.map((condition) => (
                          <option key={condition} value={condition}>
                            {PaymentConditionLabels[condition]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Méthode</label>
                      <select {...register("paymentMethod")} className={selectClass}>
                        {paymentMethodSchema.options.map((method) => (
                          <option key={method} value={method}>
                            {paymentMethodLabels[method]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Services */}
            <section>
              <div className="flex items-center justify-between">
                <SectionTitle
                  number="04"
                  label="SERVICES"
                  invoiceType={invoiceTypeSchema.enum.SALE}
                />

                <button
                  onClick={addItem}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-200 transition hover:bg-blue-700"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 2xl:grid-cols-2">
                {(previewData.purchaseOrderItems ?? []).map((item, index) => (
                  <div
                    key={item.idInvoiceItem ?? index}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        Désignation
                      </label>

                      <button
                        onClick={() => removeItem(item.idInvoiceItem!)}
                        className="text-slate-300 transition hover:text-red-400"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-4">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(
                            item.idInvoiceItem!,
                            "description",
                            e.target.value
                          )
                        }
                        className={`${inputClass} font-semibold`}
                      />

                      <div>
                        <label className={labelClass}>Catégorie</label>
                        <select
                          value={item.operationCategory}
                          onChange={(e) =>
                            updateItem(
                              item.idInvoiceItem!,
                              "operationCategory",
                              e.target.value
                            )
                          }
                          className={selectClass}
                        >
                          {operationCategorySchema.options.map((value) => (
                            <option key={value} value={value}>
                              {OperationCategoryLabels[value]}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div>
                          <label className={labelClass}>QTÉ</label>
                          <input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                item.idInvoiceItem!,
                                "quantity",
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className={`${inputClass} text-center font-semibold`}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>P.U HT</label>
                          <input
                            type="text"
                            defaultValue={item.unityPriceEXclTax}
                            onBlur={(e) =>
                              updateItem(
                                item.idInvoiceItem!,
                                "unityPriceEXclTax",
                                parseFloat(e.target.value)
                              )
                            }
                            className={`${inputClass} text-center font-semibold`}
                          />
                        </div>

                        <div>
                          <label className={labelClass}>TVA %</label>
                          <select
                            value={item.vatRate}
                            onChange={(e) =>
                              updateItem(
                                item.idInvoiceItem!,
                                "vatRate",
                                Number(e.target.value)
                              )
                            }
                            className={`${selectClass} text-center`}
                          >
                            {tvaRateSchema.options.map((rate) => (
                              <option key={rate.value} value={rate.value}>
                                {rate.value}%
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {errors.purchaseOrderItems?.message && (
                <div className="mt-4">
                  <ErrorForm error={errors.purchaseOrderItems?.message} />
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}