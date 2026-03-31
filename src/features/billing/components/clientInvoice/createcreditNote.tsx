"use client"
import { ArrowLeft, FileX, ShieldCheck, Plus, Trash2 } from 'lucide-react';
import InvoicePreview from '../widgets/invoicePreview';
import useCreateCreditNote from '../../hooks/useCreateCreditNote';
import { OperationCategoryLabels, operationCategorySchema } from '../../types/operationCategory';
import { SectionTitle } from '../widgets/sectionTitle';
import { tvaRateSchema } from '../../types/tvaRate';
import { invoiceTypeSchema } from '../../types/invoiceType';
import { creditNoteTypeLabels, CreditNoteTypeSchema } from '../../types/creditNoteType';
import SummaryOriginalInvoice from '../widgets/summaryOriginalInvoice';

export function CreateCreditNote() {
    const {  previewData,  form,  removeItem,  addItem,  updateItem,  router} = useCreateCreditNote();
    const { register } = form
    return (
        <div className="flex-1 flex flex-col min-h-0 bg-white">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 px-8 py-6 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => { router.back();}}
                            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-700" />
                        </button>
                        <div>
                            <div className="flex items-center gap-3">
                                <FileX className="w-8 h-8 text-rose-600" />
                                <h1 className="text-xl font-black text-gray-900 tracking-tighter">Créer une Facture d'Avoir</h1>
                            </div>
                            <p className="text-sm font-medium text-gray-500 mt-1">Référence facture originale : {previewData.refOriginalInvoice}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { }}
                            className="px-6 py-3 text-gray-500 font-bold text-sm hover:text-gray-900 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={()=>{}}
                            className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition-all font-black text-sm shadow-xl shadow-purple-100"
                        >
                            <ShieldCheck className="w-4 h-4" />
                            Créer & Envoyer au TTN
                        </button>
                    </div>
                </div>
            </header>

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
                                                <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest cursor-pointer">
                                                    <input type="checkbox" defaultChecked className="rounded accent-red-600" />
                                                    Auto-généré
                                                </label>
                                            </div>
                                            <input
                                                type="text"
                                                {...register("invoiceNumber")}
                                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date d'émission</label>
                                            <input
                                                type="date"
                                                {...register("issueDate", { valueAsDate: true })}
                                                min={new Date().toISOString().split("T")[0]}
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
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Motif de l'avoir *</label>
                                            <select
                                                {...register("creditNoteReason")}
                                                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                            >
                                                {CreditNoteTypeSchema.options.map((type) => (
                                                    <option key={type} value={type}>{creditNoteTypeLabels[type]}</option>
                                                ))}

                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 04 — Services */}
                                <div className="space-y-6">

                                    <section>
                                        <div className="flex items-center justify-between">
                                            <SectionTitle number="04" label="SERVICES" invoiceType={invoiceTypeSchema.enum.CREDITNOTE} />
                                            <button
                                                onClick={addItem}
                                                className="w-8 h-8 rounded-full bg-red-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-200 transition"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="flex flex-col gap-3 mt-3">
                                            {previewData.invoiceItems!.map((item) => (
                                                <div key={item.idInvoiceItem} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">

                                                    {/* Header : Désignation + bouton supprimer */}
                                                    <div className="flex items-start justify-between mb-1">
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                            Désignation
                                                        </label>
                                                        <button
                                                            onClick={() => removeItem(item.idInvoiceItem!)}
                                                            className="text-slate-300 hover:text-red-400 transition"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    {/* Input désignation */}
                                                    <input
                                                        type="text"
                                                        value={item.description}
                                                        onChange={(e) => updateItem(item.idInvoiceItem!, "description", e.target.value)}
                                                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition mb-4"
                                                    />

                                                    {/* Catégorie */}
                                                    <div className="mb-4">
                                                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                            Catégorie
                                                        </label>
                                                        <select
                                                            value={item.operationCategory}
                                                            onChange={(e) => updateItem(item.idInvoiceItem!, "operationCategory", e.target.value)}
                                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                                        >
                                                            {operationCategorySchema.options.map((value) => (
                                                                <option key={value} value={value}>{OperationCategoryLabels[value]}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* QTÉ / P.U HT / TVA */}
                                                    <div className="grid grid-cols-3 gap-2">
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                                QTÉ
                                                            </label>
                                                            <input
                                                                type="number"
                                                                min={1}
                                                                value={item.quantity}
                                                                onChange={(e) => updateItem(item.idInvoiceItem!, "quantity", parseFloat(e.target.value) || 0)}
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
                                                                onChange={(e) => updateItem(item.idInvoiceItem!, "unityPriceEXclTax", parseFloat(e.target.value) || 0)}
                                                                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 text-center focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                                                TVA %
                                                            </label>
                                                            <select
                                                                value={item.vatRate}
                                                                onChange={(e) => updateItem(item.idInvoiceItem!, "vatRate", Number(e.target.value))}
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
                                </div>
                            </div>

                            {/* Warning Notice */}
                            <div className="bg-amber-50 rounded-[32px] p-6 border border-amber-200">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                                        <FileX className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-amber-900 mb-2">⚠️ Important</p>
                                        <p className="text-xs font-bold text-amber-800 leading-relaxed">
                                            Cette facture d'avoir sera automatiquement envoyée au TTN pour validation fiscale.
                                            Le document sera ensuite transmis au client avec la référence de la facture originale.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* RIGHT COLUMN: Live Preview - Sticky  //  */}
                        <div className='col-span-2'>
                            <InvoicePreview data={previewData} />
                        </div>


                    </div>

                </div>
            </main>
        </div>
    );
}
