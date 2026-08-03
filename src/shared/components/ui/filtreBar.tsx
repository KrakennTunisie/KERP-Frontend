import { Search, ChevronDown, RotateCcw } from "lucide-react";

type SelectOption = {
  label: string;
  value: string;
};

type FiltersBarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;

  cityValue: string;
  onCityChange: (value: string) => void;
  cityOptions: SelectOption[];

  onReset?: () => void;

  searchPlaceholder?: string;
  cityLabel?: string;
};

export function FiltersBar({
  searchValue,
  onSearchChange,
  cityValue,
  onCityChange,
  cityOptions,
  onReset,
  searchPlaceholder = "Nom, MF ou email...",
  cityLabel = "Pays",
}: FiltersBarProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm font-[Inter,system-ui,sans-serif]">
      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_auto] gap-3 md:items-end">
        {/* Search */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.14em]">
            Recherche
          </label>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />

            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:bg-white focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* City */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.14em]">
            {cityLabel}
          </label>

          <div className="relative">
            <select
              value={cityValue}
              onChange={(e) => onCityChange(e.target.value)}
              disabled={cityOptions.length === 0}
              className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-9 text-xs font-medium text-slate-900 outline-none transition hover:bg-white focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cityOptions.length === 0 ? (
                <option value="">Aucun pays disponible</option>
              ) : (
                <>
                  <option value="all">Toutes les pays</option>
                  {cityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </>
              )}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Reset */}
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Réinitialiser
          </button>
        )}
      </div>
    </div>
  );
}