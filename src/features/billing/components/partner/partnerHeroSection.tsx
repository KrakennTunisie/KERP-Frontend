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
import { Partner } from "../../models/partner";

type PartnerHeaderProps = {
  partner: Partial<Partner>;

  pageConfig: {
    backHref: string;
    backLabel: string;
    title: string;
    badgeClass: string;
    heroIconClass: string;
    heroInfoIconClass: string;
  };

  setOpen: () => void;
  icon: LucideIcon;
};

export default function PartnerHeader({
  partner,
  pageConfig,
  icon: Icon,
  setOpen,
}: PartnerHeaderProps) {
  return (
    <div className="bg-white border-b border-slate-100 px-8 py-6 font-[Inter,system-ui,sans-serif]">
      <div className="max-w-7xl mx-auto">
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
              <div className="flex items-center gap-3 mb-1.5">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {partner.name}
                </h1>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2 mt-3">
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin className={`w-3.5 h-3.5 ${pageConfig.heroInfoIconClass}`} />
                  <span className="text-xs font-medium leading-5">
                    {partner.address}, {partner.country}
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
                    {partner.phoneNumber ?? "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-1.5 self-start shrink-0">
            <button
              onClick={setOpen}
              title="Envoyer un e-mail"
              className="group relative inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 hover:border-blue-200 transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />

              <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                Envoyer un e-mail
              </span>
            </button>

            <button
              onClick={() => console.log("Activate")}
              title="Activate"
              className="group relative inline-flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 hover:border-emerald-200 transition cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />

              <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                Activer
              </span>
            </button>

            <button
              onClick={() => console.log("Deactivate")}
              title="Deactivate"
              className="group relative inline-flex items-center justify-center w-8 h-8 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-100 hover:border-amber-200 transition cursor-pointer"
            >
              <UserX className="w-3.5 h-3.5" />

              <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                Désactiver
              </span>
            </button>

            <button
              onClick={() => console.log("Supprimer")}
              title="Supprimer"
              className="group relative inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 hover:border-rose-200 transition cursor-pointer"
            >
              <UserMinus className="w-3.5 h-3.5" />

              <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100">
                Supprimer
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}