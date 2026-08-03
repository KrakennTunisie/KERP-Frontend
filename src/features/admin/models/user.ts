import { z } from "zod";
import { FilterOption } from "@/shared/components/widgets/barFilter";
import { RoleSchema } from "./role";

/* ============================
 * Enums
 * ============================ */

export const UserStatusSchema = z.enum([
  "ACTIVE",
  "INACTIVE",
  "BLOCKED",
]);

export type UserStatus = z.infer<typeof UserStatusSchema>;

export const UserStatusWithAllSchema = z.enum([
  "ALL",
  "ACTIVE",
  "INACTIVE",
  "BLOCKED",
]);

export type UserStatusWithAll = z.infer<typeof UserStatusWithAllSchema>;

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
  phoneNumber: z.string(),

  roles: z.string(),
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
  phoneNumber: z.string().trim().min(1, "Le numéro de téléphone est obligatoire"),
});

export const UserResponseSchema = z.object({
  idUser: z.uuid(),
  keycloakUserId: z.string(),

  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),

  phoneNumber: z.string().nullable().optional(),
  status: UserStatusSchema,

  enabled: z.boolean(),
  createdAt: z.date(),

  roles: z.array(z.string()),
});


export const UserDetailsSchema = z.object({
  idUser: z.uuid(),
  keycloakUserId: z.string(),

  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.email(),

  phoneNumber: z.string().nullable().optional(),
  status: UserStatusSchema,

  enabled: z.boolean(),
  createdAt: z.date(),

  roles: z.array(RoleSchema).default([]),
});



export type UserResponse = z.infer<typeof UserResponseSchema>;

export type CreateUser = z.infer<typeof CreateUserSchema>;


export type User = z.infer<typeof UserSchema>;

export type UserDetails = z.infer<typeof UserDetailsSchema>;