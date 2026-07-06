import { z } from "zod";
import { CreateSettingSchema, SettingBaseSchema, SettingPageItemSchema, UpdateSettingSchema } from "./SettingItem";


export const PaymentConditionSchema = SettingBaseSchema.extend({
    idPaymentCondition: z.string()
  });

export type PaymentCondition = z.infer<typeof PaymentConditionSchema>;

export const CreatePaymentConditionSchema = CreateSettingSchema.extend({});

export type CreatePaymentCondition = z.infer<
  typeof CreatePaymentConditionSchema
>;

export const UpdatePaymentConditionSchema = UpdateSettingSchema.extend({});

export type UpdatePaymentCondition = z.infer<
  typeof UpdatePaymentConditionSchema
>;

export const PaymentConditionPageItemSchema =
  SettingPageItemSchema.extend({
    idPaymentCondition: z.string()
  });

export type PaymentConditionPageItem = z.infer<
  typeof PaymentConditionPageItemSchema
>;