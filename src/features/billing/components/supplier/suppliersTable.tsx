"use client";

import { DataTable, type DataTableColumn } from "@/shared/components/datatable";
import { ActionMenu } from "@/shared/components/ui/actionMenuItem";
import {
  Edit,
  Mail,
  Phone,
  ScrollText,
  Send,
  Signature,
  Trash2,
  Truck,
  UserCheck,
  UserX
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SupplierPartnerItem } from "../../models/partner";
import { partnerDocumentType, PartnerDocumentType } from "../../types/documentType";
import AddDocumentModal from "@/shared/components/ui/addDocumentModal";
import { SendEmailModal } from "@/shared/components/widgets/sendEmailModal";
import { useState } from "react";

type SupplierTableProps = {
  rows: SupplierPartnerItem[];
  setCurrentPage: (page: number) => void;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  totalElements: number;
  onDeleteRequest: (id: string) => void;
  onAddDocument: (type: PartnerDocumentType) => void;
  openAddDocument: boolean;
  addDocumentLoading: boolean;
  addDocumentType: PartnerDocumentType;
  setOpenAddDocument: (value: boolean) => void;
  addDocument: (file: File, type: PartnerDocumentType, partner: SupplierPartnerItem) => void;
  updateStatus: (partnerId: string, partnerType: string, status: boolean) => void,
  openEmail: boolean;
  setOpenEmail: (value: boolean) => void;
};

export default function SuppliersTable({
  rows,
  setCurrentPage,
  currentPage,
  totalPages,
  loading,
  totalElements,
  onDeleteRequest,
  updateStatus,
  onAddDocument,
  openAddDocument,
  addDocumentLoading,
  addDocumentType,
  setOpenAddDocument,
  addDocument,
  openEmail,
  setOpenEmail,
}: SupplierTableProps) {
  const router = useRouter();
  const [partner, setPartner] = useState<SupplierPartnerItem>()
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
              {supplier.billingAddress!.city || "Adresse non renseignée"}
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
          {supplier.taxRegistrationNumber && supplier.taxRegistrationNumber !== 'null' ? supplier.taxRegistrationNumber : '_'}
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
              <span>{supplier.email && supplier.email !== 'null' ? supplier.email : '-'}</span>
            </div>
          )}
          {supplier.professionnalPhoneNumber && (
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
              <Phone className="w-3 h-3" />
              <span>{supplier.professionnalPhoneNumber || '-'}</span>
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
          title="Actions supplier"
          items={[
            {
              label: "Modifier",
              icon: Edit,
              hover: "hover:bg-amber-50",
              onClick: () => router.push(`/billing/suppliers/${supplier.idPartner}/edit`),
              visible: true
            },
            {
              label: "Envoyer email",
              icon: Send,
              hover: "hover:bg-blue-50",
              onClick: () => {
                setPartner(supplier);
                setOpenEmail(true);
                console.log(openEmail)
              },
              visible: supplier.email !== ""
            },
            {
              label: "Ajouter un document",
              icon: Signature,
              hover: "hover:bg-emerald-50",
              onClick: () => {
                setPartner(supplier)
                setOpenAddDocument(true)
              },
              visible: true
            },
            
            {
              label: "Désactiver",
              icon: UserX,
              hover: "hover:bg-amber-50",
              onClick: () => updateStatus(supplier.idPartner, supplier.partnerType, false),
              visible: supplier.active
            },
            {
              label: "Activer",
              icon: UserCheck,
              color: "text-emerald-600",
              hover: "hover:bg-emerald-50",
              onClick: () => updateStatus(supplier.idPartner, supplier.partnerType, true),
              visible: !supplier.active
            },
          ]}
        />
      ),
    }
  ];

  return (
    <>
      <SendEmailModal
        isOpen={openEmail}
        onClose={() => setOpenEmail(false)}
        defaultTo={partner?.email ?? ""}
        recipientName={partner?.partnerName ?? ""}
      />


      <AddDocumentModal
        open={openAddDocument}
        loading={addDocumentLoading}
        type={addDocumentType}
        hasPatent={partner?.patente? false : true}
        onClose={() => setOpenAddDocument(false)}
        onAdd={async (file, type) => addDocument(file, type, partner!)}
      />
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
    </>

  );
}