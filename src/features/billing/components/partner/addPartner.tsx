"use client";
import { AlertCircle, ArrowLeft, CheckCircle2, ExternalLink, FileText, User } from "lucide-react";
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
import { PaymentCondition } from "../../types/paymentCondition";
import { TvaRateString } from "../../types/tvaRate";
import { CurrencyType } from "../../types/currency";
import UseCreatePartner, { pageProps } from "../../hooks/useCreatePartner";
import { partnerTypeSchema } from "../../types/partnerType";



export default function AddPartnerPage({ type, mode, partnerId }: pageProps) {
    const {
        copyBillingToShipping, documentFields, isClient, router, getValues,
        onSubmit, getError, register, handleSubmit, setValue, setValueAny, isSubmitting
        , watch
    } = UseCreatePartner({ type, mode,partnerId })
    return (
        <div className=" bg-gray-50">

            <header className="bg-white border-b border-gray-100 px-8 py-6">
                <div className="max-w-5xl mx-auto">
                    <button
                        onClick={() => router.push(type === "CLIENT" ? "/billing/clients" : "/billing/suppliers")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold mb-4 transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Retour aux {type === partnerTypeSchema.enum.CLIENT ? "clients" : "fournisseurs"}
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-blue-600 rounded-[24px] flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 tracking-tighter">
                                {mode === 'edit'
                                    ? `Modification d'un ${type === partnerTypeSchema.enum.CLIENT ? "Client" : "Fournisseur"}`
                                    : `Nouveau ${type === partnerTypeSchema.enum.CLIENT ? "Client" : "Fournisseur"}`
                                }
                            </h1>
                            <p className="text-sm font-bold text-gray-600 mt-1">
                                {mode === 'edit'
                                    ? `Modifier un ${type === partnerTypeSchema.enum.CLIENT ? "Client" : "Fournisseur"}`
                                    : `Créer un nouveau ${type === partnerTypeSchema.enum.CLIENT ? "Client" : "Fournisseur"}`
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-8">
                <form
                    onSubmit={handleSubmit(onSubmit, (errors) => {
                        console.log("Validation échouée:", errors);
                    })}
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
                                    <Select value={watch("maritalStatus") ?? ""}
                                        onValueChange={(value) =>
                                            setValue("maritalStatus", value, {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            })
                                        }>
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

                                <div className="space-y-2">
                                    <Label>Langue</Label>
                                    <Select value={watch("language") ?? ""}
                                        onValueChange={(value) =>
                                            setValue("language", value, {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            })
                                        }>
                                        <SelectTrigger className="bg-slate-50">
                                            <SelectValue placeholder="Sélectionner une langue" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="fr">Français</SelectItem>
                                            <SelectItem value="ar">العربية</SelectItem>
                                            <SelectItem value="es">English</SelectItem>

                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2 items-stretch">

                        <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <CardHeader className="border-b border-slate-100 px-5 py-4">
                                <CardTitle className="text-base font-bold text-slate-900">
                                    Documents obligatoires
                                </CardTitle>

                                <CardDescription className="text-sm text-slate-500">
                                    Veuillez joindre les 3 documents requis avant de créer le partenaire.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="p-4 sm:p-5">
                                <div className="grid grid-cols-1 gap-3">
                                    {documentFields.map(({ label, field, tooltip, existingUrl }) => (
                                        <div key={field}>
                                            {mode === "create" ? (
                                                <FilePicker
                                                    id={field}
                                                    label={label}
                                                    required
                                                    tooltip={tooltip}
                                                    file={watch(field) as unknown as File | undefined}
                                                    existingFileUrl={null}
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
                                            ) : (
                                                <div
                                                    className={`group h-full rounded-2xl border p-4 transition-all duration-200 ${existingUrl
                                                        ? "border-blue-100 bg-blue-50/40 hover:border-blue-200 hover:bg-blue-50/70 hover:shadow-sm"
                                                        : "border-slate-200 bg-slate-50"
                                                        }`}
                                                >
                                                    <div className="flex h-full flex-col justify-between gap-3">
                                                        <div className="flex items-start gap-3">
                                                            <div
                                                                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${existingUrl
                                                                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-blue-100"
                                                                    : "bg-white text-slate-400 ring-1 ring-slate-200"
                                                                    }`}
                                                            >
                                                                <FileText className="h-5 w-5" />
                                                            </div>

                                                            <div className="min-w-0 flex-1">
                                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                                    {label}
                                                                </p>

                                                                <div className="mt-1 flex items-center gap-1.5">
                                                                    {existingUrl ? (
                                                                        <>
                                                                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                                                            <p className="truncate text-xs font-medium text-slate-500">
                                                                                Document ajouté
                                                                            </p>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                                                                            <p className="truncate text-xs font-medium text-amber-600">
                                                                                Document manquant
                                                                            </p>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {existingUrl ? (
                                                            <a
                                                                href={existingUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-blue-700 shadow-sm ring-1 ring-blue-100 transition hover:bg-blue-600 hover:text-white"
                                                            >
                                                                Voir le fichier
                                                                <ExternalLink className="h-3.5 w-3.5" />
                                                            </a>
                                                        ) : (
                                                            <div className="inline-flex w-full items-center justify-center rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-400 ring-1 ring-slate-200">
                                                                Non disponible
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
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
                                                value={watch("billingAddress.region")}
                                                onValueChange={(value) => {
                                                    setValue("billingAddress.addressType", "Billing Address", {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                    })
                                                    setValue("billingAddress.region", value, {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                    })
                                                }
                                                }
                                            >
                                                <SelectTrigger
                                                    className={
                                                        getError("billingAddress")
                                                            ? "border-red-500 focus:ring-red-500"
                                                            : "bg-slate-50"
                                                    }
                                                >
                                                    <SelectValue placeholder="Sélectionner un pays" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value="Tunisie">Tunisie</SelectItem>
                                                    <SelectItem value="France">France</SelectItem>
                                                    <SelectItem value="Algérie">Algérie</SelectItem>
                                                    <SelectItem value="Maroc">Maroc</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            {getError("billingAddress") && (
                                                <p className="text-xs font-semibold text-red-600">
                                                    {getError("billingAddress")}
                                                </p>
                                            )}
                                        </div>

                                        <Input
                                            id="billingStreet1"
                                            label="Adresse ligne 1"
                                            required
                                            placeholder="Numéro et nom de rue"
                                            error={getError("billingAddress")}
                                            {...register("billingAddress.street1")}
                                        />

                                        <Input
                                            id="billingStreet2"
                                            label="Adresse ligne 2"
                                            placeholder="Complément d'adresse"
                                            error={getError("billingAddress")}
                                            {...register("billingAddress.street2")}
                                        />

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <Input
                                                id="billingCity"
                                                label="Ville"
                                                required
                                                placeholder="Ville"
                                                error={getError("billingAddress")}
                                                {...register("billingAddress.city")}
                                            />

                                            <Input
                                                id="billingZip"
                                                label="Code postal"
                                                placeholder="Code postal"
                                                error={getError("billingAddress")}
                                                {...register("billingAddress.zipCode")}
                                            />
                                        </div>

                                        <Input
                                            id="billingState"
                                            label="État / Gouvernorat"
                                            placeholder="Gouvernorat"
                                            error={getError("billingAddress")}
                                            {...register("billingAddress.state")}
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
                                                value={watch("shippingAddress.region")}
                                                onValueChange={(value) => {
                                                    setValue("shippingAddress.addressType", "Shipping Address", {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                    })
                                                    setValue("shippingAddress.region", value, {
                                                        shouldValidate: true,
                                                        shouldDirty: true,
                                                    })
                                                }
                                                }
                                            >
                                                <SelectTrigger
                                                    className={
                                                        getError("shippingAddress")
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

                                            {getError("shippingAddress") && (
                                                <p className="text-xs font-semibold text-red-600">
                                                    {getError("shippingAddress")}
                                                </p>
                                            )}
                                        </div>

                                        <Input
                                            id="shippingStreet1"
                                            label="Adresse ligne 1"
                                            placeholder="Numéro et nom de rue"
                                            error={getError("shippingAddress")}
                                            {...register("shippingAddress.street1")}
                                        />

                                        <Input
                                            id="shippingStreet2"
                                            label="Adresse ligne 2"
                                            placeholder="Complément d'adresse"
                                            error={getError("shippingAddress")}
                                            {...register("shippingAddress.street2")}
                                        />

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <Input
                                                id="shippingCity"
                                                label="Ville"
                                                placeholder="Ville"
                                                error={getError("shippingAddress")}
                                                {...register("shippingAddress.city")}
                                            />

                                            <Input
                                                id="shippingZip"
                                                label="Code postal"
                                                placeholder="Code postal"
                                                error={getError("shippingAddress")}
                                                {...register("shippingAddress.zipCode")}
                                            />
                                        </div>

                                        <Input
                                            id="shippingState"
                                            label="État / Gouvernorat"
                                            placeholder="Gouvernorat"
                                            error={getError("shippingAddress")}
                                            {...register("shippingAddress.state")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="-mx-3 border-t border-slate-200 bg-white px-4 py-4 sm:mx-0 sm:rounded-xl sm:border sm:shadow-sm">
                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full sm:w-auto"
                                onClick={() => router.back()}
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

                                {mode === "create" ? "Ajouter un partenaire" : "Modifier un partenaire"}
                            </LoadingButton>
                        </div>
                    </div>
                </form>
            </main>

        </div>
    );
}


