"use client";

type PartnerInfoCardProps = {
  partner: {
    identifier: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    createdAt: string;
  };

  typeLabel: string;
};

export default function PartnerInfoCard({
  partner,
  typeLabel,
}: PartnerInfoCardProps) {
  return (
    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-8">
      <h2 className="text-xl font-black text-gray-900 tracking-tighter mb-6">
        Informations Détaillées
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Left Column */}
        <div className="space-y-4">

          <InfoItem
            label="Matricule Fiscal"
            value={partner.identifier}
          />

          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Adresse Complète
            </p>

            <p className="text-sm font-bold text-gray-900">
              {partner.address}
            </p>

            <p className="text-sm font-bold text-gray-900">
              {partner.city}, {partner.postalCode}
            </p>

            <p className="text-sm font-bold text-gray-900">
              {partner.country}
            </p>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-4">

          <InfoItem
            label="Type"
            value={typeLabel}
          />

          <InfoItem
            label="Partenaire Depuis"
            value={new Date(partner.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />

        </div>

      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
        {label}
      </p>
      <p className="text-sm font-black text-gray-900">
        {value}
      </p>
    </div>
  );
}