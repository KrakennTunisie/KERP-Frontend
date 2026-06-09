import * as LabelPrimitive from "@radix-ui/react-label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

import { InfoIcon } from "lucide-react";

import { cn } from "@/shared/utils/cn";

type LabelProps = React.ComponentProps<typeof LabelPrimitive.Root> & {
  required?: boolean;
  tooltip?: string;
};

function Label({
  className,
  required,
  tooltip,
  children,
  ...props
}: LabelProps) {
  return (
    <div className="flex items-center gap-1.5">
      <LabelPrimitive.Root
        data-slot="label"
        className={cn(
            "group/label inline-flex w-fit items-center gap-1.5",
            "text-[13px] font-semibold leading-none tracking-tight text-slate-700",
            "transition-colors duration-200",
            "select-none",
            "peer-focus-visible:text-blue-600",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
            className,
        )}
        {...props}
        >
        <span className="truncate">{children}</span>

        {required && (
            <span
            aria-hidden="true"
            className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-50 px-1 text-[11px] font-black leading-none text-red-500"
            >
            *
            </span>
        )}
        </LabelPrimitive.Root>

      {tooltip && (
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="flex size-4 items-center justify-center rounded-full text-slate-400 transition-colors hover:text-slate-600 focus:outline-none"
              >
                <InfoIcon className="size-3.5" />
              </button>
            </TooltipTrigger>

            <TooltipContent
              side="top"
              className="max-w-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 shadow-xl"
            >
              {tooltip}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

export { Label };