import { Check } from "lucide-react";


export type Step = "email" | "code" | "newPassword" | "success";

export const STEP_INDEX: Record<Step, number> = {
  email: 1,
  code: 2,
  newPassword: 3,
  success: 4,
};

export const STEP_LABELS = ["E-mail", "Code", "Mot de passe", "Succès"];

// ─── Stepper ───────────────────────────────────────────────────────────────────
export default function Stepper({ current }: { current: Step }) {
  const active = STEP_INDEX[current];
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEP_LABELS.map((label, i) => {
        const stepNum = i + 1;
        const done = stepNum < active;
        const isActive = stepNum === active;
        const isLast = i === STEP_LABELS.length - 1;

        return (
          <div key={label} className="flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={[
                  "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium transition-all",
                  done
                    ? "bg-blue-600 text-white"
                    : isActive
                    ? "bg-blue-600 text-white ring-4 ring-blue-100"
                    : "bg-gray-100 text-gray-400",
                ].join(" ")}
              >
                {done ? (
                  <Check
                  className="text-white-600"
                  size={14}
                  strokeWidth={2}
                />
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={[
                  "text-[9px] font-medium tracking-wide whitespace-nowrap",
                  isActive ? "text-blue-600" : done ? "text-blue-400" : "text-gray-300",
                ].join(" ")}
              >
                {label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div
                className={[
                  "h-px w-6 mb-3.5 mx-1 transition-all",
                  done ? "bg-blue-400" : "bg-gray-200",
                ].join(" ")}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}