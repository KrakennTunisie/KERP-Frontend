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
  username:z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),
  enabled:z.boolean(),
  phone: z.string(),

  role: UserRoleSchema,
  status: UserStatusSchema,

  createdAt: z.date(),
});

export const CreateUserSchema = UserSchema.omit({
  id: true,
  username: true,
  createdAt: true,
  enabled:true
}).extend({
  firstName: z.string().trim().min(1, "Le prénom est obligatoire"),
  lastName: z.string().trim().min(1, "Le nom est obligatoire"),
  email: z.email("Adresse e-mail invalide").trim(),
  phone: z.string().trim().min(1, "Le numéro de téléphone est obligatoire"),
});

export type CreateUser = z.infer<typeof CreateUserSchema>;


export type User = z.infer<typeof UserSchema>;