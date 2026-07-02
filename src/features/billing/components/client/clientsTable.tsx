"use client";

import {
  Building2,
  Edit2Icon,
  Mail,
  Pencil,
  Phone,
  ScrollText,
  Send,
  Signature,
  Trash2,
  UserCheck,
  UserX
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/datatable";

import { ActionMenu } from "@/shared/components/ui/actionMenuItem";
import { ClientPartnerItem, PartnerAllDetails } from "../../models/partner";
import UseClientsDetails from "../../hooks/useClientsDetails";
import { PartnerDocumentType, partnerDocumentType } from "../../types/documentType";
import { SendEmailModal } from "@/shared/components/widgets/sendEmailModal";
import AddDocumentModal from "@/shared/components/ui/addDocumentModal";
import usePartnerList from "../../hooks/usePartnerList";
import { useEffect, useState } from "react";

type ClientsTableProps = {
  rows: ClientPartnerItem[];
  setCurrentPage: (page: number) => void;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  setOpenEmail: (value: boolean) => void;
  totalElements: number;
  onDeleteRequest: (id: string) => void;
  updateStatus: (partnerId: string, partnerType: string, status: boolean) => void,
  onAddDocument: (type: PartnerDocumentType) => void;
  openAddDocument: boolean;
  addDocumentLoading: boolean;
  addDocumentType: PartnerDocumentType;
  setOpenAddDocument: (value: boolean) => void;
  addDocument: (file: File, type: PartnerDocumentType, partner: ClientPartnerItem) => void;
  openEmail: boolean;
};



export default function ClientsTable({
  rows,
  setCurrentPage,
  currentPage,
  totalPages,
  loading,
  totalElements,
  setOpenEmail,
  openEmail,
  onDeleteRequest,
  updateStatus,
  onAddDocument,
  openAddDocument,
  addDocumentLoading,
  addDocumentType,
  setOpenAddDocument,
  addDocument


}: ClientsTableProps) {
  const router = useRouter();
  const [partner, setPartner] = useState<ClientPartnerItem>()
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
              {client.billingAddress!.city || "—"}
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
          {client.taxRegistrationNumber && client.taxRegistrationNumber !== 'null' ? client.taxRegistrationNumber : '-'}
        </p>
      ),
    },

    {
      key: "location",
      header: "Localisation",
      cell: (client) => (
        <p className="text-xs font-medium text-slate-800">
          {client.billingAddress!.region || "—"}
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
              <span className="truncate">{client.email && client.email !== 'null' ? client.email : '-'}</span>
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
          items={[
            {
              label: "Modifier",
              icon: Edit2Icon,
              hover: "hover:bg-amber-50",
              onClick: () => router.push(`/billing/clients/${client.idPartner}/edit`),
              visible: true
            },
            {
              label: "Envoyer email",
              icon: Send,
              hover: "hover:bg-blue-50",
              onClick: () => {
                setPartner(client);
                setOpenEmail(true);
              },
              visible: client.email!== ""
            },
            {
              label: "Ajouter un document",
              icon: Signature,
              hover: "hover:bg-emerald-50",
              onClick: () => {
                setPartner(client)
                setOpenAddDocument(true)
              },
              visible: true
            },
            {
              label: "Désactiver",
              icon: UserX,
              hover: "hover:bg-amber-50",
              onClick: () => updateStatus(client.idPartner, client.partnerType, false),
              visible: client.active
            },
            {
              label: "Activer",
              icon: UserCheck,
              color: "text-emerald-600",
              hover: "hover:bg-emerald-50",
              onClick: () => updateStatus(client.idPartner, client.partnerType, true),
              visible: !client.active
            },
          ]}
        />

      ),
    },
  ];

  return (
    <>
      <SendEmailModal
        isOpen={openEmail}
        onClose={()=>setOpenEmail(false)}
        defaultTo={partner?.email!}
        recipientName={partner?.partnerName!}
      />


      <AddDocumentModal
        open={openAddDocument}
        loading={addDocumentLoading}
        hasPatent={partner?.patente? false : true}
        type={addDocumentType}
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
        emptyMessage="Aucun client trouvé."
        totalCount={totalElements}
        countLabel={(count) =>
          `${count} client${count > 1 ? "s" : ""} trouvé${count > 1 ? "s" : ""}`
        }
      />
    </>
  );
}

