"use client";

import {
  Building2,
  Edit2Icon,
  Mail,
  Phone,
  Trash2
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/datatable";

import { ActionMenu } from "@/shared/components/ui/actionMenuItem";
import { ClientPartnerItem } from "../../models/partner";

type ClientsTableProps = {
  rows: ClientPartnerItem[];
  setCurrentPage: (page: number) => void;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  totalElements: number;
  onDeleteRequest: (id: string) => void;
};



export default function ClientsTable({
  rows,
  setCurrentPage,
  currentPage,
  totalPages,
  loading,
  totalElements,
  onDeleteRequest,
}: ClientsTableProps) {
  const router = useRouter();

  const columns: DataTableColumn<ClientPartnerItem>[] = [
    {
      key: "client",
      header: "Client",
      cell: (client) => (
        <div className="flex items-center gap-3 min-w-[220px]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-blue-100">
            <Building2 className="h-4 w-4 text-blue-600" />
          </div>

          <div className="min-w-0">
            <button
              type="button"
              onClick={() => router.push(`/billing/clients/${client.idPartner}`)}
              className="text-xs font-bold text-blue-600 underline-offset-4 transition hover:text-blue-800 hover:underline cursor-pointer"
            >
              {client.companyName}
            </button>

            <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500">
              {client.billingAddress.city || "Adresse non renseignée"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "identifier",
      header: "Matricule fiscal",
      cell: (client) => (
        <p className="text-xs font-semibold text-slate-700">
          {client.taxRegistrationNumber || "-"}
        </p>
      ),
    },
    {
      key: "location",
      header: "Localisation",
      cell: (client) => (
        <div>
          <p className="text-xs font-semibold text-slate-800">
            {client.billingAddress.region || "-"}
          </p>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      cell: (client) => (
        <div className="space-y-1.5">
          {client.email ? (
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span className="max-w-[220px] truncate">{client.email}</span>
            </div>
          ) : (
            <p className="text-xs font-medium text-slate-400">Email non renseigné</p>
          )}

          {client.partnerName ? (
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>{client.professionnalPhoneNumber}</span>
            </div>
          ) : (
            <p className="text-xs font-medium text-slate-400">Téléphone non renseigné</p>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (client) => (
        <ActionMenu
          orientation="horizontal"
          title="Actions client"
          items={[
            {
              label: "Modifier",
              icon: Edit2Icon,
              color: "text-blue-600",
              hover: "hover:bg-blue-50",
              onClick: () => router.push(`/billing/clients/${client.idPartner}/edit`),
            },
            {
              label: "Supprimer",
              icon: Trash2,
              color: "text-blue-600",
              hover: "hover:bg-blue-50",
              onClick: () => onDeleteRequest(client.idPartner),
            },
          ]}
        />
      ),
    }
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