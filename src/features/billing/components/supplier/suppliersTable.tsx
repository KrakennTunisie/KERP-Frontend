
"use client";

import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  Eye,
  Edit,
  Trash2,
  Truck,
} from "lucide-react";
import { DataTable, type DataTableColumn } from '@/shared/components/datatable';
import { SupplierPartnerItem } from "../../models/partner";

export type SupplierTableProps = {
  rows: SupplierPartnerItem[];
  onDeleteRequest: (id: string) => void;
};

export default function SuppliersTable({
  rows,
  onDeleteRequest,
}: SupplierTableProps) {
  const router = useRouter();

  const columns: DataTableColumn<SupplierPartnerItem>[] = [
    {
      key: "supplier",
      header: "Fournisseur",
      cell: (supplier) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
            <Truck className="w-5 h-5 text-emerald-600"/>
          </div>
          <div>
            <p className="text-sm font-black text-gray-900">{supplier.name}</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
              {supplier.adress}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "identifier",
      header: "Matricule Fiscal",
      cell: (supplier) => (
        <p className="text-sm font-black text-gray-900">{supplier.taxRegistrationNumber}</p>
      ),
    },
    {
      key: "location",
      header: "Localisation",
      cell: (supplier) => (
        <>
          <p className="text-sm font-bold text-gray-900">{supplier.country}</p>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
            • {supplier.country}
          </p>
        </>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      cell: (supplier) => (
        <div className="space-y-1">
          {supplier.email && (
            <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
              <Mail className="w-3 h-3" />
              <span>{supplier.email}</span>
            </div>
          )}
          {supplier.phoneNumber && (
            <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
              <Phone className="w-3 h-3" />
              <span>{supplier.phoneNumber}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-center",
      cell: (supplier) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => router.push(`/billing/suppliers/${supplier.idPartner}`)}
            className="p-2.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-xl shadow-sm transition-all"
            title="Voir"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={() => router.push(`/billing/suppliers/${supplier.idPartner}/edit`)}
            className="p-2.5 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-xl shadow-sm transition-all"
            title="Modifier"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDeleteRequest(supplier.idPartner)}
            className="p-2.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-xl shadow-sm transition-all"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      rows={rows}
      columns={columns}
      getRowKey={(c) => c.idPartner}
      pageSize={3}
      emptyMessage="Aucun fournisseur ne correspond à vos filtres."
      countLabel={(count) =>
        `${count} fournisseur${count > 1 ? "s" : ""} trouvé${count > 1 ? "s" : ""}`
      }
    />
  );
}