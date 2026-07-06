import { Modal } from "@/shared/components/ui/modal";
import { CalendarDays, CheckCircle2, CircleMinus,  FileText, Hash,  Tag } from "lucide-react";
import { SettingItem } from "./settingCard";
import { formatDateLongWithTime } from "@/shared/utils/formatDate";

type SettingDetailsModalProps = {
  open: boolean;
  item?: SettingItem | null;
  title: string;
  onClose: () => void;
};

export default function SettingDetailsModal({
  open,
  item,
  title,
  onClose,
}: SettingDetailsModalProps) {
      if (!item) return null;

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
    >
    <div className="space-y-5">

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {item.label}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {item.description}
          </p>
        </div>

        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">

          <DetailRow
            icon={<Hash className="h-4 w-4" />}
            label="Code"
            value={item.code}
          />

          <DetailRow
            icon={<Tag className="h-4 w-4" />}
            label="Libellé"
            value={item.label}
          />

          <DetailRow
            icon={<FileText className="h-4 w-4" />}
            label="Description"
            value={item.description}
          />

          <DetailRow
            icon={
              item.isActive ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <CircleMinus className="h-4 w-4 text-rose-600" />
              )
            }
            label="Statut"
            value={item.isActive ? "Actif" : "Inactif"}
          />

          <DetailRow
            icon={<CalendarDays className="h-4 w-4" />}
            label="Créé le"
            value={formatDateLongWithTime(item.createdAt)}
          />

          <DetailRow
            icon={<CalendarDays className="h-4 w-4" />}
            label="Dernière modification"
            value={formatDateLongWithTime(item.updatedAt)}
          />

        </div>

      </div>
    </Modal>
  );
}

type DetailRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-sm">{label}</span>
      </div>

      <span className="max-w-[260px] text-right text-sm font-medium text-slate-900">
        {value}
      </span>
    </div>
  );
}