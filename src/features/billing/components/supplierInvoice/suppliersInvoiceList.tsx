'use client';

import StatClientInvoiceCard from "@/shared/components/ui/statClientInvoiceCard";
import useSupplierInvoiceList from "../../hooks/useSupplierInvoiceList";
import { MOCK_INVOICES } from "../../mocks/invoice-mocks";
import { invoiceStatusColors, invoiceStatusLabels, invoiceStatusSchema } from "../../types/invoiceStatus";
import { categoriesFacturesFournisseurSchema } from "../../types/invoiceSupplierCategory";


export default function SuppliersInvoiceList() {

    const { router, search, setSearch, filtre, categorie, setCategorie, setFiltre } = useSupplierInvoiceList();

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Factures Fournisseurs
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {"Gestion des factures d'achat"}
                    </p>
                </div>
            </div>
            {/* Stats */}
            <div className="flex gap-4 mb-8">
                <StatClientInvoiceCard
                    icon={
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                        </svg>
                    }
                    label="Total Année 2026"
                    eur={0}
                    tnd={0}
                    sub="Payé + À Encaisser"
                    variant="blue"
                />
                <StatClientInvoiceCard
                    icon={
                        <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <circle cx="12" cy="12" r="9" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
                        </svg>
                    }
                    label="À Encaisser 2026"
                    eur={0}
                    tnd={0}
                    sub={`${0} factures`}
                    variant="amber"
                />
                <StatClientInvoiceCard
                    icon={
                        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
                        </svg>
                    }
                    label="Mois en Cours"
                    eur={0}
                    tnd={0}
                    sub={`${0} factures`}
                    variant="emerald"
                />
            </div>

            {/* Table card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {/* Search + Filters */}
                <div className="flex flex-col gap-3 p-5 border-b border-slate-100">

                    {/* Ligne 1 : Search + Statuts */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <circle cx="11" cy="11" r="8" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Rechercher par référence ou fournisseur..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                            />
                        </div>
                        <div className="flex gap-2">
                            {invoiceStatusSchema.options.filter((f) => f === "TO_PAY" || f === "PAID" || f === "ALL").map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFiltre(f)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${filtre === f
                                        ? "bg-slate-900 text-white shadow"
                                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                        }`}
                                >
                                    { invoiceStatusLabels[f]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Ligne 2 : Catégories */}
                    <div className="flex gap-2 flex-wrap">
                        {categoriesFacturesFournisseurSchema.options.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategorie(cat)}
                                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${categorie === cat
                                    ? "bg-emerald-600 text-white shadow"
                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                                    }`}
                            >
                                {cat === "Toutes catégories" && (
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                    </svg>
                                )}
                                {cat}
                            </button>
                        ))}
                    </div>

                </div>

            </div>
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-slate-100">
                            {["RÉFÉRENCE", "Fournisseur", "STATUT", "MONTANT HT (EUR)", "MONTANT HT (TND)", "DATE ÉCHÉANCE", "CONFORME", "ACTIONS"].map((col) => (
                                <th
                                    key={col}
                                    className="px-5 py-3 text-left text-xs font-bold text-slate-400 tracking-widest uppercase"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {MOCK_INVOICES.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center py-12 text-slate-400 text-sm">
                                    Aucune facture trouvée.
                                </td>
                            </tr>
                        ) : (
                            MOCK_INVOICES.map((f) => (
                                <tr
                                    key={1}
                                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    <td className="px-5 py-4 font-bold text-slate-800">
                                        {f.idInvoice}
                                    </td>
                                    <td className="px-5 py-4 text-slate-700">SYSLAB</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${f.invoiceStatus !== "ALL" ? invoiceStatusColors[f.invoiceStatus] : ""
                                            }}`}>
                                            { invoiceStatusLabels[f.invoiceStatus]}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-slate-700 font-medium">
                                        {f.totalExclTax!.toLocaleString("fr-FR")} €
                                    </td>
                                    <td className="px-5 py-4 text-slate-700 font-medium">
                                        {f.totalExclTax!.toLocaleString("fr-FR")} TND
                                    </td>
                                    <td className="px-5 py-4 text-slate-600">{f.issueDate.toLocaleDateString("fr-FR")}</td>
                                    <td className="px-5 py-4 text-center">
                                        {f.invoiceComplianceStatus ? (
                                            <svg className="w-5 h-5 text-emerald-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5 text-slate-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <circle cx="12" cy="12" r="9" />
                                            </svg>
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">

                                            {/* Voir */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); console.log("view", f.idInvoice); router.push(`/billing/invoices/suppliers/details/${f.idInvoice}`) }}
                                                className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                                title="Voir"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                                </svg>
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>

    );
}