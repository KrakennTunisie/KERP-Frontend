export function SectionTitle({
  number,
  label,
  invoiceType,
}: {
  number: string;
  label: string;
  invoiceType ?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-7 h-7 rounded-full ${invoiceType === 'SALE' || invoiceType === 'PURCHASE' ? 'bg-blue-100' : 'bg-rose-50'} flex items-center justify-center`}
      >
        <span
          className={`text-[11px] font-black ${invoiceType === 'SALE' || invoiceType === 'PURCHASE' ? 'text-blue-600' : 'text-red-600'}`}
        >
          {number}
        </span>
      </div>
      <span className="text-sm font-black text-slate-800 tracking-widest">{label}</span>
    </div>
  );
}