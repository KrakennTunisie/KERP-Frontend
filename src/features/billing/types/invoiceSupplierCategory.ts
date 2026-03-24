import { z } from "zod";

export const categoriesFacturesFournisseurSchema = z.enum([
    "Toutes catégories",
    "Fournitures",
    "Matériel informatique",
    "Services",
]);

export type CategoriesFacturesFournisseur = z.infer<typeof categoriesFacturesFournisseurSchema>;