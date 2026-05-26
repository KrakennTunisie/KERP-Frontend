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

import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/datatable";

import { ClientPartnerItem } from "../../models/partner";

type ClientsTableProps = {
  rows: ClientPartnerItem[];
  setCurrentPage: (page: number) => void;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  totalElements: number;
  onDeleteRequest: (id: string) => void;
  onUpdateRequest: (row: ClientPartnerItem) => void;
};

function TableActionButton({
  title,
  icon: Icon,
  onClick,
  variant = "default",
}: {
  title: string;
  icon: React.ElementType;
  onClick: () => void;
  variant?: "default" | "blue" | "warning" | "danger";
}) {
  const variants = {
    default:
      "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900",
    blue:
      "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 hover:text-blue-700",
    warning:
      "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100 hover:text-amber-700",
    danger:
      "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100 hover:text-rose-700",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors cursor-pointer ${variants[variant]}`}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

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
        <div className="flex items-center gap-3 min-w-[220px]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 ring-1 ring-blue-100">
            <Building2 className="h-4 w-4 text-blue-600" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {client.partnerName}
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
        <div className="flex items-center justify-end gap-1.5">
          <TableActionButton
            title="Voir"
            icon={Eye}
            variant="blue"
            onClick={() => router.push(`/billing/clients/${client.idPartner}`)}
          />

          <TableActionButton
            title="Modifier"
            icon={Edit}
            variant="blue"
            onClick={() => router.push(`/billing/clients/${client.idPartner}/edit`)}
          />

          <TableActionButton
            title="Supprimer"
            icon={Trash2}
            variant="blue"
            onClick={() => onDeleteRequest(client.idPartner)}
          />
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