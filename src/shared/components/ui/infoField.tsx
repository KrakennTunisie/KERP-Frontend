type InfoFieldProps = {
  label: string;
  value?: React.ReactNode;
  breakWords?: boolean;
};

export default function InfoField({ label, value, breakWords = false }: InfoFieldProps) {
  return (
    <div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
        {label}
      </p>

      <p
        className={`text-sm font-bold text-gray-900 ${
          breakWords ? "break-words" : ""
        }`}
      >
        {value || "-"}
      </p>
    </div>
  );
}