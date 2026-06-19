import { FilterOption } from "@/shared/components/widgets/barFilter";

export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export type UserRole =
  | "ADMIN"
  | "MANAGER"
  | "ACCOUNTANT"
  | "CLIENT"
  | "SUPPLIER"
  | "USER";


export const USER_ROLE_OPTIONS: FilterOption<UserRole>[] = [
  { value: "ADMIN", label: "Administrateur" },
  { value: "MANAGER", label: "Manager" },
  { value: "ACCOUNTANT", label: "Comptable" },
  { value: "CLIENT", label: "Client" },
  { value: "SUPPLIER", label: "Fournisseur" },
  { value: "USER", label: "Utilisateur" },
];

export const USER_STATUS_OPTIONS: FilterOption<UserStatus>[] = [
  { value: "ACTIVE", label: "Actif" },
  { value: "INACTIVE", label: "Inactif" },
  { value: "BLOCKED", label: "Bloqué" },
];

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;

  role: UserRole;
  status: UserStatus;

  createdAt: Date;
}

export const mockUsers: User[] = [
  {
    id: "USR-001",
    firstName: "Ahmed",
    lastName: "Ben Ali",
    email: "ahmed.benali@example.com",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: new Date("2026-01-15"),
  },

  {
    id: "USR-002",
    firstName: "Sarra",
    lastName: "Trabelsi",
    email: "sarra.trabelsi@example.com",
    role: "MANAGER",
    status: "ACTIVE",
    createdAt: new Date("2026-02-10"),
  },

  {
    id: "USR-003",
    firstName: "Mohamed",
    lastName: "Jaziri",
    email: "m.jaziri@example.com",
    role: "ACCOUNTANT",
    status: "INACTIVE",
    createdAt: new Date("2025-12-01"),
  },

  {
    id: "USR-004",
    firstName: "Leila",
    lastName: "Hamdi",
    email: "leila.hamdi@example.com",
    role: "USER",
    status: "ACTIVE",
    createdAt: new Date("2026-03-21"),
  },

  {
    id: "USR-005",
    firstName: "Youssef",
    lastName: "Mansouri",
    email: "youssef.mansouri@example.com",
    role: "USER",
    status: "BLOCKED",
    createdAt: new Date("2025-11-18"),
  },

  {
    id: "USR-006",
    firstName: "Nour",
    lastName: "Chaabane",
    email: "nour.chaabane@example.com",
    role: "MANAGER",
    status: "ACTIVE",
    createdAt: new Date("2026-04-02"),
  },

  {
    id: "USR-007",
    firstName: "Walid",
    lastName: "Kefi",
    email: "walid.kefi@example.com",
    role: "ACCOUNTANT",
    status: "ACTIVE",
    createdAt: new Date("2026-02-28"),
  },

  {
    id: "USR-008",
    firstName: "Amira",
    lastName: "Ben Salem",
    email: "amira.bensalem@example.com",
    role: "USER",
    status: "INACTIVE",
    createdAt: new Date("2025-10-14"),
  },
];