import { z } from "zod";

export const SettingBaseSchema = z.object({
  code: z.string().min(1),
  label: z.string().min(1),
  description: z.string().default(""),
  isActive: z.boolean(),
  badge: z.string().optional(),
  type: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type SettingBase = z.infer<typeof SettingBaseSchema>;

export const CreateSettingSchema = SettingBaseSchema.omit({
  isActive: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateSetting = z.infer<typeof CreateSettingSchema>;

export const SettingPageItemSchema = z.object({
  code: z.string(),
  label: z.string(),
  isActive: z.boolean(),
  badge: z.string().optional(),
});

export type SettingPageItem = z.infer<typeof SettingPageItemSchema>;

export const UpdateSettingSchema = CreateSettingSchema.partial();

export type UpdateSetting = z.infer<typeof UpdateSettingSchema>;