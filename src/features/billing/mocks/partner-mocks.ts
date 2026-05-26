import { AddPartnerFormData } from "../models/partner";

export const mockPartner: AddPartnerFormData = {
    partnerType: "CLIENT",

    salutation: "MR",
    firstName: "Ahmed",
    lastName: "Ben Salah",

    companyName: "Société Tech Plus SARL",
    shortName: "Tech Plus",

    currency: "TND",
    email: "ahmed.bensalah@techplus.tn",
    workPhone: "+216 71 123 456",
    mobilePhone: "+216 55 987 654",

    taxId: "1234567/A/M/000",
    iban: "TN5904018104004942712345",
    taxRate: "19",
    paymentTerms: "NET_30",
    enablePortal: true,

    billingCountry: "TN",
    billingStreet1: "Rue du Lac Windermere",
    billingStreet2: "Immeuble Business Center, 2ème étage",
    billingCity: "Tunis",
    billingState: "Tunis",
    billingZip: "1053",

    shippingCountry: "TN",
    shippingStreet1: "Zone industrielle Charguia 1",
    shippingStreet2: "Dépôt numéro 4",
    shippingCity: "Tunis",
    shippingState: "Tunis",
    shippingZip: "2035",
};