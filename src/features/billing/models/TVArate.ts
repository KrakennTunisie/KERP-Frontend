import { z } from "zod";

import { CreateSettingSchema, SettingBaseSchema, SettingPageItemSchema, UpdateSettingSchema } from "./SettingItem";

export const TVARateSchema = SettingBaseSchema.extend({
    idTVARate: z.string()
  });

export type TVARate = z.infer<typeof TVARateSchema>;

export const CreateTVARateSchema = CreateSettingSchema.extend({});

export type CreateTVARate = z.infer<
  typeof CreateTVARateSchema
>;

export const UpdateTVARateSchema = UpdateSettingSchema.extend({});

export type UpdateTVARate = z.infer<
  typeof UpdateTVARateSchema
>;

export const TVARatePageItemSchema =
  SettingPageItemSchema.extend({
    idTVARate: z.string()
  });

export type TVARatePageItem = z.infer<
  typeof TVARatePageItemSchema
>;