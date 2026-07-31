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
import { Plus } from "lucide-react";
import { SettingTypeSchema } from "../../types/settingType";
import { formatShowLabel } from "../../lib/settingItemHelpers";
import { useRouter } from "next/navigation";
import UseSetting from "../../hooks/useSettings";


export default function CreateSupplierInvoice() {
  const {
    form, errors, linkedToPO, selectedPO, suppliers, supplierSearch, setSupplierSearch, showDropdown, setShowDropdown, previewData, purchaseOrders, getMaxQuantity, getError,
    invoiceSupplier, handleSave, selectSupplier, clearSupplier, loadingSave, addItem, removeItem, updateItem, register, showAddPCModal, supplierExist, handleSupplierAdded,
    setShowAddPCModal, showAddTVAModal, setShowAddTVAModal, showAddOPCModal, setShowAddOPCModal, handleAddOption, getItemError, setLinkedToPO, newSupplier
    , invoiceSupplierType, loadingDraft, showAddSupplierModal, setShowAddSupplierModal, supplierSummary, setNewSupplierName } = useCreateSupplierInvoice();
  const router = useRouter();

  const {
    typeAdd, openAddModal, setOpenAddModal, loadingAddModal,

    onAction, handleCreate, getTitleAddModal

  } = UseSetting()

  if (loadingDraft || !invoiceSupplier) {
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
              Validation de la facture fournisseur
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
        partnerType={partnerTypeSchema.enum.SUPPLIER}
        onClose={() => setShowAddSupplierModal(false)}
        onSuccess={handleSupplierAdded}
      />
      {/*       <AddSettingModal
        title="Condition de paiement"
        open={showAddPCModal}
        loading={true}
        onClose={() => setShowAddPCModal(false)}
        onSubmit={() => handleAddOption}
      />
      <AddSettingModal
        title="TVA"
        open={showAddTVAModal}
        loading={true}
        onClose={() => setShowAddTVAModal(false)}
        onSubmit={() => handleAddOption}
      />
      <AddSettingModal
        title="Catégorie"
        open={showAddOPCModal}
        loading={true}
        onClose={() => setShowAddOPCModal(false)}
        onSubmit={() => handleAddOption}
      /> */}

      {typeAdd && <AddSettingModal
        open={openAddModal}
        title={getTitleAddModal()}
        loading={loadingAddModal}
        onClose={() => setOpenAddModal(false)}
        onSubmit={handleCreate}
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
              <SectionTitle number="01" invoiceType={invoiceTypeSchema.enum.PURCHASE} label="Référence" />
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-4 mt-3">
                <div className="grid  gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      N° Facture
                    </label>
                    <input
                      type="text"
                      {...register("invoiceNumber")}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      {"Date d'émission"}
                    </label>
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
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                          />
                          <FieldError error={getError("issueDate")} />
                        </>
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">
                      {"Date d'échéance"}
                    </label>
                    <Controller
                      control={form.control}
                      name="dueDate"
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
                            onChange={(e) => field.onChange(new Date(e.target.value))}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                          />
                          <FieldError error={getError("dueDate")} />
                        </>
                      )}
                    />
                  </div>
                </div>

                {/* Toggle bon de commande */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-500">
                        Lié à un bon de commande
                      </p>
                      <p className="text-sm text-slate-500 mt-1 leading-snug">
                        Les champs seront rapprochés automatiquement de la commande sélectionnée.
                      </p>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={linkedToPO}
                        onChange={(e) => { setLinkedToPO(!linkedToPO) }}
                        className="w-5 h-5 rounded-xl border-2 border-slate-200 bg-white accent-blue-600 cursor-pointer transition"
                      />
                    </label>
                  </div>

                  {linkedToPO && (
                    <div className="mt-4">
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        Sélectionner le bon de commande
                      </label>
                      <select
                        onChange={(e) => {
                          const po = purchaseOrders.find((p) => p.idPurchaseOrder === e.target.value);

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

                      {selectedPO && (
                        <div className="mt-3 bg-blue-50/50 border border-blue-100 rounded-xl p-3 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-blue-700 truncate">{selectedPO.purchaseOrderNumber}</p>
                            <p className="text-xs text-blue-500 mt-0.5 truncate">{selectedPO.partner?.partnerName}</p>
                          </div>
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide bg-blue-100 px-2.5 py-1 rounded-full">
                            {selectedPO.purchaseCurrency}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Section 02 — Fournisseur */}
            <section>
              <SectionTitle number="02" invoiceType={invoiceTypeSchema.enum.PURCHASE} label="Fournisseur" />
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3 mt-3">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    Sélectionner un fournisseur
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher un fournisseur..."
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
                          <span className="text-sm font-medium">Ajouter "{supplierSearch}" comme nouveau fournisseur</span>
                        </button>
                      </div>


                    )}
                  </div>
                  <FieldError error={getError("partner")} />
                </div>
                {/* supplier sélectionné */}
                {previewData.partner && supplierExist && (
                  <div className="border-2 border-blue-100 bg-blue-50/40 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-semibold text-slate-700">{previewData.partner.companyName}</p>
                      <button
                        type="button"
                        onClick={clearSupplier}
                        className="text-slate-300 hover:text-red-400 transition"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-blue-500 mb-2">{previewData.partner?.billingAddress?.street1 ?? "-"}</p>

                    {/* Email + Téléphone sur une ligne */}
                    <div className="grid grid-cols-2 gap-4">
                      <span className="flex items-center gap-1.5 text-xs text-blue-500">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {previewData.partner.email ?? "-"}
                      </span>
                      {previewData.partner.professionnalPhoneNumber && <span className="flex items-center gap-1.5 text-xs text-blue-500">
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {previewData.partner.professionnalPhoneNumber != null ? previewData.partner.professionnalPhoneNumber : "-"}
                      </span>}
                    </div>
                  </div>
                )}

                {!supplierExist && (

                  <div className="flex items-center justify-between gap-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                        <svg
                          className="h-5 w-5 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m0 3.75h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          Fournisseur introuvable
                        </p>
                        <p className="text-xs text-slate-500">
                          Créez <span className="font-medium">"{supplierSearch}"</span> pour continuer.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddSupplierModal(true)}
                      className="
                        flex h-7 w-7 items-center justify-center
                        rounded-full
                        bg-blue-600
                        text-white
                        shadow-sm
                        transition-all
                        hover:bg-blue-800
                        hover:scale-105
                        active:scale-95
                        "
                      title="Ajouter un fournisseur"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                )}
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
                      {...register("invoiceCurrency")}
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
                    <Select
                      {...register("paymentCondition")}
                      onValueChange={(value) => {
                        if (value === "__add_pc__") {
                          onAction(SettingTypeSchema.enum.PAYMENT_CONDITION)
                          return;
                        }
                      }}
                      defaultValue={PaymentConditionSchema.enum.NET_15}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Sélectionner une condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {PaymentConditionSchema.options.map((condition) => (
                          <SelectItem key={condition} value={condition}>
                            {formatShowLabel(condition)}
                          </SelectItem>
                        ))}
                        <SelectItem
                          value="__add_pc__"
                          className="mt-1 cursor-pointer border-t border-slate-100 text-sm font-medium text-blue-600 hover:bg-blue-50 focus:bg-blue-50"
                        >
                          + Ajouter une condition de paiement
                        </SelectItem>
                      </SelectContent>
                    </Select>

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
                {(previewData.invoiceItems ?? []).map((item, index) => {
                  return (
                    <div key={item.idInvoiceItem ?? index} className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-slate-500">Désignation</label>
                        <button
                          type="button"
                          onClick={() => removeItem(item.idInvoiceItem!)}
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
                        onChange={(e) => updateItem(item.idInvoiceItem!, "description", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition mb-3"
                        error={getItemError(index, "description")}
                      />

                      <div className="mb-3">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Catégorie</label>
                        <Select
                          value={item.operationCategory!}
                          onValueChange={(value) => {
                            if (value === "__add_category__") {
                              onAction(SettingTypeSchema.enum.OPERATION_CATEGORY);
                              return;
                            }
                            updateItem(item.idInvoiceItem!, "operationCategory", value);
                          }}
                        >
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Sélectionner une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            {operationCategorySchema.options.map((value) => (
                              <SelectItem key={value} value={value}>
                                {OperationCategoryLabels[value]}
                              </SelectItem>
                            ))}
                            <SelectItem
                              value="__add_category__"
                              className="mt-1 cursor-pointer border-t border-slate-100 text-sm font-medium text-blue-600 hover:bg-blue-50 focus:bg-blue-50"
                            >
                              + Ajouter une catégorie
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FieldError
                          error={getItemError(index, "operationCategory")}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <Input
                          label="Qté"
                          type="number"
                          max={getMaxQuantity(item)}
                          min={1}
                          value={item.quantity}
                          onChange={(e) => updateItem(item.idInvoiceItem!, "quantity", Number(e.target.value))}
                          error={getItemError(index, "quantity")}
                        />

                        <Input
                          label="PU HT"
                          type="number"
                          min={0}
                          defaultValue={item.unityPriceEXclTax}
                          onBlur={(e) => updateItem(item.idInvoiceItem!, "unityPriceEXclTax", Number(e.target.value))}
                          error={getItemError(index, "unityPriceEXclTax")}
                        />

                        <div>
                          <label className="block text-xs font-medium text-slate-500 mb-1">TVA</label>
                          <Select
                            value={String(item.vatRate)}
                            onValueChange={(value) => {
                              if (value === "__add_tva__") {
                                onAction(SettingTypeSchema.enum.TVA_RATE);
                                return;
                              }
                              updateItem(item.idInvoiceItem!, "vatRate", Number(value))
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {tvaRateSchema.options.map((rate) => (
                                <SelectItem key={rate.value} value={String(rate.value)}>
                                  {rate.value}%
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldError error={errors.invoiceItems?.[index]?.vatRate?.message} />
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
                          <label className="block text-xs font-medium text-slate-500 mb-1">Discount</label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min={0}
                              value={item.discountValue ?? 0}
                              onChange={(e) => updateItem(item.idInvoiceItem!, "discountValue", Number(e.target.value))}
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition mb-3"
                            />
                            <Select
                              value={item.discountType ?? "PERCENTAGE"}
                              onValueChange={(value) => updateItem(item.idInvoiceItem!, "discountType", value)}
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {discountTypeOptions.map((discountType) => (
                                  <SelectItem key={discountType.value} value={discountType.value}>
                                    {discountType.value === discountTypeSchema.enum.AMOUNT
                                      ? form.getValues("invoiceCurrency")
                                      : discountType.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <FieldError error={errors.invoiceItems?.[index]?.discountValue?.message} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {errors.invoiceItems?.message && (
                <ErrorForm error={errors.invoiceItems?.message} />
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

            {/* Section 06 — Commentaires */}
            <section>
              <SectionTitle number="06" invoiceType={invoiceTypeSchema.enum.PURCHASE} label="Commentaires" />
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mt-3">
                <Textarea
                  value={form.watch("comment") ?? ""}
                  onChange={(e) => form.setValue("comment", e.target.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })}
                  error={getError("comment")}
                  placeholder="Ajouter un commentaire..."
                  className="w-full min-h-[100px] px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition resize-y"
                />
              </div>
            </section>

          </div>
        </div>

        {/* ── Colonne document réel (40 %) ── */}
        <div className="w-2/5">
          <DocumentViewer fileUrl={invoiceSupplier} fileType={invoiceSupplierType?.type === "application/pdf" ? "pdf" : "image"} />
        </div>
      </div>
    </div>
  );
}