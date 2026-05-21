type AddressBoxProps = {
  title: string;
  street1?: string;
  street2?: string;
  zip?: string;
  city?: string;
  state?: string;
  country?: string;
};

export default function AddressBox({
  title,
  street1,
  street2,
  zip,
  city,
  state,
  country,
}: AddressBoxProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
        {title}
      </p>

      <div className="space-y-1">
        <p className="text-sm font-bold text-gray-900">
          {street1 || "-"}
        </p>

        {street2 && (
          <p className="text-sm font-medium text-gray-700">
            {street2}
          </p>
        )}

        <p className="text-sm font-medium text-gray-700">
          {[zip, city].filter(Boolean).join(" ") || "-"}
        </p>

        <p className="text-sm font-medium text-gray-700">
          {[state, country].filter(Boolean).join(", ") || "-"}
        </p>
      </div>
    </div>
  );
}