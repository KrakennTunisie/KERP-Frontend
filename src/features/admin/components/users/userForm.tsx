'use client'

import { ArrowLeft, Check, Save, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { UserRole, UserStatus } from "../../mocks/mock-users"
import { useState } from "react"
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
export type PropsForm = {
  userId?: string,
  mode: "create" |"edit"
}


export default function UserForm ({userId, mode}:PropsForm) {
     const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "USER" as UserRole,
    status: "ACTIVE" as UserStatus,
  });

  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (mode === "create") {
      console.log("Create user", form);
    } else {
      console.log("Update user", userId, form);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">

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
        <form className="mx-auto space-y-6 pb-10">

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
                    placeholder="John"
                    required
                />

                <Input
                    label="Nom"
                    placeholder="Doe"
                    required
                />

                <Input
                    label="Email"
                    placeholder="john.doe@company.com"
                    required
                    type="email"
                    className="md:col-span-2"
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div className="space-y-2">

                    <Label required>
                    Rôle
                    </Label>

                    <Select>
                    <SelectTrigger className="bg-slate-50">
                        <SelectValue placeholder="Choisir un rôle" />
                    </SelectTrigger>

                    <SelectContent>

                        <SelectItem value="MANAGER">
                        Manager
                        </SelectItem>

                        <SelectItem value="ACCOUNTANT">
                        Comptable
                        </SelectItem>

                        <SelectItem value="CLIENT">
                        Client
                        </SelectItem>

                        <SelectItem value="SUPPLIER">
                        Fournisseur
                        </SelectItem>

                        <SelectItem value="USER">
                        Utilisateur
                        </SelectItem>

                    </SelectContent>

                    </Select>

                </div>


                

                    <div className="space-y-2">

                    <Label>
                        Statut
                    </Label>

                    <Select>

                        <SelectTrigger className="bg-slate-50">
                        <SelectValue placeholder="Choisir le statut" />
                    </SelectTrigger>

                        <SelectContent>

                        <SelectItem className="" value="ACTIVE">
                            Actif
                        </SelectItem>

                        <SelectItem value="INACTIVE">
                            Inactif
                        </SelectItem>

                        <SelectItem value="BLOCKED">
                            Bloqué
                        </SelectItem>

                        </SelectContent>

                    </Select>

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
                onClick={() => router.back()}
                >
                Annuler
                </Button>

                <Button type="submit">

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

