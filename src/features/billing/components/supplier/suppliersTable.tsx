"use client";

import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  Edit,
  Trash2,
  Truck,
  Eye,
} from "lucide-react";
import { DataTable, type DataTableColumn } from "@/shared/components/datatable";
import { SupplierPartnerItem } from "../../models/partner";
import { TableActionButton } from "../widgets/tableActionButton";
import { ActionMenu } from "@/shared/components/ui/actionMenuItem";

type SupplierTableProps = {
  rows: SupplierPartnerItem[];
  setCurrentPage: (page: number) => void;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  totalElements: number;
  onDeleteRequest: (id: string) => void;
};

export default function SuppliersTable({
  rows,
  setCurrentPage,
  currentPage,
  totalPages,
  loading,
  totalElements,
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
            <Truck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => router.push(`/billing/suppliers/${supplier.idPartner}`)}
              className="text-xs font-bold text-blue-600 underline-offset-4 transition hover:text-blue-800 hover:underline cursor-pointer"
            >
              {supplier.companyName}
            </button>

            <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500">
              {supplier.billingAddress.city || "Adresse non renseignée"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "identifier",
      header: "Matricule Fiscal",
      cell: (supplier) => (
        <p className="text-xs font-semibold text-slate-700">
          {supplier.taxRegistrationNumber || "-"}
        </p>
      ),
    },
    {
      key: "location",
      header: "Localisation",
      cell: (supplier) => (
        <>
          <p className="text-xs font-semibold text-slate-800">{supplier?.billingAddress?.region || '-'}</p>
          
        </>
      ),
    },
    {
      key: "contact",
      header: "Contact",
      cell: (supplier) => (
        <div className="space-y-1">
          {supplier.email && (
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
              <Mail className="w-3 h-3" />
              <span>{supplier.email}</span>
            </div>
          )}
          {supplier.professionnalPhoneNumber && (
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
              <Phone className="w-3 h-3" />
              <span>{supplier.professionnalPhoneNumber}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      cell: (supplier) => (
        <ActionMenu
          orientation="horizontal"
          title="Actions client"
          items={[
            {
              label: "Modifier",
              icon: Edit,
              color: "text-blue-600",
              hover: "hover:bg-blue-50",
              onClick: () => router.push(`/billing/suppliers/${supplier.idPartner}/edit`),
            },
            {
              label: "Supprimer",
              icon: Trash2,
              color: "text-blue-600",
              hover: "hover:bg-blue-50",
              onClick: () => onDeleteRequest(supplier.idPartner),
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
      emptyMessage="Aucun fournisseur trouvé."
      totalCount={totalElements}
      countLabel={(count) =>
        `${count} fournisseur${count > 1 ? "s" : ""} trouvé${count > 1 ? "s" : ""}`
      }
    />
  );
}