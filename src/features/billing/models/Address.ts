import { z } from "zod";

const nullableString = (schema: z.ZodString) =>
  schema.nullable().or(z.literal("").transform(() => null));


export const addressSchema = z.object({
  idAddress: z.uuid().or(z.string()),
  region: nullableString(z.string().min(1)).optional(),
  state: nullableString(z.string().min(1)),
  street1: nullableString(z.string().min(1)),
  street2: nullableString(z.string().min(1)),
  city: nullableString(z.string().min(1)),
  zipCode: z.string().nullable().or(z.literal("").transform(() => null)),
  addressType: nullableString(z.string().min(1)).optional(),
});


export const getAddressSchema = z.object({
  idAddress: z.uuid().or(z.string()),
  region: z.string().min(1),
  state: z.string().min(1),
  street: z.string().min(1),
  street2: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string(),
  addressType : z.string().nullable()
 
  
});
export const addAddressSchema = addressSchema.pick({
 
  region: true,
  state:  true,
  street1:  true,
  street2:  true,
  city:  true,
  zipCode:  true,
  addressType :  true
 
  
});
export type AddAddress = z.infer<typeof addAddressSchema>;
export type Address = z.infer<typeof addressSchema>;