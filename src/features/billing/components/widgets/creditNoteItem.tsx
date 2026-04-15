import { useState } from "react";
import { tvaRateSchema } from "../../types/tvaRate";

export  const CreditNoteItemCard = ({ field, filteredItems, removeItem, updateItem, syncItems }: { field: any, filteredItems: any[], removeItem: (id: string) => void, updateItem: any, syncItems: any}) => {
    const [creditNoteItem, setCreditNoteItem] = useState<any>(null);
    const [ItemSearch, setItemSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Sélectionner un produit
                </label>
                <button onClick={() => removeItem(field.idInvoiceItem)} className="text-slate-300 hover:text-red-400 transition">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            <div className="relative">
                <input
                    type="text"
                    placeholder="Sélectionner un produit..."
                    value={ItemSearch}
                    onChange={(e) => { setItemSearch(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                    className="w-full px-3 py-2.5 pr-9 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                />
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                    <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>

                {showDropdown && filteredItems.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
                        {filteredItems.map((filteredItem) => (
                            <button
                                key={filteredItem.idInvoiceItem}
                                type="button"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    setCreditNoteItem(filteredItem);
                                    setItemSearch(filteredItem.description);
                                    setShowDropdown(false);
                                    syncItems([filteredItem]);
                                }}
                                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition border-b border-slate-50 last:border-0"
                            >
                                <p className="text-sm font-bold text-slate-800">{filteredItem.description}</p>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {creditNoteItem && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">QTÉ</label>
                        <input
                            type="text"
                            min={1}
                            value={creditNoteItem.quantity}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setCreditNoteItem({ ...creditNoteItem, quantity: val });
                                updateItem(creditNoteItem.idInvoiceItem!, "quantity", val);
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 text-center focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">P.U HT</label>
                        <input
                            type="text"
                            min={100}
                            value={creditNoteItem.unityPriceEXclTax}
                            onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setCreditNoteItem({ ...creditNoteItem, unityPriceEXclTax: val });
                                updateItem(creditNoteItem.idInvoiceItem!, "unityPriceEXclTax", val);
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 text-center focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">TVA %</label>
                        <select
                            value={creditNoteItem.vatRate}
                            onChange={(e) => {
                                const val = Number(e.target.value);
                                setCreditNoteItem({ ...creditNoteItem, vatRate: val });
                                updateItem(creditNoteItem.idInvoiceItem!, "vatRate", val);
                            }}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 text-center focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                        >
                            {tvaRateSchema.options!.map((rate) => (
                                <option key={rate.value} value={rate.value}>{rate.value}%</option>
                            ))}
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};