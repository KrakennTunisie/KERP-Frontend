import { z } from "zod";
import { SettingTypeSchema } from "../types/settingType";

export const SettingBaseSchema = z.object({
  code: z.string().min(1, "Le code est obligatoire").min(3, "Code doit être au moins de 3 caractères"),
  label: z.string().min(1, "Label est obligatoire").min(3, "Label doit être au moins de 3 caractères"),
  description: z.string(),
  active: z.boolean(),
  settingType: SettingTypeSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type SettingBase = z.infer<typeof SettingBaseSchema>;

export const CreateSettingSchema = SettingBaseSchema.omit({
  active: true,
  createdAt: true,
  updatedAt: true,
});

export type CreateSetting = z.infer<typeof CreateSettingSchema>;

export const SettingPageItemSchema = z.object({
  code: z.string(),
  label: z.string(),
  active: z.boolean(),
  badge: z.string().optional(),
  settingType:SettingTypeSchema,
});

export type SettingPageItem = z.infer<typeof SettingPageItemSchema>;

export const UpdateSettingSchema = CreateSettingSchema.partial();

export type UpdateSetting = z.infer<typeof UpdateSettingSchema>;