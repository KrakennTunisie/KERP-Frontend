import { z } from "zod";

import { CreateSettingSchema, SettingBaseSchema, SettingPageItemSchema, UpdateSettingSchema } from "./SettingItem";

export const TVARateSchema = SettingBaseSchema.extend({
    idTVARate: z.string(),
    settingType: z.literal("TVA_RATE"),
  });

export type TVARate = z.infer<typeof TVARateSchema>;

export const CreateTVARateSchema = CreateSettingSchema.extend({
    settingType: z.literal("TVA_RATE"),
    label: z
    .string()
    .min(1, "Le libellé est obligatoire")
    .regex(/^\d+$/, "Le libellé doit être un nombre")
    .refine((value) => {
        const number = Number(value);
        return number > 0 && number <= 100;
    }, "Le libellé doit être un nombre positif inférieur ou égal à 100"),
});

export type CreateTVARate = z.infer<
  typeof CreateTVARateSchema
>;

export const UpdateTVARateSchema = UpdateSettingSchema.extend({
    settingType: z.literal("TVA_RATE"),
});

export type UpdateTVARate = z.infer<
  typeof UpdateTVARateSchema
>;

export const TVARatePageItemSchema =
  SettingPageItemSchema.extend({
    idTVARate: z.string(),
    settingType: z.literal("TVA_RATE"),
  });

export type TVARatePageItem = z.infer<
  typeof TVARatePageItemSchema
>;