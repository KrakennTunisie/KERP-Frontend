export function SectionTitle({ number, label }: { number: string; label: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-[11px] font-black text-blue-600">{number}</span>
            </div>
            <span className="text-sm font-black text-slate-800 tracking-widest">{label}</span>
        </div>
    );
}