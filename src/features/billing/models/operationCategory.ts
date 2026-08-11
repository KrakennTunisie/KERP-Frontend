import { z } from "zod";

import {
  CreateSettingSchema,
  SettingBaseSchema,
  SettingPageItemSchema,
  UpdateSettingSchema,
} from "./SettingItem";

export const OperationCategorySchema = SettingBaseSchema.extend({
  idOperationCategory: z.string(),
  settingType: z.literal("OPERATION_CATEGORY"),
});

export type OperationCategory = z.infer<typeof OperationCategorySchema>;

export const CreateOperationCategorySchema = CreateSettingSchema.extend({
  settingType: z.literal("OPERATION_CATEGORY"),
});

export type CreateOperationCategory = z.infer<
  typeof CreateOperationCategorySchema
>;

export const UpdateOperationCategorySchema = UpdateSettingSchema.extend({
  settingType: z.literal("OPERATION_CATEGORY"),
});

export type UpdateOperationCategory = z.infer<
  typeof UpdateOperationCategorySchema
>;

export const OperationCategoryPageItemSchema =
  SettingPageItemSchema.extend({
    idOperationCategory: z.string(),
    settingType: z.literal("OPERATION_CATEGORY"),
  });

export type OperationCategoryPageItem = z.infer<
  typeof OperationCategoryPageItemSchema
>;