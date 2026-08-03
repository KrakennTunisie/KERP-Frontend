import { UserRole, UserStatus } from "../models/user";

export const ROLE_COLOR_MAP: Record<string, string> = {
  violet: "bg-violet-50 text-violet-700 border-violet-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  slate: "bg-slate-100 text-slate-700 border-slate-200",
};

export const getUserRoleLabel = (
  role: string
): string => {
  switch (role) {
    case "ADMIN":
      return "Administrateur";

    case "MANAGER":
      return "Manager";

    case "ACCOUNTANT":
      return "Comptable";

    case "USER":
      return "Utilisateur";
    
    case "CLIENT":
      return "Client";
    
    case "SUPPLIER":
      return "Fournisseur";

    default:
      return role;
  }
};

export const getUserRoleColor = (
  role: string
): string => {
  switch (role) {
    case "ADMIN":
      return "bg-violet-50 text-violet-700 border border-violet-200";

    case "MANAGER":
      return "bg-blue-50 text-blue-700 border border-blue-200";

    case "ACCOUNTANT":
      return "bg-cyan-50 text-cyan-700 border border-cyan-200";

    case "USER":
      return "bg-slate-100 text-slate-700 border border-slate-200";

    case "CLIENT":
      return "bg-slate-100 text-slate-700 border border-slate-200";

    case "SUPPLIER":
      return "bg-slate-100 text-slate-700 border border-slate-200";

    default:
      return "bg-slate-50 text-slate-600 border border-slate-200";
  }
};

export const getUserStatusLabel = (
  status: UserStatus
): string => {
  switch (status) {
    case "ACTIVE":
      return "Actif";

    case "INACTIVE":
      return "Inactif";

    case "BLOCKED":
      return "Bloqué";

    default:
      return status;
  }
};

export const getUserStatusColor = (
  status: UserStatus
): string => {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";

    case "INACTIVE":
      return "bg-amber-50 text-amber-700 border border-amber-200";

    case "BLOCKED":
      return "bg-rose-50 text-rose-700 border border-rose-200";

    default:
      return "bg-slate-50 text-slate-600 border border-slate-200";
  }
};