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
} from "lucide-react";
import { ActionMenu } from "@/shared/components/ui/actionMenuItem";
import { Partner, PartnerAllDetails } from "../../models/partner";
import ClientDeleteModal from "../client/deleteClientModal";
import { partnerTypeSchema } from "../../types/partnerType";
import SupplierDeleteModal from "../supplier/deleteSupplierModal";
import usePartnerList from "../../hooks/usePartnerList";

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
  icon: LucideIcon;
};

export default function PartnerHeader({
  partner,
  pageConfig,
  icon: Icon,
  partnerType,
  setOpen,
}: PartnerHeaderProps) {
  const { fetchPartner, updatePartnerStatus, setDeleteConfirmId, deleteConfirmId } = usePartnerList({ partnerType });
  return (
    <div className="bg-white border-b border-slate-100 px-8 py-6 font-[Inter,system-ui,sans-serif]">
      <div className=" mx-auto">
        {partnerType == partnerTypeSchema.enum.CLIENT ? <ClientDeleteModal
          open={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId('')}
          onCreated={() => {
            fetchPartner(partner.partnerType);
          }}
          confirmDeleteId={deleteConfirmId}
        /> : <SupplierDeleteModal
          open={!!deleteConfirmId}
          onClose={() => setDeleteConfirmId('')}
          onCreated={() => {
            fetchPartner(partner.partnerType);
          }}
          confirmDeleteId={deleteConfirmId}
        />}
        {/* Back Button */}
        <Link
          href={pageConfig.backHref}
          className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900 font-semibold mb-5 transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          {pageConfig.backLabel}
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            {/* Icon */}
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${pageConfig.heroIconClass}`}
            >
              <Icon className="w-8 h-8 text-white" />
            </div>

            {/* Partner Info */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1.5">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {partner.companyName}
                </h1>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${partner.active
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-rose-50 text-rose-700 ring-rose-200"
                    }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${partner.active ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                  />
                  {partner.active ? "Activé" : "Désactivé"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 mt-3">
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin className={`w-3.5 h-3.5 ${pageConfig.heroInfoIconClass}`} />
                  <span className="text-xs font-medium leading-5">
                    {partner.billingAddress?.region}, {partner.billingAddress?.city}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                  <Mail className={`w-3.5 h-3.5 ${pageConfig.heroInfoIconClass}`} />
                  <span className="text-xs font-medium leading-5">
                    {partner.email ?? "-"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                  <Phone className={`w-3.5 h-3.5 ${pageConfig.heroInfoIconClass}`} />
                  <span className="text-xs font-medium leading-5">
                    {partner.professionnalPhoneNumber ?? "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <ActionMenu
            orientation="vertical"
            items={[
              {
                label: "Envoyer un e-mail",
                icon: Send,
                color: "text-blue-600",
                hover: "hover:bg-blue-50",
                onClick: setOpen,
              },
              partner.active == false ? {
                label: "Activer",
                icon: UserCheck,
                color: "text-emerald-600",
                hover: "hover:bg-emerald-50",
                onClick: () =>
                  updatePartnerStatus(partner, true)
              } :
                {
                  label: "Désactiver",
                  icon: UserX,
                  color: "text-amber-600",
                  hover: "hover:bg-amber-50",
                  onClick: () => updatePartnerStatus(partner, false),
                },
              {
                label: "Supprimer",
                icon: UserMinus,
                color: "text-rose-600",
                hover: "hover:bg-rose-50",
                onClick: () => setDeleteConfirmId(partner.idPartner),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}