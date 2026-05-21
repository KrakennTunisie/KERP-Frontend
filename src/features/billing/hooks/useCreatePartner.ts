import { useRouter } from "next/navigation";
import { Path, useForm } from "react-hook-form";
import { AddPartnerFormData, addPartnerSchema } from "../models/partner";
import { zodResolver } from "@hookform/resolvers/zod";
import { any, z } from "zod";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";
import { partnersApi } from "../api/partners-api";
export interface pageProps {
    type: string
}

export default function UseCreatePartner({ type }: pageProps) {
    const router = useRouter();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const useFormAny = useForm as unknown as (opts: any) => ReturnType<typeof useForm<AddPartnerFormData>>;
    type FormValues = z.infer<AddPartnerFormData>;

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
        },
        {
            field: fields.contract,
            label: "Contrat",
            tooltip: "Contrat signé avec le client ou le fournisseur.",
        },
        {
            field: fields.patente,
            label: "Patente",
            tooltip: "Document fiscal prouvant l'activité commerciale de l'entreprise.",
        },
    ]
    const isClient = type === "CLIENT";

    const copyBillingToShipping = () => {
        setValue("shippingAddress.region", watch("billingAddress.region"));
        setValue("shippingAddress.state", watch("billingAddress.state"));
        setValue("shippingAddress.city", watch("billingAddress.city"));
        setValue("shippingAddress.street1", watch("billingAddress.street1"));
        setValue("shippingAddress.street2", watch("billingAddress.street2"));
        setValue("shippingAddress.zipCode", watch("billingAddress.zipCode"));
    };
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useFormAny({
        resolver: zodResolver(addPartnerSchema),
        defaultValues: {
            partnerType: "CLIENT",
            active: true,
            salutation: "",
            firstName: "",
            lastName: "",
            companyName: "",
            shortName: "",
            currency: "TND",
            email: "",
            workPhone: "",
            mobilePhone: "",
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

    const onSubmit = async (data: AddPartnerFormData) => {
        try {
            const formData = new FormData();
            formData.append("active", String(data.active));
            formData.append("partnerType", data.partnerType);
            formData.append("maritalStatus", data.salutation ?? "");
            formData.append("partnerName", `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim());
            formData.append("companyName", data.companyName);
            formData.append("displayName", data.shortName ?? "");

            formData.append("currency", data.currency);
            formData.append("email", data.email);
            formData.append("personnelPhoneNumber", data.workPhone ?? "");
            formData.append("professionnalPhoneNumber", data.mobilePhone ?? "");
            formData.append("Language", data.language ?? "");

            formData.append("taxRegistrationNumber", data.taxId);
            formData.append("iban", data.iban ?? "");
            formData.append("TaxRate", data.taxRate);
            formData.append("paymentCondition", data.paymentTerms);
            formData.append("portal", String(data.enablePortal));



            formData.append("billingAddress.region", data.billingAddress?.region ?? "");
            formData.append("billingAddress.state", data.billingAddress?.state ?? "");
            formData.append("billingAddress.city", data.billingAddress?.city ?? "");
            formData.append("billingAddress.street", data.billingAddress?.street1 ?? "");
            formData.append("billingAddress.addressType", data.billingAddress.addressType ?? "");
            formData.append("billingAddress.street2", data.billingAddress?.street2 ?? "");
            formData.append("billingAddress.zipCode", data.billingAddress?.zipCode ?? "");

            formData.append("shippingAddress.region", data.shippingAddress?.region ?? "");
            formData.append("shippingAddress.state", data.shippingAddress?.state ?? "");
            formData.append("shippingAddress.city", data.shippingAddress?.city ?? "");
            formData.append("shippingAddress.addressType", data.shippingAddress.addressType ?? "");
            formData.append("shippingAddress.street", data.shippingAddress?.street1 ?? "");
            formData.append("shippingAddress.street2", data.shippingAddress?.street2 ?? "");
            formData.append("shippingAddress.zipCode", data.shippingAddress?.zipCode ?? "");

            if (data.rne) formData.append("rne", data.rne);
            if (data.patente) formData.append("patente", data.patente);
            if (data.contract) formData.append("contract", data.contract);

            console.log(Object.fromEntries(formData));
            const createdClient = await partnersApi.createClient(formData);

            if (createdClient) {
                appToast.success("Client créé avec succès");
                router.back();

            }
        } catch (e: unknown) {
            const message = getApiErrorMessage(e);
            appToast.error('Échec de création , Veuillez réessayer.', message);

        }
    };

    const setValueAny = setValue as (field: string, value: unknown, options?: object) => void;
    return {
        copyBillingToShipping, documentFields, fields, isClient, router,
        onSubmit, getError, register, handleSubmit, setValue, watch, setValueAny, isSubmitting
    }
}