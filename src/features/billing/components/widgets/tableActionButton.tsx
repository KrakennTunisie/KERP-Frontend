export function TableActionButton({
  title,
  icon: Icon,
  onClick,
  disabled,
  variant = "blue",
}: {
  title: string;
  icon: React.ElementType;
  onClick: () => void;
  disabled?: boolean;
  variant?: "blue" | "violet" | "amber" | "danger" | "emerald";
}) {
  const variants = {
    blue:
      "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 hover:text-blue-700",
    violet:
      "bg-violet-50 text-violet-600 border-violet-100 hover:bg-violet-100 hover:text-violet-700",
    amber:
      "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100 hover:text-amber-700",
    danger:
      "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100 hover:text-rose-700",
    emerald:
      "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 hover:text-emerald-700",
  };

  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]}`}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}