import { z } from "zod";
import { PermissionDTOSchema } from "./permission";



/**
 * Role
 */
export const RoleSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, "Role name is required"),
  description: z.string().optional().nullable(),
  permissions: z.array(PermissionDTOSchema).default([]),
});

export type Role = z.infer<typeof RoleSchema>;


/**
 * Create Role
 */
export const CreateRoleSchema = z.object({
  name: z.string().min(3, "Le nom du rôle est obligatoire"),
  description: z.string().nullable().optional(),
  permissions: z
    .array(PermissionDTOSchema)
    .min(1, "Veuillez sélectionner au moins une permission"),
});

export type CreateRole = z.infer<typeof CreateRoleSchema>;