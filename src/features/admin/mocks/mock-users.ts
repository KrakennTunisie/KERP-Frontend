import { z } from "zod";
import { FilterOption } from "@/shared/components/widgets/barFilter";

/* ============================
 * Enums
 * ============================ */

export const UserStatusSchema = z.enum([
  "ACTIVE",
  "INACTIVE",
  "BLOCKED",
]);

export type UserStatus = z.infer<typeof UserStatusSchema>;

export const UserRoleSchema = z.enum([
  "ADMIN",
  "MANAGER",
  "ACCOUNTANT",
  "CLIENT",
  "SUPPLIER",
  "USER",
]);

export type UserRole = z.infer<typeof UserRoleSchema>;

/* ============================
 * Filter Options
 * ============================ */

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

/* ============================
 * User Schema
 * ============================ */

export const UserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  phone: z.string(),

  role: UserRoleSchema,
  status: UserStatusSchema,

  createdAt: z.date(),
});

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
}).extend({
  firstName: z.string().trim().min(1, "Le prénom est obligatoire"),
  lastName: z.string().trim().min(1, "Le nom est obligatoire"),
  email: z.email("Adresse e-mail invalide").trim(),
  phone: z.string().trim().min(1, "Le numéro de téléphone est obligatoire"),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;


export type User = z.infer<typeof UserSchema>;

/* ============================
 * Mock Data
 * ============================ */

export const mockUsers: User[] = [
  {
    id: "USR-001",
    firstName: "Ahmed",
    lastName: "Ben Ali",
    email: "ahmed.benali@example.com",
    phone: "12345689",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: new Date("2026-01-15"),
  },
  {
    id: "USR-002",
    firstName: "Sarra",
    lastName: "Trabelsi",
    email: "sarra.trabelsi@example.com",
    phone: "",
    role: "MANAGER",
    status: "ACTIVE",
    createdAt: new Date("2026-02-10"),
  },
  {
    id: "USR-003",
    firstName: "Mohamed",
    lastName: "Jaziri",
    email: "m.jaziri@example.com",
    phone: "",
    role: "ACCOUNTANT",
    status: "INACTIVE",
    createdAt: new Date("2025-12-01"),
  },
  {
    id: "USR-004",
    firstName: "Leila",
    lastName: "Hamdi",
    email: "leila.hamdi@example.com",
    phone: "",
    role: "USER",
    status: "ACTIVE",
    createdAt: new Date("2026-03-21"),
  },
  {
    id: "USR-005",
    firstName: "Youssef",
    lastName: "Mansouri",
    email: "youssef.mansouri@example.com",
    phone: "",
    role: "USER",
    status: "BLOCKED",
    createdAt: new Date("2025-11-18"),
  },
  {
    id: "USR-006",
    firstName: "Nour",
    lastName: "Chaabane",
    email: "nour.chaabane@example.com",
    phone: "",
    role: "MANAGER",
    status: "ACTIVE",
    createdAt: new Date("2026-04-02"),
  },
  {
    id: "USR-007",
    firstName: "Walid",
    lastName: "Kefi",
    email: "walid.kefi@example.com",
    phone: "",
    role: "ACCOUNTANT",
    status: "ACTIVE",
    createdAt: new Date("2026-02-28"),
  },
  {
    id: "USR-008",
    firstName: "Amira",
    lastName: "Ben Salem",
    email: "amira.bensalem@example.com",
    phone: "",
    role: "USER",
    status: "INACTIVE",
    createdAt: new Date("2025-10-14"),
  },
];