"use client"

import { DocumentPreviewModal } from "@/shared/components/ui/documentPreviewModal"
import PageLoader from "@/shared/components/ui/pageLoader"
import { Controller } from "react-hook-form"
import { InvoiceFormClientProps, useCreateInvoice } from "../../hooks/useCreateEditInvoice"
import { CurrencyType, currencyTypeSchema } from "../../types/currency"
import { invoiceTypeSchema } from "../../types/invoiceType"
import { PaymentCondition } from "../../types/paymentCondition"
import { paymentMethod, paymentMethodLabels, paymentMethodSchema } from "../../types/paymentMethod"
import { purchaseOrderStatusLabels } from "../../types/purchaseOrderStatus"
import ErrorForm from "../widgets/errorForm"
import InvoicePreview from "../widgets/invoicePreview"
import { SectionTitle } from "../widgets/sectionTitle"
import { SendToTTNModal } from "../widgets/ttnConfirmationModal"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { SendDocumentModal } from "../widgets/sendInvoiceModal"
import { FieldError } from "@/shared/components/ui/fieldError"
import { Input } from "@/shared/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Label } from "@/shared/components/ui/label"
import { discountTypeOptions, discountTypeSchema } from "../../types/discountType"
import { Textarea } from "@/shared/components/ui/textArea"
import AddSettingModal from "../parameters/addSettingItem"
import UseSetting from "../../hooks/useSettings"
import { SettingTypeSchema } from "../../types/settingType"
import { extractTvaRate, formatShowLabel } from "../../lib/settingItemHelpers"
import { useFetchSettings } from "../../hooks/useFetchSetting"
import AddPartnerModal from "../widgets/addPartnerModal"
import { partnerTypeSchema } from "../../types/partnerType"

