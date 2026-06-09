import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/shared/utils/cn";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer flex size-5 shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white shadow-sm outline-none transition-all",
        "hover:border-slate-400 hover:bg-slate-50",
        "focus-visible:border-blue-500 focus-visible:ring-4 focus-visible:ring-blue-100",
        "data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white",
        "aria-invalid:border-red-500 aria-invalid:ring-4 aria-invalid:ring-red-100",
        "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current"
      >
        <CheckIcon className="size-3.5 stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };