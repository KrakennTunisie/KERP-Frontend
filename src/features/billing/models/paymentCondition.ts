import { z } from "zod";
import { CreateSettingSchema, SettingBaseSchema, SettingPageItemSchema, UpdateSettingSchema } from "./SettingItem";


export const PaymentConditionSchema = SettingBaseSchema.extend({
    idPaymentCondition: z.string(),
    label: z.string().regex(/^[1-9]\d*$/, "Le libellé doit être un nombre entier positif"),
    settingType: z.literal("PAYMENT_CONDITION"),
  });

export type PaymentCondition = z.infer<typeof PaymentConditionSchema>;

export const CreatePaymentConditionSchema = CreateSettingSchema.extend({
    label: z.string().min(1, "Label est obligatoire").regex(/^[1-9]\d*$/, "Le libellé doit être un nombre entier positif"),
    settingType: z.literal("PAYMENT_CONDITION"),
});

export type CreatePaymentCondition = z.infer<
  typeof CreatePaymentConditionSchema
>;

export const UpdatePaymentConditionSchema = UpdateSettingSchema.extend({
    label: z.string().min(1, "Label est obligatoire").regex(/^[1-9]\d*$/, "Le libellé doit être un nombre entier positif"),
    settingType: z.literal("PAYMENT_CONDITION"),
});

export type UpdatePaymentCondition = z.infer<
  typeof UpdatePaymentConditionSchema
>;

export const PaymentConditionPageItemSchema =
  SettingPageItemSchema.extend({
    idPaymentCondition: z.string(),
    settingType: z.literal("PAYMENT_CONDITION"),
  });

export type PaymentConditionPageItem = z.infer<
  typeof PaymentConditionPageItemSchema
>;