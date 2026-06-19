"use client";

import DocumentItem from "@/shared/components/ui/documentItem";
import { DocumentOrFile, DocumentPreviewModal } from "@/shared/components/ui/documentPreviewModal";
import InfoItem from "@/shared/components/ui/infoItem";
import { BadgeCheck } from "lucide-react";
import { useState } from "react";
import { Partner } from "../../models/partner";
import DocumentsList from "@/shared/components/ui/documentItem";



type PartnerInfoCardProps = {
  partner: Partial<Partner>
  typeLabel: string;
};



export default function PartnerInfoCard({
  partner,
  typeLabel,
}: PartnerInfoCardProps) {
  const [previewDocument, setPreviewDocument] =useState<DocumentOrFile>(null);
  return (
    <>
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tighter">
              Informations détaillées
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-1">
              Aperçu des informations administratives et des pièces jointes
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl bg-gray-50 border border-gray-200">
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-gray-700">
              Partenaire actif
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoItem
              label="Matricule fiscal"
              value={partner.taxRegistrationNumber}
            />

            <InfoItem
              label="Type"
              value={typeLabel}
            />

            <InfoItem
              label="IBAN"
              value={partner.iban}
            />

            <InfoItem
              label="Partenaire depuis"
              value={"2024-05-02"}
            />
          </div>

          <div className="space-y-4">

            <DocumentsList
              label="RNE"
              documents={partner.rne ?? []}
              onOpen={setPreviewDocument}
            />

            <DocumentsList
              label="Contrat"
              documents={partner.contract ?? []}
              onOpen={setPreviewDocument}
            />

            {partner.patente &&
              <DocumentsList
                label="Patente"
                documents={[partner.patente] }
                onOpen={setPreviewDocument}
              />
            }
          </div>
        </div>
      </div>

      <DocumentPreviewModal
        open={!!previewDocument}
        onClose={() => setPreviewDocument(null)}
        document={previewDocument}
      />
    </>
  );

}

