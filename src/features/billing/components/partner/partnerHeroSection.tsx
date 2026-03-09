"use client";

import Link from "next/link";
import { ArrowLeft, MapPin, Mail, Phone, LucideIcon } from "lucide-react";

type PartnerHeaderProps = {
  partner: {
    name: string;
    identifier: string;
    address: string;
    city: string;
    postalCode: string;
    email?: string;
    phone?: string;
  };

  pageConfig: {
    backHref: string;
    backLabel: string;
    title: string;
    badgeClass: string;
    heroIconClass: string;
    heroInfoIconClass: string;
  };

  icon: LucideIcon;
};

export default function PartnerHeader({
  partner,
  pageConfig,
  icon: Icon,
}: PartnerHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-100 px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          href={pageConfig.backHref}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {pageConfig.backLabel}
        </Link>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-6">

            {/* Icon */}
            <div
              className={`w-20 h-20 rounded-[24px] flex items-center justify-center shadow-xl ${pageConfig.heroIconClass}`}
            >
              <Icon className="w-10 h-10 text-white" />
            </div>

            {/* Partner Info */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-black text-gray-900 tracking-tighter">
                  {partner.name}
                </h1>

{/*                 <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${pageConfig.badgeClass}`}
                >
                  {pageConfig.title}
                </span> */}
              </div>

{/*               <p className="text-sm font-bold text-gray-600 mb-4">
                MF: {partner.identifier}
              </p> */}

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className={`w-4 h-4 ${pageConfig.heroInfoIconClass}`} />
                  <span className="text-sm font-bold">
                    {partner.address}, {partner.city} {partner.postalCode}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className={`w-4 h-4 ${pageConfig.heroInfoIconClass}`} />
                  <span className="text-sm font-bold">
                    {partner.email ?? "-"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className={`w-4 h-4 ${pageConfig.heroInfoIconClass}`} />
                  <span className="text-sm font-bold">
                    {partner.phone ?? "-"}
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}