export default function CreateInvoiceClient({ mode,
    invoiceId, }: InvoiceFormClientProps) {
    const { addItem, removeItem, updateItem, clientSearch, setClientSearch, showDropdown, setShowDropdown,
        invoiceRef, pdfUrl, canCreateInvoice, errors, TtnModalOpen, setTtnModalOpen, sent, successMessage, purchaseOrders,
        linkedToPO, selectedPO, handleSelectPO, loadingTTN, handleTogglePO, selectClient, clearClient,
        updateInvoice, clients, previewData, form, onSubmit, isModalOpen, router, calculateDueDate, onCloseDocumentModal,
        createInvoice, sendToTTN, watch, setValue, getClients,
        showAddSupplierModal, setShowAddSupplierModal,
        loadingClients, loadingEdit, loadingForm, getMaxQuantity, invoice, sendOpen, setSendOpen, createdInvoice, getError, getItemError,
    } = useCreateInvoice({ mode, invoiceId })

    const {
        vatRates,
        operationCategories,
        paymentConditions,
        fetchPaymentConditions, fetchCategories, fetchTvaRates
    } = useFetchSettings()

    const [showPreview, setShowPreview] = useState(true);

    const {
        typeAdd, openAddModal, onCloseAddModal, loadingAddModal,

        onAction, handleCreate, getTitleAddModal

    } = UseSetting()

    const { register } = form

    if (loadingEdit) {
        return (
            <PageLoader label="Chargement de facture" />
        )
    }

    return (
        <div className={`flex flex-col {${showPreview ? "overflow-y-auto" : "overflow-hidden"}`}>
            {/* ── Header ── */}
            <header className="sticky top-0 z-30 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition cursor-pointer">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            {mode === "create" ? "Création de facture client"
                                : mode === "edit" ?
                                    "Modification de facture client"
                                    : "Clone de facture client: " + invoice?.invoiceNumber}
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {mode === "create"
                                ? "Configurez les détails et prévisualisez"
                                : "Modifiez les détails et prévisualisez"}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer">
                        Annuler
                    </button>
                    <button
                        onClick={onSubmit}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition ${!canCreateInvoice
                            ? "bg-gray-300 cursor-not-allowed text-gray-500 shadow-none"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 cursor-pointer"
                            }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        {mode === "create" || mode === "clone" ? "Créer & Envoyer" : "Modifier & Envoyer"}
                    </button>

                    {/* Toggle aperçu */}
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium hover:bg-slate-50 transition"
                    >
                        {showPreview ? (
                            <>
                                <EyeOff className="h-4 w-4" />
                                Masquer aperçu
                            </>
                        ) : (
                            <>
                                <Eye className="h-4 w-4" />
                                Afficher aperçu
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Modals — inchangés */}
            <DocumentPreviewModal
                open={isModalOpen}
                onClose={onCloseDocumentModal}
                onCreateInvoice={mode == "create" || mode == "clone" ? createInvoice : updateInvoice}
                document={pdfUrl}
                loading={loadingForm}
                type="Facture"
            />
            <SendToTTNModal
                open={TtnModalOpen}
                onClose={() => { setTtnModalOpen(false); router.push("/billing/invoices/clients") }}
                onConfirm={() => { sendToTTN() }}
                loading={loadingTTN}
                invoiceSent={sent}
                emailExist={invoice?.partner?.email != ""}
                invoiceRef={previewData.invoiceNumber}
                successMessage={successMessage}
                onSendToClient={() => setSendOpen(true)} />

            <SendDocumentModal
                document={createdInvoice}
                variant="invoice"
                isOpen={sendOpen}
                onClose={() => { setSendOpen(false); onCloseDocumentModal() }}
            />
            <AddPartnerModal
                isOpen={showAddSupplierModal}
                partnerType={partnerTypeSchema.enum.CLIENT}
                onClose={() => setShowAddSupplierModal(false)}
                onSuccess={async () => { await getClients() }}
            />

            {typeAdd && <AddSettingModal
                open={openAddModal}
                title={getTitleAddModal()}
                loading={loadingAddModal}
                onClose={onCloseAddModal}
                onSubmit={handleCreate}
                onSuccess={async () => {
                    await fetchTvaRates()
                    await fetchCategories()
                    await fetchPaymentConditions()

                }}
                settingType={typeAdd}
            />}


            {/* ── Body : 2 colonnes ── */}
            <div className={`flex h-[calc(100vh-80px)] `}>

                {/* ── Colonne formulaire (66 %) ── */}
                <div className={`${showPreview ? "w-6/10 overflow-y-auto" : "mx-auto"} transition-all duration-300`}>
                    <div className="max-w-7xl mx-auto p-6 flex flex-col gap-5 ">

                        {/* Section 01 — Référence */}
                        <section>
                            <SectionTitle number="01" label="Référence" invoiceType={invoiceTypeSchema.enum.SALE} />
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-4 mt-3">

                                {/* N° Facture + Date émission sur une ligne */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>
                                            N° Facture
                                        </Label>
                                        <input
                                            readOnly
                                            disabled
                                            type="text"
                                            {...register("invoiceNumber")}
                                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition disabled:opacity-50"
                                        />
                                        <FieldError error={getError("invoiceNumber")} />
                                    </div>
                                    <div>
                                        <Label>
                                            {"Date d'émission"}
                                        </Label>
                                        <Controller
                                            control={form.control}
                                            name="issueDate"
                                            render={({ field }) => (
                                                <>
                                                    <input
                                                        type="date"
                                                        value={field.value ? (() => {
                                                            const d = new Date(field.value);
                                                            const year = d.getFullYear();
                                                            const month = String(d.getMonth() + 1).padStart(2, "0");
                                                            const day = String(d.getDate()).padStart(2, "0");
                                                            return `${year}-${month}-${day}`;
                                                        })() : ""}
                                                        onChange={(e) => {
                                                            field.onChange(new Date(e.target.value));
                                                            calculateDueDate();
                                                        }}
                                                        max={
                                                            (() => {
                                                                let poDate: Date | null = null;
                                                                if (linkedToPO && selectedPO) {
                                                                    poDate = new Date(selectedPO.issueDate);
                                                                } else {
                                                                    const editPODate = form.getValues("purchaseOrder.issueDate");
                                                                    if (editPODate) poDate = new Date(editPODate);
                                                                }
                                                                if (poDate) {
                                                                    const year = poDate.getFullYear();
                                                                    const month = String(poDate.getMonth() + 1).padStart(2, "0");
                                                                    const day = String(poDate.getDate()).padStart(2, "0");
                                                                    return `${year}-${month}-${day}`;
                                                                }
                                                            })()
                                                        }
                                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                                    />
                                                    <FieldError error={getError("issueDate")} />
                                                </>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Toggle bon de commande */}
                                {mode == "create" ? (
                                    <div className="pt-3 border-t border-slate-100">
                                        <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-semibold text-slate-500">
                                                    Lié à un bon de commande
                                                </p>
                                                <p className="text-sm text-slate-500 mt-1 leading-snug">
                                                    Les champs seront pré-remplis automatiquement depuis la commande sélectionnée.
                                                </p>
                                            </div>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={linkedToPO}
                                                    onChange={(e) => handleTogglePO(e.target.checked)}
                                                    className="w-5 h-5 rounded-xl border-2 border-slate-200 bg-white accent-blue-600 cursor-pointer transition"
                                                />
                                            </label>
                                        </div>

                                        {linkedToPO && (
                                            <div className="mt-4">
                                                <Label>
                                                    Sélectionner le bon de commande
                                                </Label>
                                                {purchaseOrders.length === 0 ? (
                                                    <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                                                        <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <p className="text-xs text-amber-800">
                                                            Aucun bon de commande disponible .
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <select
                                                            onChange={(e) => {
                                                                const po = purchaseOrders.find((p) => p.idPurchaseOrder === e.target.value);
                                                                if (po) handleSelectPO(po.idPurchaseOrder);
                                                            }}
                                                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                                        >
                                                            <option value="">-- Choisir une commande --</option>
                                                            {purchaseOrders.map((po) => (
                                                                <option key={po.idPurchaseOrder} value={po.idPurchaseOrder}>
                                                                    {po.purchaseOrderNumber} — {purchaseOrderStatusLabels[po.purchaseOrderStatus]}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : <div />}
                            </div>
                        </section>

                        {/* Section 02 — Client */}
                        <section>
                            <SectionTitle number="02" label="Client" invoiceType={invoiceTypeSchema.enum.SALE} />
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3 mt-3">
                                <div>
                                    <Label>
                                        Sélectionner un client
                                    </Label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            disabled={linkedToPO && !!selectedPO || mode == "edit"}
                                            placeholder="Rechercher un client..."
                                            value={clientSearch}
                                            onChange={(e) => { setClientSearch(e.target.value); setShowDropdown(true) }}
                                            onFocus={() => setShowDropdown(true)}
                                            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                                            className="w-full px-3 py-2.5 pr-9 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                            <svg
                                                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                        {showDropdown && clients.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                                                {clients.map((client) => (
                                                    <button
                                                        key={client.idPartner}
                                                        type="button"
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            selectClient(client);
                                                        }}
                                                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition border-b border-slate-50 last:border-0"
                                                    >
                                                        <p className="text-sm font-bold text-slate-800">{client.companyName}</p>
                                                        <p className="text-xs text-slate-400 mt-0.5">{client.billingAddress!.city}</p>
                                                    </button>
                                                ))}
                                                {/* Lien pour ajouter un fournisseur inexistant */}
                                                <button
                                                    type="button"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        setShowAddSupplierModal(true);
                                                        setShowDropdown(false);
                                                    }}
                                                    className="w-full text-left px-4 py-3 flex items-center gap-2 text-blue-600 hover:bg-blue-50 transition"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    <span className="text-sm font-medium">Ajouter un  nouveau client</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <FieldError error={getError("partner")} />
                                </div>

                                {false && previewData.partner && (
                                    <div className="border-2 border-blue-100 bg-blue-50/40 rounded-xl p-4">
                                        <div className="flex items-start justify-between mb-1">
                                            <p className="text-sm font-semibold text-slate-700">{previewData.partner!.companyName}</p>
                                            <button
                                                type="button"
                                                onClick={clearClient}
                                                disabled={linkedToPO && !!selectedPO}
                                                className="text-slate-300 hover:text-red-400 transition"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <p className="text-xs text-blue-500 mb-2">{previewData.partner?.billingAddress?.region ?? "-"}</p>

                                        {/* Email + Téléphone sur une ligne */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <span className="flex items-center gap-1.5 text-xs text-blue-500">
                                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                {previewData.partner!.email ?? "-"}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-xs text-blue-500">
                                                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                {previewData.partner!.professionnalPhoneNumber != null ? previewData.partner!.professionnalPhoneNumber : "-"}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Section 03 — Devise + Paiement (fusionnés) */}
                        <section>
                            <SectionTitle number="03" label="Devise & Paiement" invoiceType={invoiceTypeSchema.enum.SALE} />
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mt-3">
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Devise */}
                                    <div>
                                        <Label>
                                            Devise
                                        </Label>

                                        <Select
                                            key={watch("invoiceCurrency")}
                                            value={watch("invoiceCurrency") ?? ""}
                                            disabled={mode === "edit"}
                                            onValueChange={(value) => {
                                                setValue("invoiceCurrency", value as CurrencyType, {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                });
                                            }}
                                        >
                                            <SelectTrigger className="bg-slate-50">
                                                <SelectValue placeholder="Devise" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {currencyTypeSchema.options.map((currency) => (
                                                    <SelectItem key={currency} value={currency}>
                                                        {currency}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                    </div>

                                    {/* Taux de change */}
                                    <div>
                                        <Label>
                                            Taux de change
                                        </Label>
                                        <input
                                            type="text"
                                            readOnly
                                            disabled
                                            {...register("appliedExchangeRate", { valueAsNumber: true })}
                                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition disabled:opacity-50"
                                        />
                                    </div>

                                    {/* Conditions de paiement */}
                                    <div>
                                        <Label>
                                            Condition de paiement
                                        </Label>
                                        <Select value={watch("paymentCondition") ?? ""}
                                            onValueChange={(value) => {
                                                setValue("paymentCondition", value as PaymentCondition, {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                });
                                                calculateDueDate();

                                            }
                                            }>
                                            <SelectTrigger className="bg-slate-50"
                                                onAdd={() => onAction(SettingTypeSchema.enum.PAYMENT_CONDITION)}
                                            >
                                                <SelectValue placeholder="Méthode de paiement" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {paymentConditions.length === 0 ? (
                                                    <div className="px-3 py-2 text-sm text-slate-400">
                                                        Aucune condition de paiement disponible
                                                    </div>) : (
                                                    paymentConditions.map((condition) => (
                                                        <SelectItem key={condition.code} value={condition.label}>
                                                            {formatShowLabel(condition.label)}
                                                        </SelectItem>
                                                    )))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Méthode de paiement */}
                                    <div>
                                        <Label>
                                            Méthode de paiement
                                        </Label>
                                        <Select

                                            value={watch("paymentMethod") ?? ""}
                                            onValueChange={(value) =>
                                                setValue("paymentMethod", value as paymentMethod, {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                })
                                            }>
                                            <SelectTrigger className="bg-slate-50">
                                                <SelectValue placeholder="Méthode de paiement" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {paymentMethodSchema.options.map((method) => (
                                                    <SelectItem key={method} value={method}>
                                                        {paymentMethodLabels[method]}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 04 — Services */}
                        <section>
                            <div className="flex items-center justify-between">
                                <SectionTitle number="04" label="Services" invoiceType={invoiceTypeSchema.enum.SALE} />
                                <button
                                    disabled={linkedToPO && !!selectedPO || form.getValues("purchaseOrder") != null}
                                    onClick={addItem}
                                    className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex flex-col gap-3 mt-3">
                                {(previewData.invoiceItems ?? []).map((item, index) => {
                                    const lineTotal = item.quantity * item.unityPriceEXclTax;
                                    return (
                                        <div key={item.idInvoiceItem ?? index} className="rounded-xl border border-slate-200 bg-white p-4">

                                            {/* Désignation + bouton supprimer */}
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="text-xs font-medium text-slate-500">
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.idInvoiceItem!)}
                                                    className="text-slate-300 hover:text-red-400 transition"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <Input
                                                label="Désignation"
                                                readOnly={linkedToPO && !!selectedPO || invoice?.purchaseOrder != null}
                                                value={item.description}
                                                onChange={(e) =>
                                                    updateItem(item.idInvoiceItem!, "description", e.target.value)
                                                }
                                                error={getItemError(index, "description")}
                                            />



                                            {/* Catégorie */}
                                            <div className="mb-3 mt-3 space-y-2">
                                                <Label >
                                                    Catégorie
                                                </Label>
                                                <Select
                                                    value={item.operationCategory!}
                                                    disabled={linkedToPO && !!selectedPO || invoice?.purchaseOrder != null}
                                                    onValueChange={(value) =>
                                                        updateItem(
                                                            item.idInvoiceItem!,
                                                            "operationCategory",
                                                            value
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger
                                                        onAdd={() => onAction(SettingTypeSchema.enum.OPERATION_CATEGORY)}
                                                    >
                                                        <SelectValue placeholder="Sélectionner une catégorie" />
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        {operationCategories.length === 0 ? (
                                                            <div className="px-3 py-2 text-sm text-slate-400">
                                                                Aucun catégorie disponible
                                                            </div>) : (
                                                            operationCategories.map((category) => (
                                                                <SelectItem
                                                                    key={category.code}
                                                                    value={category.label}
                                                                >
                                                                    {formatShowLabel(category.label)}
                                                                </SelectItem>
                                                            )))}
                                                    </SelectContent>
                                                </Select>

                                                <FieldError
                                                    error={getItemError(index, "operationCategory")}
                                                />
                                            </div>

                                            {/* Qté | PU HT | TVA | Total HT */}
                                            <div className="grid grid-cols-3 gap-3">

                                                <Input
                                                    label="Qté"
                                                    type="number"
                                                    max={getMaxQuantity(item)}
                                                    min={1}
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        updateItem(
                                                            item.idInvoiceItem!,
                                                            "quantity",
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                    error={getItemError(index, "quantity")}
                                                />
                                                <Input
                                                    label="PU HT"
                                                    type="number"
                                                    min={0}
                                                    readOnly={linkedToPO && !!selectedPO || invoice?.purchaseOrder != null}
                                                    defaultValue={item.unityPriceEXclTax}
                                                    onBlur={(e) =>
                                                        updateItem(
                                                            item.idInvoiceItem!,
                                                            "unityPriceEXclTax",
                                                            Number(e.target.value)
                                                        )
                                                    }
                                                    error={getItemError(index, "unityPriceEXclTax")}
                                                />
                                                <div className="md-5">
                                                    <Label className="mb-3">
                                                        TVA
                                                    </Label>
                                                    <Select
                                                        value={String(item.vatRate)}
                                                        disabled={linkedToPO && !!selectedPO || invoice?.purchaseOrder != null}
                                                        onValueChange={(value) =>
                                                            updateItem(item.idInvoiceItem!, "vatRate", Number(value))
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            onAdd={() => onAction(SettingTypeSchema.enum.TVA_RATE)}
                                                        >
                                                            <SelectValue />
                                                        </SelectTrigger>

                                                        <SelectContent>
                                                            {vatRates.length === 0 ? (
                                                                <div className="px-3 py-2 text-sm text-slate-400">
                                                                    Aucun taux de TVA disponible
                                                                </div>) : (
                                                                vatRates.map((rate) => (
                                                                    <SelectItem
                                                                        key={rate.code}
                                                                        value={String(extractTvaRate(rate.label))}
                                                                    >
                                                                        {formatShowLabel(rate.label)}
                                                                    </SelectItem>
                                                                )))}
                                                        </SelectContent>
                                                    </Select>

                                                    <FieldError error={errors.invoiceItems?.[index]?.vatRate?.message} />
                                                </div>
                                                {/* Discount */}
                                                <div className="col-span-2">
                                                    <Label>
                                                        Discount
                                                    </Label>

                                                    <div className="flex gap-2">
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            value={item.discountValue ?? 0}
                                                            onChange={(e) =>
                                                                updateItem(
                                                                    item.idInvoiceItem!,
                                                                    "discountValue",
                                                                    Number(e.target.value)
                                                                )
                                                            }
                                                            className="flex-1"
                                                        />

                                                        <Select
                                                            value={item.discountType!}
                                                            onValueChange={(value) => {
                                                                updateItem(
                                                                    item.idInvoiceItem!,
                                                                    "discountType",
                                                                    value
                                                                )
                                                            }
                                                            }
                                                        >
                                                            <SelectTrigger className="w-28">
                                                                <SelectValue />
                                                            </SelectTrigger>

                                                            <SelectContent>
                                                                {discountTypeOptions.map((discountType) => (

                                                                    <SelectItem key={discountType.value} value={discountType.value}>
                                                                        {discountType.value === discountTypeSchema.enum.AMOUNT ?
                                                                            form.getValues("invoiceCurrency")
                                                                            : discountType.label}
                                                                    </SelectItem>


                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <FieldError error={errors.invoiceItems?.[index]?.discountValue?.message} />
                                                </div>
                                                <div>
                                                    <Label>Total HT</Label>
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        value={lineTotal.toFixed(2)}
                                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-700 text-center focus:outline-none transition"
                                                    />
                                                </div>

                                            </div>

                                            {item.purchaseOrderItem && (
                                                <p className="text-xs text-blue-500 mt-2">
                                                    Quantité restant à facturer : {(item.purchaseOrderItem.quantity ?? 0) - (item.purchaseOrderItem.invoicedQuantity ?? 0)}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            {errors.invoiceItems?.message && (
                                <ErrorForm error={errors.invoiceItems?.message} />
                            )}
                        </section>

                        {/* Section XX — Commentaires */}
                        <section>
                            <SectionTitle
                                number="05"
                                label="Commentaires"
                                invoiceType={invoiceTypeSchema.enum.SALE}
                            />

                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mt-3">
                                <Textarea
                                    label="Commentaires"
                                    placeholder="Ajouter un commentaire..."
                                    rows={3}
                                    value={form.watch("comment") ?? ""}
                                    onChange={(e) => form.setValue("comment", e.target.value, {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                    })}
                                    error={getError("comment")}
                                />
                            </div>
                        </section>

                    </div>
                </div>

                {/* ── Colonne preview (34 %) ── */}
                {showPreview && (
                    <div className="flex-1">
                        <InvoicePreview ref={invoiceRef} data={previewData} />
                    </div>
                )}
            </div>
        </div>
    )
}