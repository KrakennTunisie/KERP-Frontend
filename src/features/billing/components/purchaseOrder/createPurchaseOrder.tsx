"use client"

import { DocumentPreviewModal } from "@/shared/components/ui/documentPreviewModal"
import { CurrencyType, currencyTypeSchema } from "../../types/currency"
import { invoiceTypeSchema } from "../../types/invoiceType"
import { paymentMethod, paymentMethodLabels, paymentMethodSchema } from "../../types/paymentMethod"
import ErrorForm from "../widgets/errorForm"
import { SectionTitle } from "../widgets/sectionTitle"
import { PurchaseOrderFormClientProps, useCreatePurchaseOrder } from "../../hooks/useCreateEditPurchaseOrder"
import { Controller } from "react-hook-form"
import PurchaseOrderPreview from "../widgets/purchaseOrderPreview"
import { PurchaseOrder } from "../../models/purchaseOrder"
import PageLoader from "@/shared/components/ui/pageLoader"
import { useEffect, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { extractTvaRate, formatShowLabel } from "../../lib/settingItemHelpers"
import { useFetchSettings } from "../../hooks/useFetchSetting"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { SettingTypeSchema } from "../../types/settingType"
import { PaymentCondition } from "../../types/paymentCondition"
import UseSetting from "../../hooks/useSettings"
import AddSettingModal from "../parameters/addSettingItem"
import { FieldError } from "@/shared/components/ui/fieldError"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import AddPartnerModal from "../widgets/addPartnerModal"
import { partnerTypeSchema } from "../../types/partnerType"
import { discountTypeOptions, discountTypeSchema } from "../../types/discountType"

export default function CreatePurchaseOrder({
    mode,
    purchaseOrderId,
}: PurchaseOrderFormClientProps) {
    const {
        addItem,
        removeItem, updateItem, supplierSearch, setSupplierSearch, showDropdown, setShowDropdown, canCreatePurchaseOrder,
        errors, selectSupplier, clearSupplier, suppliers,
        previewData, form, onSubmit, router, isModalOpen, createPurchaseOrder, pdfUrl,
        onCloseDocumentModal, purchaseOrderRef, updatePurchaseOrder,
        loadingEdit, showAddSupplierModal,
        setShowAddSupplierModal,
        handleSupplierAdded,
        newSupplier,
        setNewSupplier,
        setNewSupplierName,
        loadingForm,
        getItemError,
        getError
    } = useCreatePurchaseOrder({ mode, purchaseOrderId })


    const { fetchCategories, fetchPaymentConditions, fetchTvaRates, operationCategories, paymentConditions, vatRates } = useFetchSettings();
    useEffect(() => {
        fetchTvaRates();
        fetchCategories();
        fetchPaymentConditions();
    }, []);

    const {
        typeAdd, openAddModal, onCloseAddModal, loadingAddModal,

        onAction, handleCreate, getTitleAddModal

    } = UseSetting()

    const [showPreview, setShowPreview] = useState(true)
    const { register, watch, setValue } = form

    if (loadingEdit) {
        return (
            <PageLoader label="Chargement de bon de commande..." />
        )
    }


    return (
        <div className={`flex flex-col bg-white min-h-screen {${showPreview ? "overflow-y-auto" : "overflow-hidden"}`}>
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
                            {mode === "create" ? "Création bon de commande"
                                :
                                "Modification bon de commande"}
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
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition ${!canCreatePurchaseOrder
                            ? "bg-gray-300 cursor-not-allowed text-gray-500 shadow-none"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 cursor-pointer"
                            }`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        {mode === "create" ? "Créer" : "Modifier"}
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
            <AddPartnerModal
                isOpen={showAddSupplierModal}
                partner={newSupplier}
                partnerType={partnerTypeSchema.enum.SUPPLIER}
                onClose={() => setShowAddSupplierModal(false)}
                onSuccess={handleSupplierAdded}
            />
            {/* Modal pour la facture générée  */}
            <DocumentPreviewModal
                open={isModalOpen}
                onClose={onCloseDocumentModal}
                onCreateInvoice={mode === "create" ? createPurchaseOrder : updatePurchaseOrder}
                document={pdfUrl}
                loading={loadingForm}
                type="Bon Commande" />

            {typeAdd && <AddSettingModal
                open={openAddModal}
                title={getTitleAddModal()}
                loading={loadingAddModal}
                onClose={onCloseAddModal}
                onSubmit={handleCreate}
                settingType={typeAdd}
                onSuccess={async () => {
                    await fetchTvaRates()
                    await fetchCategories()
                    await fetchPaymentConditions()

                }}
            />}
            {/* ── Body ── */}
            <div className="flex h-[calc(110vh-80px)]">

                {/* ── Left Panel ── */}
                <div className={`${showPreview ? "w-6/10 overflow-y-auto" : "w-full"} transition-all duration-300`}>
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

                        {/* Section 02 — fournisseur */}
                        <section>
                            <SectionTitle number="02" label="Fournisseur" invoiceType={invoiceTypeSchema.enum.SALE} />
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3 mt-3">
                                <div>
                                    <Label>
                                        Sélectionner un fournisseur
                                    </Label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Rechercher un fournisseur..."
                                            value={supplierSearch}
                                            onChange={(e) => { setSupplierSearch(e.target.value); setShowDropdown(true) }}
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
                                        {showDropdown && suppliers.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 max-h-48 overflow-y-auto">
                                                {suppliers.map((supplier) => (
                                                    <button
                                                        key={supplier.idPartner}
                                                        type="button"
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            selectSupplier(supplier);
                                                            setSupplierSearch(supplier.companyName);
                                                        }}
                                                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition border-b border-slate-50 last:border-0"
                                                    >
                                                        <p className="text-sm font-bold text-slate-800">{supplier.companyName}</p>
                                                        <p className="text-xs text-slate-400 mt-0.5">{supplier.billingAddress!.city}</p>
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
                                                    <span className="text-sm font-medium">Ajouter un  nouveau fournisseur</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <FieldError error={getError("partner")} />
                                </div>
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
                                        <Select value={watch("currency") ?? ""}
                                            disabled={mode === "edit"}
                                            onValueChange={(value) => {
                                                setValue("currency", value as CurrencyType, {
                                                    shouldValidate: true,
                                                    shouldDirty: true,
                                                });

                                            }
                                            }>
                                            <SelectTrigger className="bg-slate-50" >
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
                                            }
                                            }>
                                            <SelectTrigger className="bg-slate-50"
                                                onAdd={() => onAction(SettingTypeSchema.enum.PAYMENT_CONDITION)}
                                            >
                                                <SelectValue placeholder="Méthode de paiement" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {paymentConditions.map((condition) => (
                                                    <SelectItem key={condition.code} value={condition.label}>
                                                        {formatShowLabel(condition.label)}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Méthode de paiement */}
                                    <div>
                                        <Label>
                                            Méthode de paiement
                                        </Label>
                                        <Select value={watch("paymentMethod") ?? ""}
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
                                    const lineTotal = (item.quantity ?? 0) * (item.unityPriceEXclTax ?? 0);

                                    return ( // ✅ ajouté
                                        <div key={item.idPurchaseOrderItem ?? index} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                                            {/* Désignation + bouton supprimer */}
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="text-xs font-medium text-slate-500">
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.idPurchaseOrderItem!)}
                                                    className="text-slate-300 hover:text-red-400 transition"
                                                >
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Input désignation */}
                                            <Input
                                                label="Désignation"
                                                value={item.description}
                                                onChange={(e) =>
                                                    updateItem(item.idPurchaseOrderItem!, "description", e.target.value)
                                                }
                                                error={getItemError(index, "description")}
                                            />

                                            {/* Catégorie */}
                                            <div className="mt-3 mb-4">
                                                <Label>
                                                    Catégorie
                                                </Label>

                                                <Select
                                                    value={item.operationCategory ?? ""}
                                                    onValueChange={(value) =>
                                                        updateItem(
                                                            item.idPurchaseOrderItem!,
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
                                                        {operationCategories.map((category) => (
                                                            <SelectItem
                                                                key={category.code}
                                                                value={category.label}
                                                            >
                                                                {formatShowLabel(category.label)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FieldError
                                                    error={getItemError(index, "operationCategory")}
                                                />
                                            </div>

                                            {/* QTÉ / P.U HT / TVA */}
                                            <div className="grid grid-cols-3 gap-2">
                                                <div>
                                                    <Label>
                                                        QTÉ
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            updateItem(
                                                                item.idPurchaseOrderItem!,
                                                                "quantity",
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        error={getItemError(index, "quantity")}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>
                                                        P.U HT
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        defaultValue={item.unityPriceEXclTax}
                                                        onBlur={(e) =>
                                                            updateItem(
                                                                item.idPurchaseOrderItem!,
                                                                "unityPriceEXclTax",
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        error={getItemError(index, "unityPriceEXclTax")}
                                                    />
                                                </div>
                                                <div>
                                                    <Label>
                                                        TVA %
                                                    </Label>
                                                    <Select
                                                        value={String(item.vatRate)}
                                                        onValueChange={(value) =>
                                                            updateItem(item.idPurchaseOrderItem!, "vatRate", Number(value))
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            onAdd={() => onAction(SettingTypeSchema.enum.TVA_RATE)}
                                                        >
                                                            <SelectValue />
                                                        </SelectTrigger>

                                                        <SelectContent>
                                                            {vatRates.map((rate) => (
                                                                <SelectItem
                                                                    key={rate.code}
                                                                    value={String(extractTvaRate(rate.label))}
                                                                >
                                                                    {formatShowLabel(rate.label)}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>

                                                    <FieldError error={errors.purchaseOrderItems?.[index]?.vatRate?.message} />
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
                                                                    item.idPurchaseOrderItem!,
                                                                    "discountValue",
                                                                    Number(e.target.value)
                                                                )
                                                            }
                                                            className="flex-1"
                                                        />

                                                        <Select
                                                            value={item.discountType ?? "PERCENTAGE"}
                                                            onValueChange={(value) =>
                                                                updateItem(
                                                                    item.idPurchaseOrderItem!,
                                                                    "discountType",
                                                                    value
                                                                )
                                                            }
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
                                        </div>
                                    );
                                })}
                            </div>
                            {errors.purchaseOrderItems?.message && (
                                <ErrorForm error={errors.purchaseOrderItems?.message} />
                            )}
                        </section>
                    </div>
                </div>
                {showPreview && (
                    <div className="flex-1">
                        <PurchaseOrderPreview ref={purchaseOrderRef} data={previewData as PurchaseOrder} />
                    </div>
                )}
            </div>
        </div>
    )
}