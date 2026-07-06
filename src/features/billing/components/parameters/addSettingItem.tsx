import { useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/shared/components/ui/modal";

export type SettingFormData = {
  code: string;
  label: string;
  description: string;
};

type AddSettingModalProps = {
  open: boolean;
  title: string;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: SettingFormData) => void;
};

export default function AddSettingModal({
  open,
  title,
  loading = false,
  onClose,
  onSubmit,
}: AddSettingModalProps) {
  const [form, setForm] = useState<SettingFormData>({
    code: "",
    label: "",
    description: "",
  });

  const handleChange =
    (field: keyof SettingFormData) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <Modal
      open={open}
      title={title}
      onClose={ onClose}
      footer={
        <>
          <button
            disabled={loading}
            onClick={onClose}
            className="
              inline-flex h-10 items-center justify-center
              rounded-xl border border-slate-200 bg-white
              px-5 text-sm font-semibold text-slate-700
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:bg-slate-100
            "
          >
            Annuler
          </button>

          <button
            disabled={
              loading ||
              !form.code.trim() ||
              !form.label.trim()
            }
            onClick={handleSubmit}
            className="
              inline-flex h-10 items-center gap-2
              rounded-xl bg-blue-600 px-5
              text-sm font-semibold text-white
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:bg-blue-400
            "
          >
            <Plus className="h-4 w-4" />
            {loading ? "Création..." : "Créer"}
          </button>
        </>
      }
    >
      <div className="space-y-5">

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Code <span className="text-rose-500">*</span>
          </label>

          <input
            value={form.code}
            onChange={handleChange("code")}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            placeholder="Ex : SALE"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Libellé <span className="text-rose-500">*</span>
          </label>

          <input
            value={form.label}
            onChange={handleChange("label")}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            placeholder="Ex : Vente"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            rows={4}
            value={form.description}
            onChange={handleChange("description")}
            className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            placeholder="Décrivez cet élément..."
          />
        </div>

      </div>
    </Modal>
  );
}