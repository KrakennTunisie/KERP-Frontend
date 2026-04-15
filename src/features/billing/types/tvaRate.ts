import { z } from "zod";

export const tvaRateSchema = z.union([
    z.literal(0),
    z.literal(7),
    z.literal(13),
    z.literal(19),
]);

export type TvaRate = z.infer<typeof tvaRateSchema>;