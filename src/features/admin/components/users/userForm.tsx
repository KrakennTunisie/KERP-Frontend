'use client'

import { ArrowLeft, User } from "lucide-react"
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Button } from "@/shared/components/ui/button"
import { useCreateEditUser } from "../../hooks/useCreateEditUser"
import { CreateUser,  USER_STATUS_OPTIONS } from "../../models/user";

export type PropsForm = {
  userId?: string,
  mode: "create" |"edit"
}

export interface userProps {
    params: {
        idUser: string
    }
}

export default function UserForm ({userId, mode}:PropsForm) {
 
const {
        onSubmit,
        register,
      handleSubmit,
      reset,
      setValue,
      watch,
      errors, isSubmitting,
      router,
      roles
    } = useCreateEditUser({userId, mode});

    const isEditMode = mode==="edit"
  return (
    <div className="bg-gray-50">

      {/* HEADER */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="mx-auto space-y-3">

          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-xs font-medium transition group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Retour
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold">
                {mode === "create"
                  ? "Nouvel utilisateur"
                  : "Modifier utilisateur"}
              </h1>

              <p className="text-sm text-gray-500">
                {mode === "create"
                  ? "Créer un nouvel utilisateur"
                  : "Modifier les informations du compte"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FORM */}
      <main className="flex-1 overflow-y-auto p-8">
        <form
            id="userForm"     
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto space-y-6 pb-10">

            {/* GENERAL */}
            <Card className="border-slate-200 bg-white shadow-sm">

            <CardHeader className="border-b border-slate-100 bg-white">
                <CardTitle className="text-lg text-slate-900">
                {"Informations générales"}
                </CardTitle>

                <CardDescription>
                {"Informations principales de l'utilisateur."}
                </CardDescription>
            </CardHeader>

            <CardContent className="p-5 sm:p-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <Input
                    label="Prénom"
                    required
                    placeholder="John"
                    {...register("firstName")}
                    error={errors.firstName?.message}
                />

                <Input
                    label="Nom"
                    required
                    placeholder="Doe"
                    {...register("lastName")}
                    error={errors.lastName?.message}
                />

                <Input
                    label="Email"
                    placeholder="john.doe@company.com"
                    required
                    type="email"
                    className="md:col-span-2"
                    {...register("email")}
                    error={errors.email?.message}
                />

                <Input
                    label="Téléphone"
                    placeholder="+216XXXXXXXX"
                    type="text"
                    className="md:col-span-2"
                    {...register("phoneNumber")}
                    error={errors.phoneNumber?.message}
                />

                </div>

            </CardContent>

            </Card>


            {/* ROLE & STATUS */}

            <Card className="border-slate-200 bg-white shadow-sm">
                <CardHeader className="border-b border-slate-100">
                    <CardTitle className="text-lg">
                    Permissions
                    </CardTitle>

                    <CardDescription>
                    Définissez le rôle et le statut du compte.
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    {/* ROLE */}
                    <div className="space-y-2">
                        <Label required>
                        Rôle
                        </Label>

                        <Select
                        value={watch("roles")}
                        onValueChange={(value) =>
                            setValue(
                            "roles",
                            value as CreateUser["roles"],
                            {
                                shouldValidate: true,
                            }
                            )
                        }
                        disabled={isEditMode}
                        >
                        <SelectTrigger
                            className={`
                            bg-slate-50
                            ${isEditMode ? "cursor-not-allowed opacity-60" : ""}
                            `}
                        >
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            {roles.map((role) => (
                            <SelectItem
                                key={role.id}
                                value={role.name}
                            >
                                {role.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>

                        {errors.roles && (
                        <p className="text-sm text-red-500">
                            {errors.roles.message}
                        </p>
                        )}
                    </div>

                    {/* STATUS */}
                    <div className="space-y-2">
                        <Label>
                        Statut
                        </Label>

                        <Select
                        value={watch("status")}
                        onValueChange={(value) =>
                            setValue(
                            "status",
                            value as CreateUser["status"],
                            {
                                shouldValidate: true,
                            }
                            )
                        }
                        disabled={isEditMode}
                        >
                        <SelectTrigger
                            className={`
                            bg-slate-50
                            ${isEditMode ? "cursor-not-allowed opacity-60" : ""}
                            `}
                        >
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            {USER_STATUS_OPTIONS.map((status) => (
                            <SelectItem
                                key={status.value}
                                value={status.value}
                            >
                                {status.label}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>

                        {errors.status && (
                        <p className="text-sm text-red-500">
                            {errors.status.message}
                        </p>
                        )}
                    </div>

                    </div>
                </CardContent>
            </Card>
        </form>
        <Card className="sticky bottom-0 z-10 border-slate-200 bg-white/90 backdrop-blur shadow-lg">

            <CardContent className="flex justify-end gap-3 p-4">

                <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => router.back()}
                >
                Annuler
                </Button>

                <Button
                    form="userForm"
                    type="submit"
                    disabled={isSubmitting}
                >
                    {mode === "create"
                        ? "Créer l'utilisateur"
                        : "Mettre à jour"}
                </Button>

            </CardContent>

        </Card>
      </main>
    </div>
  );
}

