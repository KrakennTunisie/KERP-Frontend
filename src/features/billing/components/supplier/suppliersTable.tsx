"use client";

import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  Edit,
  Trash2,
  Truck,
} from "lucide-react";
import { DataTable, type DataTableColumn } from "@/shared/components/datatable";
import { SupplierPartnerItem } from "../../models/partner";
import { ActionMenu } from "@/shared/components/ui/actionMenuItem";

type SupplierTableProps = {
  rows: SupplierPartnerItem[];
  setCurrentPage: (page: number) => void;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  totalElements: number;
  onDeleteRequest: (id: string) => void;
  onUpdateRequest: (row: SupplierPartnerItem) => void;
};

export default function SuppliersTable({
  rows,
  setCurrentPage,
  currentPage,
  totalPages,
  loading,
  totalElements,
  onDeleteRequest,
  onUpdateRequest,
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
          <div>
            <button
                type="button"
                onClick={() => router.push(`/billing/suppliers/${supplier.idPartner}`)}
                className="text-xs font-bold text-blue-600 underline-offset-4 transition hover:text-blue-800 hover:underline cursor-pointer"
              >
                {supplier.companyName}
              </button>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
              {supplier?.billingAddress?.state}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "identifier",
      header: "Matricule Fiscal",
      cell: (supplier) => (
        <p className="text-sm font-medium text-gray-900">
          {supplier.taxRegistrationNumber}
        </p>
      ),
    },
    {
      key: "location",
      header: "Localisation",
      cell: (supplier) => (
        <>
          <p className="text-sm font-medium text-gray-900">{supplier?.billingAddress?.region || ''}</p>
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter">
            • {supplier?.billingAddress?.city || ''}
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
                color: "text-amber-600",
                hover: "hover:bg-amber-50",
                onClick: () => onUpdateRequest(supplier),
              },
              {
                label: "Supprimer",
                icon: Trash2,
                color: "text-rose-600",
                hover: "hover:bg-rose-50",
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