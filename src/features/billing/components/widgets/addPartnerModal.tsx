"use client";

import { useEffect } from "react";
import { AlertCircle, CheckCircle2, FileText, X } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Checkbox } from "@/shared/components/ui/checkbox";
import LoadingButton from "@/shared/components/ui/loadingButton";
import { PaymentCondition } from "../../types/paymentCondition";
import { TvaRateString } from "../../types/tvaRate";
import { CurrencyType } from "../../types/currency";
import UseCreatePartner, { pageProps } from "../../hooks/useCreatePartner";
import { partnerTypeSchema } from "../../types/partnerType";
import { PartnerSummary } from "../../models/partner";

interface AddPartnerModalProps {
  isOpen: boolean;
  partner?: PartnerSummary;
  partnerType?: string
  onClose: () => void;
  onSuccess: ()=> void;
}

export default function AddPartnerModal({
  isOpen,
  partner,
  partnerType,
  onClose,
  onSuccess
}: AddPartnerModalProps) {
  const {
    register,
    watch,
    setValue,
    getError,
    documentFields,
    copyBillingToShipping,
    handleSubmit,
    onSubmit,
    isSubmitting,
  } = UseCreatePartner({ type: partnerType, mode: "create" } as pageProps);

  const setValueAny = setValue as (field: string, value: any, opts?: any) => void;

  // Pré-remplit le nom d'entreprise avec celui extrait de la facture
  useEffect(() => {
    if (isOpen && partner?.companyName) {
      setValue("companyName", partner.companyName ?? "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("email", partner.email ?? "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      const phoneValue = partner.professionnalPhoneNumber && !isNaN(Number(partner.professionnalPhoneNumber))
        ? Number(partner.professionnalPhoneNumber)
        : null;
      setValue("workPhone", phoneValue, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("taxId", partner.taxRegistrationNumber ?? "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("billingAddress", partner.billingAddress, {
        shouldValidate: true,
        shouldDirty: true,
      });

    }
  }, [isOpen, partner?.companyName, setValue]);

  if (!isOpen) return null;

  const submitAndClose = handleSubmit(
    async (data) => {
      await onSubmit(data, false);
      onSuccess();
      onClose();
    },
    (errors) => {
      console.log("Validation échouée:", errors);
    }
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{partnerType == partnerTypeSchema.enum.SUPPLIER ? "Nouveau  fournisseur" : "Nouveau  client"}</h2>
            <p className="text-sm text-slate-500">
              Complétez les informations du {partnerType == partnerTypeSchema.enum.SUPPLIER ? "fournisseur" : "client"} détecté dans la facture
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 transition hover:text-red-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body scrollable */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          <div className="space-y-6">
            {/* Données générales */}
            <Card className="border-slate-200 bg-white shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-white">
                <CardTitle className="text-lg text-slate-900">Données générales</CardTitle>
                <CardDescription>Informations principales du fournisseur</CardDescription>
              </CardHeader>

              <CardContent className="p-5 sm:p-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Salutation</Label>
                    <Select
                      value={watch("maritalStatus") ?? ""}
                      onValueChange={(value) =>

                        setValue("maritalStatus", value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                    >
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
                    label="Prénom"
                    placeholder="Prénom"
                    error={getError("firstName")}
                    {...register("firstName")}
                  />

                  <Input
                    id="lastName"
                    label="Nom"
                    placeholder="Nom"
                    error={getError("lastName")}
                    {...register("lastName")}
                  />

                  <Input
                    id="shortName"
                    label="Nom abrégé"
                    placeholder="Nom abrégé"
                    error={getError("shortName")}
                    {...register("shortName")}
                  />

                  <Input
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="email@exemple.com"
                    error={getError("email")}
                    {...register("email")}
                  />

                  <Input
                    id="workPhone"
                    type="number"
                    label="Téléphone professionnel"
                    placeholder="+216 XX XXX XXX"
                    error={getError("workPhone")}
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    {...register("workPhone", { valueAsNumber: true })}
                  />

                  <Input
                    id="mobilePhone"
                    type="number"
                    label="Téléphone mobile"
                    placeholder="+216 XX XXX XXX"
                    error={getError("mobilePhone")}
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    {...register("mobilePhone", { valueAsNumber: true })}
                  />

                  <div className="space-y-2">
                    <Label>Langue</Label>
                    <Select
                      value={watch("language") ?? ""}
                      onValueChange={(value) =>
                        setValue("language", value, {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                      }
                    >
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
              {/* Documents obligatoires */}
              <Card className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <CardHeader className="border-b border-slate-100 px-5 py-4">
                  <CardTitle className="text-base font-bold text-slate-900">
                    Documents obligatoires
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-500">
                    Veuillez joindre les documents requis avant de créer le fournisseur.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-4 sm:p-5">
                  <div className="grid grid-cols-1 gap-3">
                    {documentFields.map(({ label, field, tooltip }) => (
                      <FilePicker
                        key={field}
                        id={field}
                        label={label}
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
                      label="Matricule Fiscal"
                      tooltip="Matricule fiscal utilisé pour l'identification fiscale de l'entreprise."
                      placeholder="1234567/A/M/000"
                      error={getError("taxId")}
                      {...register("taxId")}
                    />

                    <Input
                      id="iban"
                      label="IBAN"
                      placeholder="TN59 XXXX XXXX XXXX XXXX XXXX"
                      error={getError("iban")}
                      {...register("iban")}
                    />

                    <div className="space-y-2">
                      <Label tooltip="TVA par défaut pour les factures." htmlFor="taxRate">
                        Taux TVA
                      </Label>
                      <Select
                        defaultValue="0"
                        onValueChange={(value) =>
                          setValue("taxRate", value as TvaRateString, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                      >
                        <SelectTrigger
                          className={
                            getError("taxRate") ? "border-red-500 focus:ring-red-500" : "bg-slate-50"
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
                        <p className="text-xs font-semibold text-red-600">{getError("taxRate")}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label tooltip="Les conditions de payements des factures." htmlFor="paymentTerms">
                        Conditions de paiement
                      </Label>
                      <Select
                        defaultValue="IMMEDIATE"
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
                    <Label tooltip="Devise appliqué pour les factures." htmlFor="currency">
                      Devise
                    </Label>
                    <Select
                      defaultValue="TND"
                      onValueChange={(value) => setValue("currency", value as CurrencyType)}
                    >
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
                      <h3 className="font-semibold text-slate-900">Adresse de facturation</h3>
                      <p className="mt-1 text-sm text-slate-500">
                        Adresse utilisée pour les documents de facturation
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="billingCountry">Pays / Région</Label>
                        <Select
                          value={watch("billingAddress.region") ?? ""}
                          onValueChange={(value) => {
                            setValue("billingAddress.addressType", "Billing Address", {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            setValue("billingAddress.region", value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }}
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
                            <SelectItem value="TN">Tunisie</SelectItem>
                            <SelectItem value="FR">France</SelectItem>
                            <SelectItem value="DZ">Algérie</SelectItem>
                            <SelectItem value="MA">Maroc</SelectItem>
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
                        <h3 className="font-semibold text-slate-900">Adresse de livraison</h3>

                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full rounded-full bg-white sm:w-auto cursor-pointer"
                        onClick={copyBillingToShipping}
                      >
                        Copier depuis facturation
                      </Button>

                    </div>


                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="shippingCountry">Pays / Région</Label>
                        <Select
                          value={watch("shippingAddress.region") ?? ""}
                          onValueChange={(value) => {
                            setValue("shippingAddress.addressType", "Shipping Address", {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            setValue("shippingAddress.region", value, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                          }}
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
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl px-4 py-2 text-sm font-medium"
          >
            Annuler
          </Button>

          <LoadingButton
            type="button"
            onClick={submitAndClose}
            //isLoading={isSubmitting}
            disabled={isSubmitting}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
          >
            Ajouter le {partnerType == partnerTypeSchema.enum.SUPPLIER ? "fournisseur" : "client"}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}