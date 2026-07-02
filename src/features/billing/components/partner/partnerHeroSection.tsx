"use client";

import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  LucideIcon,
  Send,
  UserMinus,
  UserX,
  UserCheck,
  Signature,
  ScrollText,
  Pencil,
} from "lucide-react";
import { ActionMenu } from "@/shared/components/ui/actionMenuItem";
import { PartnerAllDetails } from "../../models/partner";
import ClientDeleteModal from "../client/deleteClientModal";
import { partnerTypeSchema } from "../../types/partnerType";
import SupplierDeleteModal from "../supplier/deleteSupplierModal";
import { partnerDocumentType, PartnerDocumentType } from "../../types/documentType";

type PartnerHeaderProps = {
  partner: PartnerAllDetails;

  pageConfig: {
    backHref: string;
    backLabel: string;
    title: string;
    badgeClass: string;
    heroIconClass: string;
    heroInfoIconClass: string;
  };
  partnerType: string
  setOpen: () => void;
  onUpdate: () => void;
  setDeleteOpen: (status: boolean) => void,
  deleteOpen: boolean,
  icon: LucideIcon;
  onRefresh: () => void,
  updatePartnerStatus: (staus: boolean) => void,
  onAddDocument: (type: PartnerDocumentType) => void;
};

export default function PartnerHeader({
  partner,
  pageConfig,
  icon: Icon,
  partnerType,
  setOpen,
  onUpdate,
  onRefresh,
  updatePartnerStatus,
  deleteOpen,
  setDeleteOpen,
  onAddDocument
}: PartnerHeaderProps) {

  return (
    <div className="border-b border-slate-100 bg-white px-6 py-5 font-[Inter,system-ui,sans-serif]">
      <div className="mx-auto">

        {partnerType == partnerTypeSchema.enum.CLIENT ? (
          <ClientDeleteModal
            open={deleteOpen}
            onClose={() => setDeleteOpen(false)}
            onCreated={onRefresh}
            confirmDeleteId={partner.idPartner}
          />
        ) : (
          <SupplierDeleteModal
            open={deleteOpen}
            onClose={() => setDeleteOpen(false)}
            onCreated={onRefresh}
            confirmDeleteId={partner.idPartner}
          />
        )}

        {/* Back */}
        <Link
          href={pageConfig.backHref}
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
          {pageConfig.backLabel}
        </Link>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

          {/* Left */}
          <div className="flex items-start gap-4">

            {/* Icon */}
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-sm ${pageConfig.heroIconClass}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>

            {/* Info */}
            <div className="min-w-0">

              {/* Title + status */}
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-xl font-bold tracking-tight text-slate-900">
                  {partner.companyName}
                </h1>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${partner.active
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                      : "bg-rose-50 text-rose-700 ring-rose-200"
                    }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${partner.active ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                  />
                  {partner.active ? "Actif" : "Inactif"}
                </span>
              </div>

              {/* Meta */}
              <div className="mt-2 grid grid-cols-1 gap-1 md:grid-cols-3">

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  <span className="truncate">
                    {partner.billingAddress.region && partner.billingAddress.region !== "" ? partner.billingAddress.region : "-"}
                    {partner.billingAddress.city && partner.billingAddress.city !== "" ? partner.billingAddress.city : "-"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">
                    {partner.email && partner.email !== 'null' ? partner.email : '-'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Phone className="h-3.5 w-3.5" />
                  <span>
                    {partner.professionnalPhoneNumber && partner.professionnalPhoneNumber.toString() !== "" ? partner.professionnalPhoneNumber : "-"}
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="shrink-0">
            <ActionMenu
              orientation="vertical"
              items={[
                {
                  label: "Modifier",
                  icon: Pencil,
                  hover: "hover:bg-amber-50",
                  onClick: onUpdate,
                  visible: true
                }, {
                  label: "Envoyer email",
                  icon: Send,
                  hover: "hover:bg-blue-50",
                  onClick: setOpen,
                  visible: partner.email!=""
                },
                {
                  label: "Ajouter un document",
                  icon: Signature,
                  hover: "hover:bg-emerald-50",
                  onClick: () => onAddDocument(partnerDocumentType.enum.CONTRACT),
                  visible: true
                },
                {
                  label: "Désactiver",
                  icon: UserX,
                
                  hover: "hover:bg-amber-50",
                  onClick: () => updatePartnerStatus(false),
                  visible: partner.active
                },
                {
                  label: "Activer",
                  icon: UserCheck,
              
                  hover: "hover:bg-emerald-50",
                  onClick: () => updatePartnerStatus(true),
                  visible: !partner.active
                },
                
              ]}
            />
          </div>

        </div>
      </div>
    </div>
  );
}