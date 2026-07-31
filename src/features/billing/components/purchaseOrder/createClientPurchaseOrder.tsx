"use client";

import { SectionTitle } from "../widgets/sectionTitle";
import { OperationCategoryLabels, operationCategorySchema } from "../../types/operationCategory";
import { tvaRateSchema } from "../../types/tvaRate";
import ErrorForm from "../widgets/errorForm";
import { invoiceTypeSchema } from "../../types/invoiceType";
import { paymentMethodLabels, paymentMethodSchema } from "../../types/paymentMethod";
import { PaymentConditionSchema } from "../../types/paymentCondition";
import { currencyTypeSchema } from "../../types/currency";
import { purchaseOrderStatusLabels } from "../../types/purchaseOrderStatus";
import { Controller } from "react-hook-form";
import useCreateSupplierInvoice from "../../hooks/useCreateSupplierInvoice";
import { DocumentViewer } from "@/shared/components/ui/DocumentViewer";
import AddPartnerModal from "../widgets/addPartnerModal";
import { partnerTypeSchema } from "../../types/partnerType";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { FieldError } from "@/shared/components/ui/fieldError";
import { discountTypeOptions, discountTypeSchema } from "../../types/discountType";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textArea";
import AddSettingModal from "../parameters/addSettingItem";
import { Plus, TriangleAlert } from "lucide-react";
import { SettingTypeSchema } from "../../types/settingType";
import { extractTvaRate, formatShowLabel } from "../../lib/settingItemHelpers";
import { useRouter } from "next/navigation";
import UseSetting from "../../hooks/useSettings";
import { useFetchSettings } from "../../hooks/useFetchSetting";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import * as Popover from "@radix-ui/react-popover";
import * as HoverCard from "@radix-ui/react-hover-card";
import { useEffect } from "react";
import useCreateClientPurchaseOrder from "../../hooks/useCreateClientPurchaseOrder";


