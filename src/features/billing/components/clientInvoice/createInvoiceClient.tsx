"use client"

import { tvaRateSchema } from "../../types/tvaRate"
import { paymentMethodLabels, paymentMethodSchema } from "../../types/paymentMethod"
import { SectionTitle } from "../widgets/sectionTitle"
import InvoicePreview from "../widgets/invoicePreview"
import { InvoiceFormClientProps, useCreateInvoice } from "../../hooks/useCreateInvoice"

export default function CreateInvoiceClient({ mode,
    invoiceId, }: InvoiceFormClientProps) {
    const {
        items,
        addItem,
        removeItem,
        updateItem,
        clientSearch,
        setClientSearch,
        selectedClient,
        showDropdown,
        setShowDropdown,
        filteredClients,
        selectClient,
        clearClient,
        conditions,
        setConditions,
        methode,
        setMethode,
        currency,
        setCurrency,
        exchangeRate,
        setExchangeRate,
        previewData,
        form,
        onSubmit,
        router
    } = useCreateInvoice({ mode, invoiceId })

    const { register } = form

    return (
        <div>
            {/* ── Header ── */}
            <header className="sticky top-0 z-30 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            {mode === "create" ? "Création de facture client" : "Modification de facture client"}
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {mode === "create"
                                ? "Configurez les détails et prévisualisez"
                                : "Modifiez les détails et prévisualisez"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition">
                        Annuler
                    </button>
                    <button
                        onClick={onSubmit}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold shadow-md shadow-violet-200 transition"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        {mode === "create" ? "Créer & Envoyer au TTN" : "Modifier & Envoyer au TTN"}
                    </button>
                </div>
            </header>

            {/* ── Body ── */}
            <div className="flex gap-0 bg-white max-w-[1600px]">

                {/* ── Left Panel ── */}
                <div className="w-[440px] min-w-[440px] flex flex-col gap-6 p-6 overflow-y-auto max-h-[calc(100vh-73px)]">

                    {/* Section 01 — Référence */}
                    <section>
                        <SectionTitle number="01" label="RÉFÉRENCE" />
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4 mt-3">
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        N° Facture
                                    </label>
                                    <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer">
                                        <input type="checkbox" defaultChecked className="rounded accent-violet-600" />
                                        Auto-généré
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    {...register("invoiceNumber")}
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                        Émission
                                    </label>
                                    <input
                                        type="date"
                                        {...register("issueDate", { valueAsDate: true })}
                                        min={new Date().toISOString().split("T")[0]}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                        Échéance
                                    </label>
                                    <input
                                        type="date"
                                        {...register("dueDate", { valueAsDate: true })}
                                        min={new Date().toISOString().split("T")[0]}
                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 02 — Client */}
                    <section>
                        <SectionTitle number="02" label="CLIENT" />
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 mt-3">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                Sélectionner un client
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher un client..."
                                    value={clientSearch}
                                    onChange={(e) => { setClientSearch(e.target.value); setShowDropdown(true) }}
                                    onFocus={() => setShowDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                                    className="w-full px-3 py-2.5 py-2.5 pr-9 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition"
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                    <svg
                                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                                {showDropdown && filteredClients.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
                                        {filteredClients.map((client) => (
                                            <button
                                                key={client.idPartner}
                                                type="button"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    selectClient(client);
                                                }}
                                                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition border-b border-slate-50 last:border-0"
                                            >
                                                <p className="text-sm font-bold text-slate-800">{client.name}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{client.address}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {selectedClient && (
                                <div className="border-2 border-blue-100 bg-blue-50/40 rounded-xl p-4">
                                    <div className="flex items-start justify-between">
                                        <p className="font-bold text-blue-700 text-sm">{selectedClient.name}</p>
                                        <button
                                            type="button"
                                            onClick={clearClient}
                                            className="text-slate-300 hover:text-red-400 transition"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-xs text-blue-500 mt-0.5">{selectedClient.address}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-blue-500 uppercase tracking-wide">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            {selectedClient.email}
                                        </span>
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-blue-500 uppercase tracking-wide">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            {selectedClient.phoneNumber}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                    {/* Section 04 — Devise */}
                    <section>
                        <div className="flex items-center justify-between">
                            <SectionTitle number="03" label="DEVISE" />
                        </div>

                        <div className="mt-3 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        Devise de saisie
                                    </label>
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value as "EUR" | "TND")}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                    >
                                        <option value="TND">TND</option>
                                        <option value="EUR">EUR</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        Taux de change
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={exchangeRate}
                                        onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 03 — Services */}
                    <section>
                        <div className="flex items-center justify-between">
                            <SectionTitle number="04" label="SERVICES" />
                            <button
                                onClick={addItem}
                                className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-200 transition"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex flex-col gap-3 mt-3">
                            {items.map((item) => (
                                <div key={item.idInvoiceItem} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                                    <div className="flex items-start justify-between mb-3">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            Désignation
                                        </label>
                                        <button
                                            onClick={() => removeItem(item.idInvoiceItem)}
                                            className="text-slate-300 hover:text-red-400 transition"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={item.description}
                                        onChange={(e) => updateItem(item.idInvoiceItem, "description", e.target.value)}
                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition mb-3"
                                    />
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                QTÉ
                                            </label>
                                            <input
                                                type="number"
                                                min={1}
                                                value={item.quantity}
                                                onChange={(e) => updateItem(item.idInvoiceItem, "quantity", parseFloat(e.target.value) || 0)}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 text-center focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                P.U HT
                                            </label>
                                            <input
                                                type="number"
                                                min={100}
                                                value={item.unityPriceEXclTax}
                                                onChange={(e) => updateItem(item.idInvoiceItem, "unityPriceEXclTax", parseFloat(e.target.value) || 0)}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 text-center focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                TVA %
                                            </label>
                                            <select
                                                value={item.vatRate}
                                                onChange={(e) => updateItem(item.idInvoiceItem, "vatRate", Number(e.target.value))}
                                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 text-center focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                            >
                                                {tvaRateSchema.options.map((rate) => (
                                                    <option key={rate.value} value={rate.value}>{rate.value}%</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 04 — Paiement */}
                    <section>
                        <SectionTitle number="05" label="PAIEMENT" />
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4 mt-3">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                    Conditions
                                </label>
                                <select
                                    value={conditions}
                                    onChange={(e) => setConditions(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition"
                                >
                                    <option>Net 15 jours</option>
                                    <option>Net 30 jours</option>
                                    <option>Net 45 jours</option>
                                    <option>Immédiat</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                    Méthode
                                </label>
                                <select
                                    value={methode}
                                    onChange={(e) => setMethode(e.target.value as any)}
                                    className="w-full px-3 py-2.5 rounded-xl border border-blue-300 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                >
                                    {paymentMethodSchema.options.map((method) => (
                                        <option key={method} value={method}>
                                            {paymentMethodLabels[method]}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </section>

                </div>
                <InvoicePreview data={previewData} />
            </div>
        </div>
    )
}