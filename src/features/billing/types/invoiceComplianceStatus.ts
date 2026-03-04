import { z } from "zod";


export const invoiceComplianceStatusSchema = z.enum(["RECEIVED", "SIGNING_PENDING", "SIGNING_FAILED", 
                                                    "SIGNING_SUCCEEDED","TTN_PENDING","TTN_SUBMITTED",
                                                    "TTN_ACCEPTED","TTN_REJECTED","COMPLETED", 
                                                    "FAILED", "CANCELLED"]);
export type InvoiceComplianceStatus = z.infer<typeof invoiceComplianceStatusSchema>;