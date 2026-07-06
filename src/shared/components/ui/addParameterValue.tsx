"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import LoadingButton from "@/shared/components/ui/loadingButton";

interface AddOptionModalProps {
  isOpen: boolean;
  title: string;
  label: string;
  placeholder?: string;
  inputType?: "text" | "number";
  min?: number;
  validate?: (value: string) => string | null; // retourne un message d'erreur ou null
  onClose: () => void;
  onAdd: (value: string) => void | Promise<void>;
}

export default function AddParameterModal({
  isOpen,
  title,
  label,
  placeholder = "",
  inputType = "text",
  min,
  validate,
  onClose,
  onAdd,
}: AddOptionModalProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setValue("");
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    const validationError = validate ? validate(value) : null;
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      await onAdd(value.trim());
      onClose();
    } catch (err) {
      setError("Une erreur est survenue lors de l'ajout. Réessayez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-300 transition hover:text-red-400"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5">
          <Label htmlFor="add-option-value">{label}</Label>
          <Input
            id="add-option-value"
            type={inputType}
            min={min}
            autoFocus
            value={value}
            placeholder={placeholder}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            className="mt-1 bg-slate-50"
          />
          {error && <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <LoadingButton
            type="button"
            onClick={handleSubmit}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Ajouter
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}