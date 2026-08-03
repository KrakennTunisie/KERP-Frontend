import { PropsForm } from "../components/users/userForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { rolesAPI, usersAPI } from "../services/api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { CreateUser, CreateUserSchema } from "../models/user";
import { RoleDTO } from "../models/role";


export function useCreateEditUser({ userId, mode }: PropsForm){
    const router = useRouter();
    const [roles, setRoles]=useState<RoleDTO[]|[]>([])

    const fetchRoles = async ()=>{
      try {
        const response = await rolesAPI.getRoles();
        setRoles(response)
        
      } catch (error) {
        appToast.error("Erreur de fetch roles", getApiErrorMessage(error))
      }
    }

    useEffect(() => {
        const loadRoles = async () => {
            await fetchRoles();
        };

         loadRoles();
    }, []);
    

    const {
      register,
      handleSubmit,
      reset,
      setValue,
      getValues,
      watch,
      formState: { errors, isSubmitting },
    } = useForm<CreateUser>({
      resolver: zodResolver(CreateUserSchema),
      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        roles: "USER",
        status: "ACTIVE",
      },
    });

    const getUserById = async ()=>{
      if(!userId){
        appToast.error("Id utilisateur non existante")
        return;
      }
        console.log('userId', userId)
      try {
        const response = await usersAPI.getUserById(userId)
        reset(response as CreateUser)

        setValue("roles","USER")
        console.log('roles', getValues('roles'))
      } catch (error) {
        appToast.error("Erreur fetch user", getApiErrorMessage(error))
      }
    }

    useEffect(() => {
      if (mode === "edit") {
        // TODO: replace with API call
        getUserById()
      }
    }, [mode, userId, reset]);

    const buildForm = (user: CreateUser): FormData => {
        console.log("hello")
        const formData = new FormData();
        const formattedUserName = user.firstName.trim()+user.lastName.trim()

        formData.append(
          "username",
          formattedUserName.trim().replace(" ", "")
        );
        formData.append("email", user.email);
        formData.append("firstname", user.firstName);
        formData.append("lastname", user.lastName);
        formData.append("phoneNumber", user.phoneNumber);
        formData.append("status", String(user.status));
        if(mode=="create"){
          formData.append("role", String(user.roles));

        }


        return formData;
    };

    const onSubmit = async (data: CreateUser) => {
        const formData = buildForm(data)
        try {
            
            if (mode === "create") {
                console.log("Create", data);
                await usersAPI.addUser(formData)
                appToast.success("Enregistré avec succès.")
                router.push('/admin/users')

            } else {
                console.log("Update", userId, data);
                await usersAPI.updateUser(userId!, formData)
                appToast.success("Mise à jour avec succès.")
                router.push('/admin/users')

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
      router,
      roles
    }

    
}