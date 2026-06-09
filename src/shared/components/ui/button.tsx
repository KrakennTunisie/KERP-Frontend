import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/utils/cn";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold outline-none transition-all",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white shadow-sm hover:bg-blue-700 hover:shadow-md focus-visible:ring-4 focus-visible:ring-blue-100 active:scale-[0.98]",

        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700 hover:shadow-md focus-visible:ring-4 focus-visible:ring-red-100 active:scale-[0.98]",

        outline:
          "border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-4 focus-visible:ring-slate-100 active:scale-[0.98]",

        secondary:
          "bg-slate-100 text-slate-800 hover:bg-slate-200 focus-visible:ring-4 focus-visible:ring-slate-100 active:scale-[0.98]",

        ghost:
          "text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-4 focus-visible:ring-slate-100 active:scale-[0.98]",

        link:
          "h-auto rounded-none px-0 py-0 text-blue-600 underline-offset-4 hover:underline focus-visible:ring-0",
      },

      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-xs",
        lg: "h-11 px-6 text-sm",
        icon: "size-10 rounded-xl",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  disabled,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      disabled={disabled}
      className={cn(
        buttonVariants({ variant, size }),
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60",
        "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };