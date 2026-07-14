import { PropsForm } from "../components/users/userForm";
import { CreateUser, CreateUserSchema } from "../mocks/mock-users";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usersAPI } from "../services/api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";


export function useCreateEditUser({ userId, mode }: PropsForm){
    const router = useRouter();

    const {
      register,
      handleSubmit,
      reset,
      setValue,
      watch,
      formState: { errors, isSubmitting },
    } = useForm<CreateUser>({
      resolver: zodResolver(CreateUserSchema),
      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "USER",
        status: "ACTIVE",
      },
    });

    useEffect(() => {
      if (mode === "edit") {
        // TODO: replace with API call
        const user = {
          firstName: "Ahmed",
          lastName: "Ben Ali",
          email: "ahmed@test.com",
          phone: "22123456",
          role: "ADMIN",
          status: "ACTIVE",
        };

        reset();
      }
    }, [mode, userId, reset]);

    const buildForm = (user: CreateUser): FormData => {
        const formData = new FormData();

        formData.append("username", user.firstName);
        formData.append("email", user.email);
        formData.append("firstname", user.firstName);
        formData.append("lastname", user.lastName);
        formData.append("phoneNumber", user.phone);
        formData.append("status", String(user.status));


        return formData;
    };

    const onSubmit = async (data: CreateUser) => {
        const formData = buildForm(data)
        try {
            
            if (mode === "create") {
                console.log("Create", data);
                await usersAPI.addUser(formData)
                appToast.success("Enregistré avec succès.")

            } else {
                console.log("Update", userId, data);
                await usersAPI.updateUser(userId!, formData)
                appToast.success("Mise à jour avec succès.")
            }
        } catch (error) {
            appToast.error("Erreur: ", getApiErrorMessage(error))
        }
    };

    return{
        onSubmit,
        register,
      handleSubmit,
      reset,
      setValue,
      watch,
      errors, isSubmitting,
      router
    }

    
}