export default function CreateClientPurchaseOrder() {
    const {
        form, errors, linkedToPO, selectedPO, suppliers, supplierSearch, setSupplierSearch, showDropdown, setShowDropdown, previewData, getError,
        clientPurchaseOrder, handleSave, selectSupplier, clearSupplier, loadingSave, addItem, removeItem, updateItem, register, supplierExist, handleSupplierAdded,
        TVAExist, getItemError, setLinkedToPO, newSupplier, newTvaExist, setNewTvaExist, setTVAExist
        , clientPurchaseOrderType, loadingDraft, showAddSupplierModal, setShowAddSupplierModal, setNewSupplierName } = useCreateClientPurchaseOrder();
    const router = useRouter();
    const { fetchCategories, fetchPaymentConditions, fetchTvaRates, operationCategories, paymentConditions, vatRates } = useFetchSettings();
    useEffect(() => {
        fetchTvaRates();
        fetchCategories();
        fetchPaymentConditions();
    }, []);
    const { typeAdd, openAddModal, setOpenAddModal, loadingAddModal, onAction, handleCreate, getTitleAddModal } = UseSetting()

    if (loadingDraft || !clientPurchaseOrder) {
        return (
            <div className="flex items-center justify-center bg-white  h-[calc(100vh-80px)]">
                <p className="text-sm text-slate-400">Chargement de la facture extraite...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col overflow-hidden  bg-white min-h-screen">
            {/* ── Header ── */}
            <header className="sticky top-0 z-30 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            Validation du bon de commande client
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Contrôlez les données extraites face au document original avant enregistrement
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
                    >
                        Annuler
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={loadingSave}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition ${loadingSave
                            ? "bg-gray-300 cursor-not-allowed text-gray-500 shadow-none"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 cursor-pointer"
                            }`}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        {loadingSave ? "Enregistrement..." : "Valider & Enregistrer"}
                    </button>
                </div>
            </header>

            <AddPartnerModal
                isOpen={showAddSupplierModal}
                partner={newSupplier}
                partnerType={partnerTypeSchema.enum.CLIENT}
                onClose={() => setShowAddSupplierModal(false)}
                onSuccess={handleSupplierAdded}
            />

            {typeAdd && <AddSettingModal
                open={openAddModal}
                title={getTitleAddModal()}
                loading={loadingAddModal}
                newLabel={newTvaExist}
                onClose={() => setOpenAddModal(false)}
                onSubmit={handleCreate}
                onSuccess={async () => {
                    await fetchTvaRates()
                    await fetchCategories()
                    await fetchPaymentConditions()
                    setNewTvaExist("")
                    setTVAExist(true)
                }}
                settingType={typeAdd}
            />}

            {/* ── Body : 2 colonnes ── */}
            <div className="flex h-[calc(100vh-80px)]">

                {/* ── Colonne formulaire (60 %) ── */}
                <div className="w-3/5 overflow-y-auto">
                    <div className="max-w-4xl mx-auto p-6 flex flex-col gap-5">

                        {/* Bandeau d'alerte extraction */}
                        <div className="flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 px-4 py-3">
                            <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                            <p className="text-xs text-amber-700 leading-relaxed">
                                Ces champs ont été pré-remplis automatiquement à partir du document. Vérifiez chaque valeur en la comparant au document affiché à droite avant de valider.
                            </p>
                        </div>
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
                                            type="text"
                                            {...register("purchaseOrderNumber")}
                                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                        />
                                    </div>

                                    <div className="grid grid-cols gap-3">
                                        <div>
                                            <Label >
                                                Date de livraison
                                            </Label>
                                            <Controller
                                                control={form.control}
                                                name="issueDate"
                                                render={({ field }) => (
                                                    <input
                                                        type="date"
                                                        value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                                                        onChange={(e) => {
                                                            field.onChange(new Date(e.target.value)); // ← Date object
                                                        }}
                                                        min={new Date().toISOString().split("T")[0]}
                                                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                                    />
                                                )}
                                            />
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </section>

                        {/* Section 02 — client */}
                        <section>
                            <SectionTitle number="02" invoiceType={invoiceTypeSchema.enum.PURCHASE} label="Client" />
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3 mt-3">
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mb-1">
                                        Sélectionner un client

                                        {!supplierExist && (
                                            <HoverCard.Root openDelay={150} closeDelay={200}>
                                                <HoverCard.Trigger asChild>
                                                    <button type="button">
                                                        <TriangleAlert className="h-4 w-4 text-amber-500" />
                                                    </button>
                                                </HoverCard.Trigger>

                                                <HoverCard.Portal>
                                                    <HoverCard.Content
                                                        side="right"
                                                        align="start"
                                                        className="w-64 rounded-lg border border-amber-200 bg-amber-50 p-3 shadow-lg"
                                                    >
                                                        <div className="flex items-start gap-2">
                                                            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />

                                                            <div>
                                                                <p className="text-sm text-amber-900">
                                                                    Aucun client correspondant à <strong>"{supplierSearch}"</strong>.
                                                                </p>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => setShowAddSupplierModal(true)}
                                                                    className="mt-2 text-sm font-medium text-amber-700 hover:text-amber-800 hover:underline"
                                                                >
                                                                    Ajouter ce client
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </HoverCard.Content>
                                                </HoverCard.Portal>
                                            </HoverCard.Root>
                                        )}
                                    </label>
                                    <div className="relative mt-3.5">
                                        <input
                                            type="text"
                                            placeholder="Rechercher un client..."
                                            value={supplierSearch}
                                            onChange={(e) => { setSupplierSearch(e.target.value); setShowDropdown(true); }}
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
                                        {showDropdown && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                                                {suppliers.map((supplier) => (
                                                    <button
                                                        key={supplier.idPartner}
                                                        type="button"
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            selectSupplier(supplier);
                                                            setSupplierSearch(supplier.companyName);
                                                            form.setValue("partner", supplier, { shouldValidate: true });
                                                        }}
                                                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition border-b border-slate-50 last:border-0"
                                                    >
                                                        <p className="text-sm font-bold text-slate-800">{supplier.companyName}</p>
                                                    </button>
                                                ))}
                                                {/* Lien pour ajouter un fournisseur inexistant */}
                                                <button
                                                    type="button"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        setNewSupplierName(supplierSearch);
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
                                {/* supplier sélectionné */}

                            </div>
                        </section>

                        {/* Section 03 — Devise & Paiement */}
                        <section>
                            <SectionTitle number="03" invoiceType={invoiceTypeSchema.enum.PURCHASE} label="Devise & Paiement" />
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mt-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Devise</label>
                                        <select
                                            {...register("currency")}
                                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition disabled:opacity-50"
                                        >
                                            {currencyTypeSchema.options.map((currency) => (
                                                <option key={currency} value={currency}>{currency}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Taux de change</label>
                                        <input
                                            type="text"
                                            {...register("appliedExchangeRate", { valueAsNumber: true })}
                                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Condition de paiement</label>
                                        <Controller
                                            control={form.control}
                                            name="paymentCondition"
                                            render={({ field }) => (
                                                <Select
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger
                                                        className="bg-slate-50"
                                                        onAdd={() => onAction(SettingTypeSchema.enum.PAYMENT_CONDITION)}
                                                    >
                                                        <SelectValue placeholder="Condition de paiement" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {paymentConditions.length === 0 ? (
                                                            <div className="px-3 py-2 text-sm text-slate-400">
                                                                Aucune condition de pour le moment
                                                            </div>
                                                        ) : (
                                                            paymentConditions.map((condition) => (
                                                                <SelectItem key={condition.label} value={condition.label}>
                                                                    {formatShowLabel(condition.label)}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />

                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-slate-500 mb-1">Méthode de paiement</label>
                                        <select
                                            {...register("paymentMethod")}
                                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                        >
                                            {paymentMethodSchema.options.map((method) => (
                                                <option key={method} value={method}>{paymentMethodLabels[method]}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 04 — Services */}
                        <section>
                            <div className="flex items-center justify-between">
                                <SectionTitle number="04" invoiceType={invoiceTypeSchema.enum.PURCHASE} label="Services" />
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-200 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex flex-col gap-3 mt-3">
                                {(previewData.purchaseOrderItems ?? []).map((item, index) => {
                                    return (
                                        <div key={item.idPurchaseOrderItem ?? index} className="rounded-xl border border-slate-200 bg-white p-4">
                                            <div className="flex items-center justify-between mb-1">
                                                <label className="text-xs font-medium text-slate-500">Désignation</label>
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.idPurchaseOrderItem!)}
                                                    className="text-slate-300 hover:text-red-400 transition"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <Input
                                                type="text"
                                                value={item.description}
                                                onChange={(e) => updateItem(item.idPurchaseOrderItem!, "description", e.target.value)}
                                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition mb-3"
                                                error={getItemError(index, "description")}
                                            />

                                            <div className="mb-3">
                                                <label className="block text-xs font-medium text-slate-500 mb-1">Catégorie</label>
                                                <Select
                                                    value={item.operationCategory || undefined}
                                                    onValueChange={(value) => {
                                                        if (value === "__add_category__") {
                                                            onAction(SettingTypeSchema.enum.OPERATION_CATEGORY);
                                                            return;
                                                        }
                                                        updateItem(item.idPurchaseOrderItem!, "operationCategory", value);
                                                    }}
                                                >
                                                    <SelectTrigger
                                                        onAdd={() => onAction(SettingTypeSchema.enum.OPERATION_CATEGORY)}
                                                    >
                                                        <SelectValue placeholder="Sélectionner une catégorie" />
                                                    </SelectTrigger>

                                                    <SelectContent>
                                                        {operationCategories.length === 0 ? (
                                                            <div className="px-3 py-2 text-sm text-slate-400">
                                                                Aucune catégorie pour le moment
                                                            </div>
                                                        ) : (
                                                            operationCategories.map((category) => (
                                                                <SelectItem
                                                                    key={category.code}
                                                                    value={category.label}
                                                                >
                                                                    {category.label}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FieldError error={getItemError(index, "operationCategory")} />
                                            </div>

                                            <div className="grid grid-cols-3 gap-3">
                                                <Input
                                                    label="Qté"
                                                    type="number"
                                                    min={1}
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(item.idPurchaseOrderItem!, "quantity", Number(e.target.value))}
                                                    error={getItemError(index, "quantity")}
                                                />

                                                <Input
                                                    label="PU HT"
                                                    type="number"
                                                    min={0}
                                                    defaultValue={item.unityPriceEXclTax}
                                                    onBlur={(e) => updateItem(item.idPurchaseOrderItem!, "unityPriceEXclTax", Number(e.target.value))}
                                                    error={getItemError(index, "unityPriceEXclTax")}
                                                />

                                                <div className="space-y-3">
                                                    <div className="mb-3 flex items-center gap-2">
                                                        <label className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                                            TVA
                                                        </label>

                                                        {!TVAExist && (
                                                            <div className="group relative flex items-center">

                                                                <HoverCard.Root openDelay={150} closeDelay={200}>
                                                                    <HoverCard.Trigger asChild>
                                                                        <button type="button">
                                                                            <TriangleAlert className="h-4 w-4 text-amber-500" />
                                                                        </button>
                                                                    </HoverCard.Trigger>

                                                                    <HoverCard.Portal>
                                                                        <HoverCard.Content
                                                                            side="right"
                                                                            align="start"
                                                                            className="w-64 rounded-lg border border-amber-200 bg-amber-50 p-3 shadow-lg"
                                                                        >
                                                                            <div className="flex items-start gap-2">
                                                                                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />

                                                                                <div>
                                                                                    <p className="text-sm text-amber-900">
                                                                                        Aucun taux de TVA correspondant à <strong>{item.vatRate}%</strong>.
                                                                                    </p>

                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => onAction(SettingTypeSchema.enum.TVA_RATE)}
                                                                                        className="mt-2 text-sm font-medium text-amber-700 hover:text-amber-800 hover:underline"
                                                                                    >
                                                                                        Ajouter ce taux
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </HoverCard.Content>
                                                                    </HoverCard.Portal>
                                                                </HoverCard.Root>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <Select
                                                        value={item.vatRate != null ? String(item.vatRate) : undefined}
                                                        onValueChange={(value) => {
                                                            updateItem(item.idPurchaseOrderItem!, "vatRate", Number(value))
                                                        }
                                                        }
                                                    >

                                                        <SelectTrigger
                                                            id="vatRate"
                                                            onAdd={() => onAction(SettingTypeSchema.enum.TVA_RATE)}
                                                        >
                                                            <SelectValue placeholder="Choisir la TVA" />
                                                        </SelectTrigger>

                                                        <SelectContent>
                                                            {vatRates.length === 0 ? (
                                                                <div className="px-3 py-2 text-sm text-slate-400">
                                                                    Aucune valeur TVA pour le moment
                                                                </div>) : (
                                                                vatRates.map((rate) => (
                                                                    <SelectItem key={rate.code} value={String(extractTvaRate(rate.label))}>
                                                                        {formatShowLabel(rate.label)}
                                                                    </SelectItem>
                                                                ))
                                                            )}
                                                        </SelectContent>
                                                    </Select>

                                                    <FieldError error={errors.purchaseOrderItems?.[index]?.vatRate?.message} />
                                                </div>
                                                <div>
                                                    <Input
                                                        label="Total HT"
                                                        type="number"
                                                        min={0}
                                                        defaultValue={item.itemTotalExclTax}
                                                        disabled={true}
                                                        error={getItemError(index, "itemTotalExclTax")}
                                                    />
                                                </div>

                                                <div className="col-span-2">
                                                    <label className="mb-3 block text-xs font-medium uppercase tracking-wide text-slate-500">(%)</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            value={item.discountValue ?? 0}
                                                            onChange={(e) => updateItem(item.idPurchaseOrderItem!, "discountValue", Number(e.target.value))}
                                                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition mb-3"
                                                        />
                                                        <Select
                                                            value={item.discountType ?? "PERCENTAGE"}
                                                            onValueChange={(value) => updateItem(item.idPurchaseOrderItem!, "discountType", value)}
                                                        >
                                                            <SelectTrigger className="w-28">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {discountTypeOptions.map((discountType) => (
                                                                    <SelectItem key={discountType.value} value={discountType.value}>
                                                                        {discountType.value === discountTypeSchema.enum.AMOUNT
                                                                            ? form.getValues("currency")
                                                                            : discountType.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <FieldError error={errors.purchaseOrderItems?.[index]?.discountValue?.message} />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {errors.purchaseOrderItems?.message && (
                                <ErrorForm error={errors.purchaseOrderItems?.message} />
                            )}
                        </section>


                        {/* Section 05 — Totaux */}

                        <section>
                            <div className="flex flex-col gap-3">
                                <SectionTitle number="05" invoiceType={invoiceTypeSchema.enum.PURCHASE} label="Totaux" />

                                <div className="border border-slate-200 rounded-2xl p-4 bg-white">
                                    <div className="flex flex-col gap-4">
                                        <Input
                                            label="Total TTC"
                                            type="number"
                                            min={0}
                                            {...register("totalInclTax")}
                                            disabled={true}
                                            className="disabled:bg-slate-50 disabled:text-slate-700 disabled:opacity-100 disabled:font-semibold disabled:cursor-not-allowed"
                                        />

                                        <Input
                                            label="Total THT"
                                            type="number"
                                            min={0}
                                            {...register("totalExclTax")}
                                            disabled={true}
                                            className="disabled:bg-slate-50 disabled:text-slate-700 disabled:opacity-100 disabled:font-semibold disabled:cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* ── Colonne document réel (40 %) ── */}
                <div className="w-2/5">
                    <DocumentViewer fileUrl={clientPurchaseOrder} fileType={clientPurchaseOrderType?.type === "application/pdf" ? "pdf" : "image"} />
                </div>
            </div>
        </div>
    );
}