"use client";

import { useMemo, useState } from "react";
import { DocumentPreviewModal } from "@/shared/components/ui/documentPreviewModal";
import { BadgeCheck, CalendarDays, CreditCard, ReceiptText } from "lucide-react";
import InfoItem from "@/shared/components/ui/infoItem";
import DocumentItem from "@/shared/components/ui/documentItem";
import { Document } from "../../models/document";



type PartnerInfoCardProps = {
  partner: {
    identifier: string;
    createdAt: string;
    iban: string;
    rne?: Document;
    contract?: Document;
    patente?: Document;
  };
  typeLabel: string;
};

const mockDocument: Document = {
  fileName: "Contract",
  storageURL: "/documents/contract.pdf",
  mimeType: "application/pdf",
  idDocument: "",
  hash: ""
}

const mockImage = {
  fileName: "Image",
  fileUrl: "https://sl.bing.net/qKW5uRubng",
  mimeType: "image/jpg",
}

type PreviewDocument = Document | null;

export default function PartnerInfoCard({
  partner,
  typeLabel,
}: PartnerInfoCardProps) {
  const [previewDocument, setPreviewDocument] =
    useState<PreviewDocument>(null);

  const formattedDate = useMemo(() => {
    return new Date(partner.createdAt).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [partner.createdAt]);

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
              value={partner.identifier}
              icon={<ReceiptText className="w-5 h-5 text-gray-700" />}
            />

            <InfoItem
              label="Type"
              value={typeLabel}
              icon={<BadgeCheck className="w-5 h-5 text-gray-700" />}
            />

            <InfoItem
              label="IBAN"
              value={partner.iban}
              icon={<CreditCard className="w-5 h-5 text-gray-700" />}
            />

            <InfoItem
              label="Partenaire depuis"
              value={formattedDate}
              icon={<CalendarDays className="w-5 h-5 text-gray-700" />}
            />
          </div>

          <div className="space-y-4">
            <DocumentItem
              label="RNE"
              document={mockDocument}
              onOpen={setPreviewDocument}
            />

            <DocumentItem
              label="Contrat"
              document={partner.contract}
              onOpen={setPreviewDocument}
            />

            <DocumentItem
              label="Patente"
              document={partner.patente}
              onOpen={setPreviewDocument}
            />
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

