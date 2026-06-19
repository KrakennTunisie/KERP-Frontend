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
   <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

  {/* Header */}
  <div className="mb-3 flex items-center gap-2.5">

    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
      <Icon className="h-3.5 w-3.5" />
    </div>

    <div className="min-w-0">
      <h3 className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>

      <p className="text-xs text-slate-400">
        Informations d’adresse
      </p>
    </div>

  </div>

  {/* Content */}
  <div className="space-y-1.5">

    {addressRows.map((row) => (
      <div
        key={row.label}
        className="flex items-start justify-between gap-3 py-1"
      >

        <span className="min-w-[90px] text-[11px] font-medium text-slate-400">
          {row.label}
        </span>

        <span className="text-right text-xs font-medium text-slate-800 break-words">
          {row.value ?? "-"}
        </span>

      </div>
    ))}

  </div>

</div>
  );
}