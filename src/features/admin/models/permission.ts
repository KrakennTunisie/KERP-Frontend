import { z } from "zod";

/**
 * Permission
 */
export const PermissionSchema = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
});

/**
 * Permission associated with a client
 * Used for role creation/update requests.
 */
export const PermissionDTOSchema = z.object({
  clientId: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
});

/**
 * Permissions grouped by client
 * Used by GET /permissions
 */

export const affectFormAttributes = z.object({
    permissions: z.array(PermissionDTOSchema).min(1, "Veuillez sélectionner au moins une permission"),
})

export const ClientPermissionsSchema = z.object({
  clientId: z.string(),
  permissions: z.array(PermissionSchema),
});

export type Permission = z.infer<typeof PermissionSchema>;
export type PermissionDTO = z.infer<typeof PermissionDTOSchema>;
export type ClientPermissions = z.infer<typeof ClientPermissionsSchema>;

export type AffectFormAttributes = z.infer<typeof affectFormAttributes>;
