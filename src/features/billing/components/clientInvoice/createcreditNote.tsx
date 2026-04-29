"use client"
import { FileX, ShieldCheck} from 'lucide-react';
import InvoicePreview from '../widgets/invoicePreview';
import useCreateCreditNote from '../../hooks/useCreateCreditNote';
import { SectionTitle } from '../widgets/sectionTitle';
import { tvaRateSchema } from '../../types/tvaRate';
import { invoiceTypeSchema } from '../../types/invoiceType';
import { creditNoteTypeLabels, CreditNoteTypeSchema } from '../../types/creditNoteType';
import SummaryOriginalInvoice from '../widgets/summaryOriginalInvoice';
import ErrorForm from '../widgets/errorForm';
import { DocumentPreviewModal } from '@/shared/components/ui/documentPreviewModal';
import { SendToTTNModal } from '../widgets/ttnConfirmationModal';
import { InvoiceDetailsProps } from '../../hooks/useClientInvoiceDetails';

export function CreateCreditNote({invoiceId}: InvoiceDetailsProps) {
    const { previewData, form, removeItem, addItem, updateItem, onSubmit, onCloseDocumentModal, createCreditNoteInvoice,
        setItemSearchMap, setShowDropdownMap, itemSearchMap, showDropdownMap, creditNoteItemMap, setCreditNoteItemMap, filteredItems, fields,
        canCreateInvoice, invoiceRef, isModalOpen, TtnModalOpen, setTtnModalOpen, pdfUrl, loadingForm, loadingInvoice, loadingTTN, successMessage, 
        sent, sendToTTN, router, errors } = useCreateCreditNote({invoiceId});
    const { register } = form
    return (
        <div className="flex-1 flex flex-col min-h-0 bg-white">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 px-8 py-6 sticky top-0 z-10">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center  gap-6">
                         <button
                          onClick={() => router.back()}
                          className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path d="M19 12H5M12 5l-7 7 7 7" />
                          </svg>
                      </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <FileX className="w-8 h-8 text-rose-600" />
                                <h1 className="text-xl font-black text-gray-900 tracking-tighter">{"Créer une Facture d'Avoir"}</h1>
                            </div>
                            <p className="text-sm font-medium text-gray-500 mt-1">{"Référence facture originale : "}{previewData.originalInvoice?.invoiceNumber}</p>
                        </div>
                    </div>

                    <button
                        onClick={onSubmit}
                        disabled={!canCreateInvoice}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition ${!canCreateInvoice
                            ? "bg-gray-300 cursor-not-allowed text-gray-500 shadow-none"
                            : "bg-red-600 hover:bg-red-700 text-white shadow-red-200 cursor-pointer"
                            }`}>
                        <ShieldCheck className="w-4 h-4" />
                        {"Créer & Envoyer à TTN"}
                    </button>
                </div>
            </header>
            {/* Modal pour la facture générée  */}
            <DocumentPreviewModal
                open={isModalOpen}
                onClose={onCloseDocumentModal}
                onCreateInvoice={createCreditNoteInvoice}
                document={pdfUrl}
                loading={loadingForm}
                type='Facture'
                 />
            {/* Modal pour demander au user s'il veut envoyer la Facture au TTN */}
            <SendToTTNModal
                open={TtnModalOpen}
                onClose={() => setTtnModalOpen(false)}
                onConfirm={() => { sendToTTN() }}
                loading={loadingTTN}
                invoiceSent={sent}
                invoiceRef={previewData.invoiceCreditNoteNumber}
                successMessage={successMessage} />


            {/* Main Content - Two Column Layout */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto">

                    <SummaryOriginalInvoice data={previewData} />
                    {/* Two Column Grid: Form + Preview */}
                    <div className="grid grid-cols-3 gap-8">

                        {/* LEFT COLUMN: Form Fields */}
                        <div className="col-span-1 space-y-8">

                            {/* Credit Note Form */}
                            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm space-y-8">

                                {/* Section 1: Informations Avoir */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-black">01</span>
                                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Informations Avoir</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    N° Avoir
                                                </label>
                                            </div>
                                            <input
                                                readOnly
                                                type="text"
                                                {...register("invoiceCreditNoteNumber")}
                                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{"Date d'émission"}</label>
                                            <input
                                                type="date"
                                                {...register("issueDate", { valueAsDate: true })}
                                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Motif et Cause */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center text-xs font-black">02</span>
                                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Motif</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{"Motif de l'avoir "}</label>
                                            <select
                                                {...register("motif")}
                                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                            >
                                                {CreditNoteTypeSchema.options.map((type) => (
                                                    <option key={type} value={type}>{creditNoteTypeLabels[type]}</option>
                                                ))}

                                            </select>
                                        </div>
                                    </div>
                                </div>
                                {/* Section 03 — services */}
                                <section>
                                    <div className="flex items-center justify-between">
                                        <SectionTitle number="03" label="SERVICES" invoiceType={invoiceTypeSchema.enum.CREDITNOTE} />
                                        <button
                                            onClick={addItem}
                                            className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-md shadow-blue-200 transition"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-3 mt-3">
                                        {fields.map((field, index) => (
                                            <div key={field.idCreditNoteItem} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">

                                                <div className="flex items-center justify-between">
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        {"Sélectionner un produit"}
                                                    </label>
                                                    <button
                                                        onClick={() => removeItem(field.idCreditNoteItem)}
                                                        className="text-slate-300 hover:text-red-400 transition"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>

                                                {/* Dropdown */}
                                                <div className="relative" key={field.idCreditNoteItem}>
                                                    <input
                                                        type="text"
                                                        readOnly
                                                        placeholder="Sélectionner un produit..."
                                                        value={itemSearchMap[index] || ""}
                                                        onChange={(e) => {
                                                            setItemSearchMap((prev) => ({
                                                                ...prev,
                                                                [index]: e.target.value,
                                                            }));
                                                            setShowDropdownMap((prev) => ({
                                                                ...prev,
                                                                [index]: true,
                                                            }));
                                                        }}
                                                        onFocus={() =>
                                                            setShowDropdownMap((prev) => ({
                                                                ...prev,
                                                                [index]: true,
                                                            }))
                                                        }
                                                        onBlur={() =>
                                                            setTimeout(() => {
                                                                setShowDropdownMap((prev) => ({
                                                                    ...prev,
                                                                    [index]: false,
                                                                }));
                                                            }, 150)
                                                        }
                                                        className="w-full px-3 py-2.5 pr-9 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                                    />
                                                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                                                        <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showDropdownMap ? "rotate-180" : ""}`}
                                                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>

                                                    {showDropdownMap[index] && filteredItems!.length > 0 && (
                                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
                                                            {filteredItems!.map((filteredItem) => (
                                                                <button
                                                                    key={filteredItem.idInvoiceItem}
                                                                    type="button"
                                                                    onMouseDown={(e) => {
                                                                        e.preventDefault();

                                                                        setCreditNoteItemMap((prev) => ({
                                                                            ...prev,
                                                                            [index]: filteredItem,
                                                                        }));

                                                                        setItemSearchMap((prev) => ({
                                                                            ...prev,
                                                                            [index]: filteredItem.description,
                                                                        }));
                                                                        setShowDropdownMap((prev) => ({
                                                                            ...prev,
                                                                            [index]: false,
                                                                        }));
                                                                        updateItem(field.idCreditNoteItem!, {
                                                                            idCreditNoteItem: field.idCreditNoteItem!,
                                                                            description: filteredItem.description,
                                                                            quantity: filteredItem.quantity,
                                                                            unityPriceEXclTax: filteredItem.unityPriceEXclTax,
                                                                            vatRate: filteredItem.vatRate,
                                                                            operationCategory: filteredItem.operationCategory,
                                                                            originalItem:filteredItem.idInvoiceItem
                                                                        });
                                                                    }}
                                                                    className="w-full text-left px-4 py-3 hover:bg-blue-50 transition border-b border-slate-50 last:border-0"
                                                                >
                                                                    <p className="text-sm font-bold text-slate-800">
                                                                        {filteredItem.description}
                                                                    </p>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Champs QTÉ / P.U HT / TVA */}
                                                {creditNoteItemMap[index] && (
                                                    <div className="grid grid-cols-3 gap-2 mt-3">
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                                {"QTÉ"}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={creditNoteItemMap[index]?.quantity ?? ""}
                                                                onChange={(e) => {
                                                                    const val = parseFloat(e.target.value) || 0;

                                                                    setCreditNoteItemMap((prev) => ({
                                                                        ...prev,
                                                                        [index]: {
                                                                            ...prev[index],
                                                                            quantity: val,
                                                                        },
                                                                    }));

                                                                    updateItem(field.idCreditNoteItem!, { quantity: val });
                                                                }}
                                                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 text-center focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                                P.U HT
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={creditNoteItemMap[index]?.unityPriceEXclTax ?? ""}
                                                                onChange={(e) => {
                                                                    const val = parseFloat(e.target.value) || 0;
                                                                    setCreditNoteItemMap((prev) => ({
                                                                        ...prev,
                                                                        [index]: {
                                                                            ...prev[index],
                                                                            unityPriceEXclTax: val,
                                                                        },
                                                                    }));

                                                                    updateItem(field.idCreditNoteItem!, { unityPriceEXclTax: val });
                                                                }}
                                                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 text-center focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                                TVA %
                                                            </label>
                                                            <select
                                                                value={creditNoteItemMap[index].vatRate}
                                                                onChange={(e) => {
                                                                    const val = Number(e.target.value);

                                                                    setCreditNoteItemMap((prev) => ({
                                                                        ...prev,
                                                                        [index]: {
                                                                            ...prev[index],
                                                                            vatRate: val,
                                                                        },
                                                                    }));

                                                                    updateItem(field.idCreditNoteItem!, { vatRate: val });
                                                                }}
                                                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 text-center focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                                            >
                                                                {tvaRateSchema.options.map((rate) => (
                                                                    <option key={rate.value} value={rate.value}>
                                                                        {rate.value}%
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {errors.creditNoteItems?.message && (
                                        <ErrorForm error={errors.creditNoteItems?.message} />)}
                                </section>
                            </div>
                        </div>
                        {/* RIGHT COLUMN: Live Preview - Sticky  //  */}
                        <div className='col-span-2'>
                            <InvoicePreview ref={invoiceRef} data={previewData} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
