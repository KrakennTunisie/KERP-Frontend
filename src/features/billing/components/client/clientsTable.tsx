
"use client";

import { useRouter } from "next/navigation";
import {
  Building2,
  Mail,
  Phone,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { DataTable, type DataTableColumn } from '@/shared/components/datatable';
import {  ClientPartnerItem } from "../../models/partner";

export type ClientsTableProps = {
  rows: ClientPartnerItem[];
  setCurrentPage: ()=> void,
  currentPage: number,
  totalPages : number,
  loading: boolean,
  totalElements: number,
  onDeleteRequest: (id: string) => void;
  onUpdateRequest: (row: ClientPartnerItem)=> void;
};

export default function ClientsTable({
  rows,
  setCurrentPage,
  currentPage,
  totalPages,
  loading,
  totalElements,
  onDeleteRequest,
  onUpdateRequest,
}: ClientsTableProps) {
  const router = useRouter();

  const columns: DataTableColumn<ClientPartnerItem>[] = [
    {
      key: "client",
      header: "Client",
      cell: (client) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-black text-gray-900">{client.name}</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
              {client.adress}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "identifier",
      header: "Matricule Fiscal",
      cell: (client) => (
        <p className="text-sm font-black text-gray-900">{client.taxRegistrationNumber}</p>
      ),
    },
    {
      key: "location",
      header: "Localisation",
      cell: (client) => (
        <>
          <p className="text-sm font-bold text-gray-900">{client.country}</p>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
            • {client.country}
          </p>
        </>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      cell: (client) => (
        <div className="space-y-1">
          {client.email && (
            <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
              <Mail className="w-3 h-3" />
              <span>{client.email}</span>
            </div>
          )}
          {client.phoneNumber && (
            <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
              <Phone className="w-3 h-3" />
              <span>{client.phoneNumber}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-center",
      cell: (client) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => router.push(`/billing/clients/${client.idPartner}`)}
            className="p-2.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 rounded-xl shadow-sm transition-all"
            title="Voir"
          >
            <Eye className="w-4 h-4" />
          </button>

          <button
            onClick={() => onUpdateRequest(client)}
            className="p-2.5 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 rounded-xl shadow-sm transition-all"
            title="Modifier"
          >
            <Edit className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDeleteRequest(client.idPartner)}
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
      getRowKey={(row) => row.idPartner}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      isLoading={loading}
      emptyMessage="Aucun client trouvé."
      totalCount={totalElements}
      countLabel={(count) =>
        `${count} client${count > 1 ? "s" : ""} trouvé${count > 1 ? "s" : ""}`
      }
    />
  );
}