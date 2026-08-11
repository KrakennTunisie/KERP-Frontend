"use client";

import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  X,
} from "lucide-react";

export type SummaryStatus = "loading" | "pending" | "done" | "error";

export interface AISummaryData {
  statut: "sain" | "fragile" | "critique";
  synthese: string;
  tendances: string[];
  pointsAttention: string[];
  recommandations: string[];
  genereLe?: string;
}

interface AISummaryPanelProps {
  open: boolean;
  onClose: () => void;
  /** Appelé quand l'utilisateur clique sur le bouton flottant pour rouvrir le panneau */
  onOpen: () => void;
  status: SummaryStatus;
  data: AISummaryData | null;
  onRetry?: () => void;
}

const STATUT_STYLES: Record<
  AISummaryData["statut"],
  { label: string; dot: string; badge: string }
> = {
  sain: {
    label: "Sain",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  fragile: {
    label: "Fragile",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 ring-amber-600/20",
  },
  critique: {
    label: "Critique",
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700 ring-red-600/20",
  },
};

export default function SilidingPanel({
  open,
  onClose,
  onOpen,
  status,
  data,
  onRetry,
}: AISummaryPanelProps) {
  const statutStyle = data ? STATUT_STYLES[data.statut] : null;

  return (
    <>
      {/* Bouton flottant pour rouvrir le panneau une fois fermé */}
      {!open && (
        <button
          onClick={onOpen}
          aria-label="Ouvrir le résumé IA"
          className="fixed top-1/2 right-0 -translate-y-1/2 z-40 flex items-center gap-2 rounded-l-xl bg-white pl-3 pr-2.5 py-3 shadow-lg ring-1 ring-slate-200 hover:pr-3.5 transition-all duration-200 group"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 shrink-0">
            <Sparkles className="h-3.5 w-3.5 text-white" strokeWidth={2} />
          </div>
          {statutStyle && (
            <span className={`h-1.5 w-1.5 rounded-full ${statutStyle.dot} shrink-0`} />
          )}
          <span className="max-h-0 overflow-hidden group-hover:max-h-6 transition-all duration-200 text-xs font-medium text-slate-600 whitespace-nowrap">
            Résumé IA
          </span>
        </button>
      )}

      <div
        onClick={onClose}
        className={`fixed inset-0 bg-slate-900/10 backdrop-blur-[1px] z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        role="complementary"
        aria-label="Résumé IA"
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col transform transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="relative px-6 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-sm shadow-indigo-500/30">
                <Sparkles className="h-4.5 w-4.5 text-white" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-[15px] font-semibold text-slate-900 tracking-tight">
                  Résumé IA
                </h2>
                <p className="text-xs text-slate-500">
                  Analyse automatique de votre activité
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="rounded-md p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {statutStyle && status === "done" && (
            <span
              className={`mt-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statutStyle.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${statutStyle.dot}`} />
              Santé financière : {statutStyle.label}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {status === "loading" || status === "pending" ? (
            <LoadingState />
          ) : status === "error" ? (
            <ErrorState onRetry={onRetry} />
          ) : data ? (
            <div className="space-y-6">
              {/* Synthèse */}
              {data.synthese && (
                <p className="text-[13.5px] leading-relaxed text-slate-700 font-medium">
                  {data.synthese}
                </p>
              )}

              <Section
                icon={<TrendingUp className="h-3.5 w-3.5" />}
                label="Tendances"
                accent="text-blue-600 bg-blue-50"
                items={data.tendances}
              />

              <Section
                icon={<AlertTriangle className="h-3.5 w-3.5" />}
                label="Points d'attention"
                accent="text-amber-600 bg-amber-50"
                items={data.pointsAttention}
              />

              <Section
                icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                label="Recommandations"
                accent="text-emerald-600 bg-emerald-50"
                items={data.recommandations}
              />
            </div>
          ) : null}
        </div>

        {/* Footer */}
        {status === "done" && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 tabular-nums">
              {data?.genereLe
                ? `Généré à ${new Date(data.genereLe).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : ""}
            </span>
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Régénérer
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  );
}

function Section({
  icon,
  label,
  accent,
  items,
}: {
  icon: React.ReactNode;
  label: string;
  accent: string;
  items: string[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-md ${accent}`}
        >
          {icon}
        </span>
        <h3 className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </h3>
      </div>
      <ul className="space-y-2 pl-1">
        {items.map((item, i) => (
          <li
            key={i}
            className="text-[13px] leading-relaxed text-slate-700 flex gap-2"
          >
            <span className="text-slate-300 mt-1.5 h-1 w-1 rounded-full bg-slate-300 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-3">
      <div className="h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-slate-500">Génération du résumé en cours…</p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-500" />
      </div>
      <p className="text-sm text-slate-600">Impossible de générer le résumé.</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}