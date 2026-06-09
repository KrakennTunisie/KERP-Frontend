import { Building2, MapPin } from "lucide-react";

type AddressBoxProps = {
  title: string;
  street1?: string;
  street2?: string;
  zip?: string;
  city?: string;
  state?: string;
  country?: string;
  type?: string | null;
};

export default function AddressBox({
  title,
  street1,
  street2,
  zip,
  city,
  state,
  country,
  type,
}: AddressBoxProps) {
  const addressRows = [
    { label: "Rue N°1", value: street1 },
    { label: "Rue N°2", value: street2 },
    { label: "Code postal", value: zip },
    { label: "Ville", value: city },
    { label: "Région / État", value: state },
    { label: "Pays", value: country },
  ];

  const Icon = type === "Billing Address" ? Building2 : MapPin;

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-4 w-4" />
        </div>

        <div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
            {title}
          </h3>
          <p className="mt-0.5 text-xs font-medium text-slate-400">
            Informations d’adresse
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2.5">
        {addressRows.map((row) => (
          <div
            key={row.label}
            className="flex items-start justify-between gap-4 rounded-xl px-2 py-1.5 transition-colors hover:bg-slate-50"
          >
            <span className="min-w-[95px] text-xs font-semibold text-slate-400">
              {row.label}
            </span>

            <span className="text-right text-sm leading-5 text-slate-800 font-medium font-['Inter']">
              {row.value || "-"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}