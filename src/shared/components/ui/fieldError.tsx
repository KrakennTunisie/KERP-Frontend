import { CircleAlert } from "lucide-react";

type FieldErrorProps = {
  error?: string;
};

export function FieldError({ error }: FieldErrorProps) {
  if (!error) return null;

  return (
    <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
      <CircleAlert className="h-3.5 w-3.5 shrink-0" />
      {error}
    </p>
  );
}