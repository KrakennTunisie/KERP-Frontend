type IconButtonProps = {
  icon: React.ElementType;
  title: string;
  onClick: () => void;
  variant?: "default" | "blue" | "danger" | "success" | "warning";
};

export default function IconButton({
  icon: Icon,
  title,
  onClick,
  variant = "default",
}: IconButtonProps) {
  const variants = {
    default:
      "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300",
    blue:
      "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-100 hover:border-blue-200",
    danger:
      "bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-100 hover:border-rose-200",
    success:
      "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-100 hover:border-emerald-200",
    warning:
      "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-100 hover:border-amber-200",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border transition cursor-pointer shrink-0 ${variants[variant]}`}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}