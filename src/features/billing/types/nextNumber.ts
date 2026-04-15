import {z} from "zod"

export const nextNumberSchema = z.object({
    value: z.string()
})

export type nextNumber = z.infer<typeof nextNumberSchema>