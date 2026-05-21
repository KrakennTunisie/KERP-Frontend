import { Pencil, Trash } from "lucide-react";

type RowActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function RowActions({ onEdit, onDelete }: RowActionsProps) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={onEdit}
        title="Modifier"
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-100 hover:border-yellow-200 transition cursor-pointer"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={onDelete}
        title="Supprimer"
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 hover:border-rose-200 transition cursor-pointer"
      >
        <Trash className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}