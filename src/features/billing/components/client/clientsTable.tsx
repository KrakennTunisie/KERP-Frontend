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
      <div className="flex items-center gap-2 min-w-[200px]">

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 ring-1 ring-blue-100">
          <Building2 className="h-3.5 w-3.5 text-blue-600" />
        </div>

        <div className="min-w-0">
          <button
            type="button"
            onClick={() =>
              router.push(`/billing/clients/${client.idPartner}`)
            }
            className="text-xs font-bold text-blue-600 underline-offset-4 transition hover:text-blue-800 hover:underline cursor-pointer"
          >
            {client.companyName}
          </button>

          <p className="truncate text-[11px] text-slate-500">
            {client.billingAddress.city || "—"}
          </p>
        </div>

      </div>
    ),
  },

  {
    key: "identifier",
    header: "Matricule",
    cell: (client) => (
      <p className="text-xs font-medium text-slate-700">
        {client.taxRegistrationNumber || "—"}
      </p>
    ),
  },

  {
    key: "location",
    header: "Localisation",
    cell: (client) => (
      <p className="text-xs font-medium text-slate-800">
        {client.billingAddress.region || "—"}
      </p>
    ),
  },

  {
    key: "contact",
    header: "Contact",
    cell: (client) => (
      <div className="space-y-1">

        {client.email ? (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Mail className="h-3 w-3 text-slate-400" />
            <span className="truncate">{client.email}</span>
          </div>
        ) : (
          <p className="text-[11px] text-slate-400">—</p>
        )}

        {client.professionnalPhoneNumber ? (
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Phone className="h-3 w-3 text-slate-400" />
            <span>{client.professionnalPhoneNumber}</span>
          </div>
        ) : (
          <p className="text-[11px] text-slate-400">—</p>
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
            color: "text-amber-600",
            hover: "hover:bg-amber-50",
            onClick: () =>
              router.push(`/billing/clients/${client.idPartner}/edit`),
          },
          {
            label: "Supprimer",
            icon: Trash2,
            color: "text-rose-600",
            hover: "hover:bg-rose-50",
            onClick: () => onDeleteRequest(client.idPartner),
          },
        ]}
      />
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