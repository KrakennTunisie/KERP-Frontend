import { z } from "zod";
import { CreateSettingSchema, SettingBaseSchema, SettingPageItemSchema, UpdateSettingSchema } from "./SettingItem";


export const PaymentConditionSchema = SettingBaseSchema.extend({
    idPaymentCondition: z.string(),
    type: z.literal("PAYMENT_CONDITION"),
  });

export type PaymentCondition = z.infer<typeof PaymentConditionSchema>;

export const CreatePaymentConditionSchema = CreateSettingSchema.extend({
    settingType: z.literal("PAYMENT_CONDITION"),
});

export type CreatePaymentCondition = z.infer<
  typeof CreatePaymentConditionSchema
>;

export const UpdatePaymentConditionSchema = UpdateSettingSchema.extend({
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