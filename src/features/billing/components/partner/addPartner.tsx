"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { Path, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import FilePicker from "@/shared/components/ui/filePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Checkbox } from "@/shared/components/ui/checkbox";
import LoadingButton from "@/shared/components/ui/loadingButton";
import { AddPartnerFormData, addPartnerSchema } from "../../models/partner";
import { PaymentCondition } from "../../types/paymentCondition";
import {  TvaRateString } from "../../types/tvaRate";
import { CurrencyType } from "../../types/currency";



interface pageProps{
    type: string
}

export default function AddPartnerPage({type} : pageProps) {
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

  const listPath = isClient ? "/clients" : "/suppliers";
  
   const copyBillingToShipping = () => {
    setValue("shippingCountry", watch("billingCountry"));
    setValue("shippingStreet1", watch("billingStreet1"));
    setValue("shippingStreet2", watch("billingStreet2"));
    setValue("shippingCity", watch("billingCity"));
    setValue("shippingState", watch("billingState"));
    setValue("shippingZip", watch("billingZip"));
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
    partnerType:"CLIENT",
    salutation: "",
    firstName: "",
    lastName: "",
    companyName: "",
    shortName: "",
    currency: "TND",
    email: "",
    workPhone: "",
    mobilePhone: "",
    taxId: "",
    iban: "",
    taxRate: "19",
    paymentTerms: "NET_30",
    enablePortal: false,

    billingCountry: "TN",
    billingStreet1: "",
    billingStreet2: "",
    billingCity: "",
    billingState: "",
    billingZip: "",

    shippingCountry: "",
    shippingStreet1: "",
    shippingStreet2: "",
    shippingCity: "",
    shippingState: "",
    shippingZip: "",
  },
});

  const getError = (field: keyof AddPartnerFormData) => {
    return errors[field]?.message as string | undefined;
  };

  const onSubmit = async (data: AddPartnerFormData) => {
    const formData = new FormData();

    formData.append("partnerType", data.partnerType);

    formData.append("salutation", data.salutation ?? "");
    formData.append("firstName", data.firstName ?? "");
    formData.append("lastName", data.lastName ?? "");
    formData.append("companyName", data.companyName);
    formData.append("shortName", data.shortName ?? "");

    formData.append("currency", data.currency);
    formData.append("email", data.email);
    formData.append("workPhone", data.workPhone ?? "");
    formData.append("mobilePhone", data.mobilePhone ?? "");

    formData.append("taxId", data.taxId);
    formData.append("iban", data.iban ?? "");
    formData.append("taxRate", data.taxRate);
    formData.append("paymentTerms", data.paymentTerms);
    formData.append("enablePortal", String(data.enablePortal));

    formData.append("billingCountry", data.billingCountry);
    formData.append("billingStreet1", data.billingStreet1);
    formData.append("billingStreet2", data.billingStreet2 ?? "");
    formData.append("billingCity", data.billingCity);
    formData.append("billingState", data.billingState ?? "");
    formData.append("billingZip", data.billingZip ?? "");

    formData.append("shippingCountry", data.shippingCountry ?? "");
    formData.append("shippingStreet1", data.shippingStreet1 ?? "");
    formData.append("shippingStreet2", data.shippingStreet2 ?? "");
    formData.append("shippingCity", data.shippingCity ?? "");
    formData.append("shippingState", data.shippingState ?? "");
    formData.append("shippingZip", data.shippingZip ?? "");

    if (data.rne) formData.append("rne", data.rne);
    if (data.patente) formData.append("patente", data.patente);
    if (data.contract) formData.append("contract", data.contract);

    console.log(Object.fromEntries(formData));

    router.push(listPath);
};

  const setValueAny = setValue as (field: string, value: unknown, options?: object) => void;


  return (
    <div className=" bg-gray-50">

      <header className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <button
           // onClick={() => navigate('/clients')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour aux clients
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-[24px] flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tighter">Nouveau Client</h1>
              <p className="text-sm font-bold text-gray-600 mt-1">Créer un nouveau client</p>
            </div>
          </div>
        </div>
      </header>

    <main className="flex-1 overflow-y-auto p-8">          
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="mx-auto max-w-6xl space-y-6 pb-10"
                id="form-partner"
            >

                {/* Données générales */}
                <Card className=" border-slate-200 bg-white shadow-sm">
                    <CardHeader className="border-b border-slate-100 bg-white">
                        <CardTitle className="text-lg text-slate-900">
                        Données générales
                        </CardTitle>
                        <CardDescription>
                        Informations principales du {isClient ? "client" : "fournisseur"}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        
                        <div className="space-y-2">
                            <Label
                                required
                                >
                                Salutation
                           </Label>
                            <Select onValueChange={(value) => setValue("salutation", value)}>
                            <SelectTrigger className="bg-slate-50">
                                <SelectValue placeholder="Salutation" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Mr">M.</SelectItem>
                                <SelectItem value="Mrs">Mme</SelectItem>
                                <SelectItem value="Ms">Mlle</SelectItem>
                                <SelectItem value="Dr">Dr</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>

                        <Input
                            id="companyName"
                            required
                            label="Nom de l'entreprise"
                            placeholder="Nom de l'entreprise"
                            error={getError("companyName")}
                            {...register("companyName")}
                        />

                        <Input
                            id="firstName"
                            required
                            label="Prénom"
                            placeholder="Prénom"
                            error={getError("firstName")}
                            {...register("firstName")}
                        />

                        <Input
                            id="lastName"
                            required
                            label="Nom"
                            placeholder="Nom"
                            error={getError("lastName")}
                            {...register("lastName")}
                        />

                        <Input
                            id="shortName"
                            required
                            label="Nom abrégé"
                            placeholder="Nom abrégé"
                            error={getError("shortName")}
                            {...register("shortName")}
                        />

                        <Input
                            id="email"
                            required
                            label="Email"
                            type="email"
                            placeholder="email@exemple.com"
                            error={getError("email")}
                            {...register("email")}
                        />

                        <Input
                            id="workPhone"
                            label="Téléphone professionnel"
                            placeholder="+216 XX XXX XXX"
                            error={getError("workPhone")}
                            {...register("workPhone")}
                        />

                        <Input
                            id="mobilePhone"
                            label="Téléphone mobile"
                            placeholder="+216 XX XXX XXX"
                            error={getError("mobilePhone")}
                            {...register("mobilePhone")}
                        />
                        </div>
                    </CardContent>
                </Card>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 items-stretch">

                    {/* Documents */}
                <Card className="h-full">
                    <CardHeader className="border-b border-slate-100 bg-white">
                        <CardTitle className="text-lg text-slate-900">
                        Documents obligatoires
                        </CardTitle>
                        <CardDescription>
                        Veuillez joindre les 3 documents requis avant de créer le partenaire.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {documentFields.map(({ field, label, tooltip }) => (
                            <div key={field} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                            <FilePicker
                                id={label}
                                label={label}
                                required
                                tooltip={tooltip}
                                file={watch(field) as unknown as File | undefined}
                                error={getError(field)}
                                onPick={(file) =>
                                setValueAny(field, file, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                })
                                }
                                onRemove={() =>
                                setValueAny(field, undefined, {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                })
                                }
                            />
                            </div>
                        ))}
                        </div>
                    </CardContent>
                </Card>
                {/* Facturation */}
                <Card className="h-full">
                <CardHeader className="border-b border-slate-100 bg-white">
                    <CardTitle className="text-lg text-slate-900">
                    Données de facturation
                    </CardTitle>
                    <CardDescription>
                    Paramètres fiscaux et conditions de paiement
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 p-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                        id="taxId"
                        required
                        label="Matricule Fiscal"
                        tooltip="Matricule fiscal utilisé pour l'identification fiscale de l'entreprise."
                        placeholder="1234567/A/M/000"
                        error={getError("taxId")}
                        {...register("taxId")}
                    />

                    <Input
                        id="iban"
                        label="IBAN"
                        tooltip="Matricule fiscal utilisé pour l'identification fiscale de l'entreprise."
                        placeholder="TN59 XXXX XXXX XXXX XXXX XXXX"
                        error={getError("iban")}
                        {...register("iban")}
                    />

                    <div className="space-y-2">
                        <Label  
                        tooltip="TVA par défaut pour les factures."
                        htmlFor="taxRate">
                        Taux TVA <span className="text-red-500">*</span>
                        </Label>

                        <Select
                        defaultValue="19"
                        onValueChange={(value) =>
                            setValue("taxRate", value as TvaRateString, {
                            shouldValidate: true,
                            shouldDirty: true,
                            })
                        }
                        >
                        <SelectTrigger
                            className={
                            getError("taxRate")
                                ? "border-red-500 focus:ring-red-500"
                                : "bg-slate-50"
                            }
                        >
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="0">0% - Exonéré</SelectItem>
                            <SelectItem value="7">7% - Taux réduit</SelectItem>
                            <SelectItem value="13">13% - Taux intermédiaire</SelectItem>
                            <SelectItem value="19">19% - Taux normal</SelectItem>
                        </SelectContent>
                        </Select>

                        {getError("taxRate") && (
                        <p className="text-xs font-semibold text-red-600">
                            {getError("taxRate")}
                        </p>
                        )}
                    </div>
                    

                    <div className="space-y-2">
                        <Label  
                        tooltip="Les conditions de payements des factures."
                        htmlFor="paymentTerms">
                        Conditions de paiement <span className="text-red-500">*</span>
                        </Label>

                        <Select
                        defaultValue="NET_30"
                        onValueChange={(value) =>
                            setValue("paymentTerms", value as PaymentCondition, {
                            shouldValidate: true,
                            shouldDirty: true,
                            })
                        }
                        >
                        <SelectTrigger
                            className={
                            getError("paymentTerms")
                                ? "border-red-500 focus:ring-red-500"
                                : "bg-slate-50"
                            }
                        >
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="IMMEDIATE">Paiement immédiat</SelectItem>
                            <SelectItem value="NET_15">Net 15 jours</SelectItem>
                            <SelectItem value="NET_30">Net 30 jours</SelectItem>
                            <SelectItem value="NET_45">Net 45 jours</SelectItem>
                        </SelectContent>
                        </Select>

                        {getError("paymentTerms") && (
                        <p className="text-xs font-semibold text-red-600">
                            {getError("paymentTerms")}
                        </p>
                        )}
                    </div>
                    
                    </div>
                  
                    <div className="space-y-2">
                        <Label 
                            tooltip="Devise appliqué pour les factures ."
                            htmlFor="currency"
                            >Devise
                        </Label>
                        <Select defaultValue="TND" onValueChange={(value) => setValue('currency', value as CurrencyType)}>
                            <SelectTrigger>
                            <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="TND">TND - Dinar Tunisien</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="USD">USD - Dollar US</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {type === "CLIENT" && (
                    <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                        <div className="flex items-start gap-3">
                        <Checkbox
                            id="enablePortal"
                            checked={watch("enablePortal")}
                            onCheckedChange={(checked) =>
                            setValue("enablePortal", checked === true, {
                                shouldValidate: true,
                                shouldDirty: true,
                            })
                            }
                        />

                        <div>
                            <Label
                            htmlFor="enablePortal"
                            className="cursor-pointer text-sm font-semibold text-slate-800"
                            >
                            Activer l'accès au portail client
                            </Label>
                            <p className="mt-1 text-xs text-slate-500">
                            Le client pourra accéder à son espace dédié.
                            </p>
                        </div>
                        </div>
                    </div>
                    )}
                
                    
                </CardContent>
                </Card>
            </div>

                {/* Adresses */}
                <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="border-b border-slate-100 bg-white">
                    <CardTitle className="text-lg text-slate-900">Adresses</CardTitle>
                    <CardDescription>
                    Adresse de facturation et adresse de livraison
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    {/* Facturation */}
                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="mb-5">
                        <h3 className="font-semibold text-slate-900">
                            Adresse de facturation
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            Adresse utilisée pour les documents de facturation
                        </p>
                        </div>

                        <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="billingCountry">
                            Pays / Région <span className="text-red-500">*</span>
                            </Label>

                            <Select
                            value={watch("billingCountry")}
                            onValueChange={(value) =>
                                setValue("billingCountry", value, {
                                shouldValidate: true,
                                shouldDirty: true,
                                })
                            }
                            >
                            <SelectTrigger
                                className={
                                getError("billingCountry")
                                    ? "border-red-500 focus:ring-red-500"
                                    : "bg-slate-50"
                                }
                            >
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="TN">Tunisie</SelectItem>
                                <SelectItem value="FR">France</SelectItem>
                                <SelectItem value="DZ">Algérie</SelectItem>
                                <SelectItem value="MA">Maroc</SelectItem>
                            </SelectContent>
                            </Select>

                            {getError("billingCountry") && (
                            <p className="text-xs font-semibold text-red-600">
                                {getError("billingCountry")}
                            </p>
                            )}
                        </div>

                        <Input
                            id="billingStreet1"
                            label="Adresse ligne 1"
                            required
                            placeholder="Numéro et nom de rue"
                            error={getError("billingStreet1")}
                            {...register("billingStreet1")}
                        />

                        <Input
                            id="billingStreet2"
                            label="Adresse ligne 2"
                            placeholder="Complément d'adresse"
                            error={getError("billingStreet2")}
                            {...register("billingStreet2")}
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Input
                            id="billingCity"
                            label="Ville"
                            required
                            placeholder="Ville"
                            error={getError("billingCity")}
                            {...register("billingCity")}
                            />

                            <Input
                            id="billingZip"
                            label="Code postal"
                            placeholder="Code postal"
                            error={getError("billingZip")}
                            {...register("billingZip")}
                            />
                        </div>

                        <Input
                            id="billingState"
                            label="État / Gouvernorat"
                            placeholder="Gouvernorat"
                            error={getError("billingState")}
                            {...register("billingState")}
                        />
                        </div>
                    </div>

                    {/* Livraison */}
                    <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 shadow-sm">
                        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h3 className="font-semibold text-slate-900">
                            Adresse de livraison
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                            Adresse utilisée pour les livraisons
                            </p>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full rounded-full bg-white sm:w-auto cursor-pointer"
                            onClick={() => copyBillingToShipping()}
                        >
                            Copier depuis facturation
                        </Button>
                        </div>

                        <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="shippingCountry">Pays / Région</Label>

                            <Select
                            value={watch("shippingCountry")}
                            onValueChange={(value) =>
                                setValue("shippingCountry", value, {
                                shouldValidate: true,
                                shouldDirty: true,
                                })
                            }
                            >
                            <SelectTrigger
                                className={
                                getError("shippingCountry")
                                    ? "border-red-500 focus:ring-red-500"
                                    : "bg-white"
                                }
                            >
                                <SelectValue placeholder="Sélectionner un pays" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="TN">Tunisie</SelectItem>
                                <SelectItem value="FR">France</SelectItem>
                                <SelectItem value="DZ">Algérie</SelectItem>
                                <SelectItem value="MA">Maroc</SelectItem>
                            </SelectContent>
                            </Select>

                            {getError("shippingCountry") && (
                            <p className="text-xs font-semibold text-red-600">
                                {getError("shippingCountry")}
                            </p>
                            )}
                        </div>

                        <Input
                            id="shippingStreet1"
                            label="Adresse ligne 1"
                            placeholder="Numéro et nom de rue"
                            error={getError("shippingStreet1")}
                            {...register("shippingStreet1")}
                        />

                        <Input
                            id="shippingStreet2"
                            label="Adresse ligne 2"
                            placeholder="Complément d'adresse"
                            error={getError("shippingStreet2")}
                            {...register("shippingStreet2")}
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Input
                            id="shippingCity"
                            label="Ville"
                            placeholder="Ville"
                            error={getError("shippingCity")}
                            {...register("shippingCity")}
                            />

                            <Input
                            id="shippingZip"
                            label="Code postal"
                            placeholder="Code postal"
                            error={getError("shippingZip")}
                            {...register("shippingZip")}
                            />
                        </div>

                        <Input
                            id="shippingState"
                            label="État / Gouvernorat"
                            placeholder="Gouvernorat"
                            error={getError("shippingState")}
                            {...register("shippingState")}
                        />
                        </div>
                    </div>
                    </div>
                </CardContent>
                </Card>

                {/* Actions */}
                <div className="-mx-4 border-t border-slate-200 bg-white px-4 py-4 sm:mx-0 sm:rounded-2xl sm:border sm:shadow-sm">
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full sm:w-auto"
                            onClick={() => router.push(listPath)}
                            >
                            Annuler
                        </Button>

                        <LoadingButton
                                disabled={isSubmitting}
                                loading={isSubmitting}
                                type="submit"
                                form="form-partner"
                                className="px-5 py-3 rounded-2xl bg-gray-900 text-white font-black hover:bg-black disabled:opacity-60 cursor-pointer"
                                loadingText="Chargement..."
                            >
                            {"Add"}
                        </LoadingButton>
                    </div>
                </div>
            </form>
        </main>

    </div>
  );
}


