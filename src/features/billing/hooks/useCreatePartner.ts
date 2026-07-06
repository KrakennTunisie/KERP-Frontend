import { useRouter } from "next/navigation";
import { Path, useForm } from "react-hook-form";
import { AddPartnerFormData, addPartnerSchema, ClientPartnerItem, PartnerAllDetails, SupplierPartnerDetails, upadtePartnerSchema, UpdatePartner } from "../models/partner";
import { zodResolver } from "@hookform/resolvers/zod";
import { any, z } from "zod";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";
import { partnersApi } from "../api/partners-api";
import { partnerTypeSchema } from "../types/partnerType";
import { useEffect, useState } from "react";
export interface pageProps {
    type: string
    mode: string
    partnerId?: string
}
export interface clientProps {
    params: {
        clientId: string
    }
}
export interface supplierProps {
    params: {
        supplierId: string
    }
}

export default function UseCreatePartner({ type, mode, partnerId }: pageProps) {
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const useFormAny = useForm as unknown as (opts: any) => ReturnType<typeof useForm<AddPartnerFormData>>;
    type FormValues = z.infer<AddPartnerFormData>;
    const schema = mode === "create" ? addPartnerSchema : upadtePartnerSchema;
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [partner, setPartner] = useState<PartnerAllDetails>();

    const fields = {
        partnerType: "partnerType" as Path<FormValues>,

        salutation: "salutation" as Path<FormValues>,
        firstName: "firstName" as Path<FormValues>,
        lastName: "lastName" as Path<FormValues>,

        companyName: "companyName" as Path<FormValues>,
        shortName: "shortName" as Path<FormValues>,

        currency: "currency" as Path<FormValues>,
        email: "email" as Path<FormValues>,
        workPhone: "workPhone" as Path<FormValues>,
        mobilePhone: "mobilePhone" as Path<FormValues>,

        taxId: "taxId" as Path<FormValues>,
        iban: "iban" as Path<FormValues>,
        taxRate: "taxRate" as Path<FormValues>,
        paymentTerms: "paymentTerms" as Path<FormValues>,
        enablePortal: "enablePortal" as Path<FormValues>,

        billingCountry: "billingCountry" as Path<FormValues>,
        billingStreet1: "billingStreet1" as Path<FormValues>,
        billingStreet2: "billingStreet2" as Path<FormValues>,
        billingCity: "billingCity" as Path<FormValues>,
        billingState: "billingState" as Path<FormValues>,
        billingZip: "billingZip" as Path<FormValues>,

        shippingCountry: "shippingCountry" as Path<FormValues>,
        shippingStreet1: "shippingStreet1" as Path<FormValues>,
        shippingStreet2: "shippingStreet2" as Path<FormValues>,
        shippingCity: "shippingCity" as Path<FormValues>,
        shippingState: "shippingState" as Path<FormValues>,
        shippingZip: "shippingZip" as Path<FormValues>,

        rne: "rne" as Path<FormValues>,
        contract: "contract" as Path<FormValues>,
        patente: "patente" as Path<FormValues>,
    };

    const documentFields = [
        {
            field: fields.rne,
            label: "RNE",
            tooltip: "Registre National des Entreprises : document officiel d'identification de l'entreprise.",
            existingUrl: partner?.rne[0]?.storageURL ?? null,
        },
        {
            field: fields.contract,
            label: "Contrat",
            tooltip: "Contrat signé avec le client ou le fournisseur.",
            existingUrl: partner?.contract[0]?.storageURL ?? null,
        },
        {
            field: fields.patente,
            label: "Patente",
            tooltip: "Document fiscal prouvant l'activité commerciale de l'entreprise.",
            existingUrl: partner?.patente?.storageURL ?? null,
        },
    ]
    const isClient = type === "CLIENT";

    const copyBillingToShipping = () => {
        const billingAddress = getValues("billingAddress");

        setValue("shippingAddress", billingAddress, {
            shouldValidate: true,
            shouldDirty: true,
        });
        console.log(watch("shippingAddress.region"));
};
    const fetchPartner = async () => {
        try {
            if (mode == "edit" && type == partnerTypeSchema.enum.CLIENT) {
                setLoadingEdit(true)
                const partner = await partnersApi.getClientById(partnerId as string);
                setPartner(partner);
            } else if (mode == "edit" && type == partnerTypeSchema.enum.SUPPLIER) {
                setLoadingEdit(true)
                const partner = await partnersApi.getSupplierById(partnerId as string);
                setPartner(partner);
            }
        } catch (error) {
            appToast.error("Erreur Fetch du partenaire:", getApiErrorMessage(error));
        }
        finally {
            setLoadingEdit(false)
        }
    }
    useEffect(() => {
        fetchPartner();
    }, [partnerId]);
    
    useEffect(() => {
        if (mode === "edit" && partner) {
            const fullName = partner.partnerName?.trim() ?? "";
            const [firstName, ...lastNameParts] = fullName.split(/\s+/);
            reset({
                partnerType:  (partner.partnerType ?? type) as "CLIENT" | "SUPPLIER" ,
                active: partner.active,
                maritalStatus: partner.maritalStatus,
                firstName: firstName,
                lastName:lastNameParts.join(" ") ?? "",
                companyName: partner.companyName,
                shortName: partner.displayName,
                currency: partner.currency,
                email: partner.email,
                workPhone: partner.professionnalPhoneNumber,
                mobilePhone: partner.personnelPhoneNumber,
                billingAddress: partner.billingAddress,
                shippingAddress: partner.shippingAddress,
                language: partner.language,
                taxId: partner.taxRegistrationNumber,
                iban: partner.iban,
                taxRate: partner.taxRate,
                paymentTerms: partner.paymentCondition,
                enablePortal: partner.enablePortal as boolean,
            })
        };
    }, [partner])
    
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useFormAny({
        resolver: zodResolver(schema),
        defaultValues: {
            partnerType: type,
            active: true,
            maritalStatus: "",
            firstName: "",
            lastName: "",
            companyName: "",
            shortName: "",
            currency: "TND",
            email: "",
            billingAddress: any,
            shippingAddress: any,
            language: "",
            taxId: "",
            iban: "",
            taxRate: "19",
            paymentTerms: "NET_30",
            enablePortal: false,
        },
    });

    const getError = (field: keyof AddPartnerFormData) => {
        return errors[field]?.message as string | undefined;
    };
    
    const updatePartnerr = async (data :UpdatePartner)=>{
        try{
         const formData = new FormData();
            formData.append("active", String(data.active));
            formData.append("partnerType", type);
            formData.append("maritalStatus", data.maritalStatus ?? "");
            formData.append("partnerName", `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim());
            formData.append("companyName", data.companyName);
            formData.append("displayName",  (data.shortName as string) ?? "");

            formData.append("currency", data.currency!);
            formData.append("email", data.email ?? "");
            
            formData.append("personnelPhoneNumber", data.workPhone?.toString() ?? "");
            formData.append("professionnalPhoneNumber", data.mobilePhone?.toString() ?? "");
            formData.append("Language", data.language ?? "");

            formData.append("taxRegistrationNumber", data.taxId! ?? "");
            formData.append("iban", data.iban ?? "");
            formData.append("TaxRate", data.taxRate! ?? "");
            formData.append("paymentCondition", data.paymentTerms! ?? "");
            formData.append("enablePortal", String(data.enablePortal));

            formData.append("billingAddress.region", data.billingAddress?.region ?? "");
            formData.append("billingAddress.state", data.billingAddress?.state ?? "");
            formData.append("billingAddress.city", data.billingAddress?.city ?? "");
            formData.append("billingAddress.street1", data.billingAddress?.street1 ?? "");
            formData.append("billingAddress.addressType", data.billingAddress!.addressType ?? "");
            formData.append("billingAddress.street2", data.billingAddress?.street2 ?? "");
            formData.append("billingAddress.zipCode", data.billingAddress?.zipCode ?? "");

            formData.append("shippingAddress.region", data.shippingAddress?.region ?? "");
            formData.append("shippingAddress.state", data.shippingAddress?.state ?? "");
            formData.append("shippingAddress.city", data.shippingAddress?.city ?? "");
            formData.append("shippingAddress.addressType", data.shippingAddress!.addressType ?? "");
            formData.append("shippingAddress.street1", data.shippingAddress?.street1 ?? "");
            formData.append("shippingAddress.street2", data.shippingAddress?.street2 ?? "");
            formData.append("shippingAddress.zipCode", data.shippingAddress?.zipCode ?? "");
            console.log(data.rne)
            console.log(data.contract)
            console.log(data.patente)
            if (data.rne instanceof File) formData.append("rne", data.rne);
            if (data.contract instanceof File) formData.append("contract", data.contract);
           if (data.patente instanceof File) formData.append("patente", data.patente);
            console.log(Object.fromEntries(formData));
                if (type == partnerTypeSchema.enum.SUPPLIER) {
                    const createdSupplier = await partnersApi.updateSupplier(partnerId! ,formData);
                    if (createdSupplier) {
                        appToast.success("Fournisseur modifiée avec succès");
                        router.back();
                    }
                }
                else {
                    const createdClient = await partnersApi.updateClient(partnerId!,formData);

                    if (createdClient) {
                        appToast.success("Client modifiée avec succès");
                        router.back();

                    }
                }

        } catch (e: unknown) {
            const message = getApiErrorMessage(e);
            appToast.error('Échec de modification , Veuillez réessayer.', message);

        }
    }

    const createPartner = async(data :AddPartnerFormData)=>{
         try {
            console.log(data.partnerType)

            const formData = new FormData();
            formData.append("active", String(data.active));
            formData.append("partnerType", type);
            formData.append("maritalStatus", data.maritalStatus ?? "");
            formData.append("partnerName", `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim());
            formData.append("companyName", data.companyName);
            formData.append("displayName",  (data.shortName as string) ?? "");

            formData.append("currency", data.currency!);
            formData.append("email", data.email! ?? "");
            formData.append("personnelPhoneNumber", data.workPhone?.toString() ?? "");
            formData.append("professionnalPhoneNumber", data.mobilePhone?.toString() ?? "");
            formData.append("Language", data.language ?? "");

            formData.append("taxRegistrationNumber", data.taxId!);
            formData.append("iban", data.iban ?? "");
            formData.append("TaxRate", data.taxRate!);
            formData.append("paymentCondition", data.paymentTerms!);
            formData.append("enablePortal", String(data.enablePortal));

            formData.append("billingAddress.region", data.billingAddress?.region ?? "");
            formData.append("billingAddress.state", data.billingAddress?.state ?? "");
            formData.append("billingAddress.city", data.billingAddress?.city ?? "");
            formData.append("billingAddress.street1", data.billingAddress?.street1 ?? "");
            formData.append("billingAddress.addressType", data.billingAddress!.addressType ?? "");
            formData.append("billingAddress.street2", data.billingAddress?.street2 ?? "");
            formData.append("billingAddress.zipCode", data.billingAddress?.zipCode ?? "");

            formData.append("shippingAddress.region", data.shippingAddress?.region ?? "");
            formData.append("shippingAddress.state", data.shippingAddress?.state ?? "");
            formData.append("shippingAddress.city", data.shippingAddress?.city ?? "");
            formData.append("shippingAddress.addressType", data.shippingAddress!.addressType ?? "");
            formData.append("shippingAddress.street1", data.shippingAddress?.street1 ?? "");
            formData.append("shippingAddress.street2", data.shippingAddress?.street2 ?? "");
            formData.append("shippingAddress.zipCode", data.shippingAddress?.zipCode ?? "");

            if (data.rne) formData.append("rne", data.rne);
            if (data.patente) formData.append("patente", data.patente);
            if (data.contract) formData.append("contract", data.contract);

            console.log(Object.fromEntries(formData));
                if (type == partnerTypeSchema.enum.SUPPLIER) {
                    const createdSupplier = await partnersApi.createSupplier(formData);
                    if (createdSupplier) {
                        appToast.success("Fournisseur créé avec succès");
                        router.back();
                    }
                }
                else {
                    const createdClient = await partnersApi.createClient(formData);

                    if (createdClient) {
                        appToast.success("Client créé avec succès");
                        router.back();

                    }
                }
           
        } catch (e: unknown) {
            const message = getApiErrorMessage(e);
            appToast.error('Échec de création , Veuillez réessayer.', message);

        }
    }
    const onSubmit = async (data: AddPartnerFormData | UpdatePartner) => {

        if(mode ==="create")
        {
            createPartner(data as AddPartnerFormData)
        }else{
            updatePartnerr(data as UpdatePartner)
        }
       
    };

    const setValueAny = setValue as (field: string, value: unknown, options?: object) => void;
    return {
        copyBillingToShipping, documentFields, fields, isClient, router, getValues,
        onSubmit, getError, register, handleSubmit, setValue, watch, setValueAny, isSubmitting
    }
}