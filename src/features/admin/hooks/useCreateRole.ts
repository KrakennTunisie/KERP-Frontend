import { useState } from "react";
import { CreateRole, CreateRoleSchema, Role } from "../models/role";
import { AffectFormAttributes, PermissionDTO } from "../models/permission";
import { appToast } from "@/shared/lib/toast";
import { rolesAPI } from "../services/api";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type props = {
    fetchRoles: ()=>Promise<void>
}


export function useCreateRole({fetchRoles}:props){
  const [modalOpen, setModalOpen] =useState(false)

  const [createModalOpen, setCreateModalOpen] =useState(false)
  const [selectedRole, setSelectedRole] =useState<Role | null>( null)
  const [revokeModalOpen, setRevokeModalOpen] = useState(false);
  const [loadingForm, setLoadingForm]=useState(false)
  const [loadingAddPermission, setLoadingAddPermission]=useState(false)
  const [loadingRevokePermission, setLoadingRevokePermission]=useState(false)
  const [selectedPermission, setSelectedPermission] = useState<PermissionDTO | null>(null);



    const form  = useForm<CreateRole>({
      resolver: zodResolver(CreateRoleSchema),
      defaultValues: {
        name: "",
        description: "",
        permissions: [],
      },
    });

    const affectForm = useForm<AffectFormAttributes>({
      defaultValues: {
        permissions: [],
      },
    });

    const {
      watch,
      setValue,
      handleSubmit,
    } = affectForm

    
  const {reset} = form

  const handleAddPermission = async (permissions: PermissionDTO[])=>{
    if(!selectedRole){
      appToast.error("Aucun role séléctionné!")
      return;
    }
    try {
        setLoadingAddPermission(true)
     const formData = new FormData();

      permissions.forEach((permission, index) => {
        formData.append(
          `permissions[${index}].clientId`,
          permission.clientId
        );

        formData.append(
          `permissions[${index}].name`,
          permission.name
        );

        formData.append(
          `permissions[${index}].description`,
          permission.description ?? ""
        );
      }); 

      await rolesAPI.addPermissionsToRole(selectedRole?.name, formData)
      appToast.success("Les permissions sont affectés avec succès")
      setValue("permissions", [])
      await fetchRoles()
      setModalOpen(false)
    } catch (error) {
      appToast.error("Erreur affectaion", getApiErrorMessage(error))
    }
    finally{
                setLoadingAddPermission(false)

    }
  }

  const handleRevokePermission = async ()=>{
    if(!selectedPermission || !selectedRole || !selectedRole.name){
         appToast.error("Rôle ou permission non séléctionné");
            return;
    }

    try {
      setLoadingRevokePermission(true)

      await rolesAPI.revokePermissionRole(selectedRole?.name, selectedPermission?.clientId, selectedPermission?.name)
      appToast.success("Permission Annulée avec succeès");
      setSelectedRole(null)
      setSelectedPermission(null)
      await fetchRoles()
      
      setRevokeModalOpen(false)
    } catch (error) {
      appToast.error("Erreur annulation", getApiErrorMessage(error))

    }finally{
                setLoadingRevokePermission(false)

    }
  }

  const buildForm = (role: CreateRole): FormData => {
    const formData = new FormData();

    formData.append("name", role.name);

    formData.append("description", role.description ?? "");

    role.permissions.forEach((permission, index) => {
      formData.append(
        `permissionDTOList[${index}].clientId`,
        permission.clientId
      );

      formData.append(
        `permissionDTOList[${index}].name`,
        permission.name
      );

      formData.append(
        `permissionDTOList[${index}].description`,
        permission.description ?? ""
      );
    });

    return formData;
  };

  const onSubmit = async (data: CreateRole) => {
      
      try {
        setLoadingForm(true)
          
              console.log("Create", data);
              const formData = buildForm(data)
              for (const [key, value] of formData.entries()) {
                console.log(key, value);
              }
              await rolesAPI.addRole(formData)

              appToast.success("Enregistré avec succès.")

              await fetchRoles()

              reset()

              setCreateModalOpen(false)
      } catch (error) {

          appToast.error("Erreur: ", getApiErrorMessage(error))

      } finally{

        setLoadingForm(false)
      }
  };

  const refreshRole = async ()=>{
    if(!selectedRole || !selectedRole.name){
      appToast.error("Rôle non séléctionné !")
      return;
    }
    try {

      await rolesAPI.getRoleByName(selectedRole.name)
      
    } catch (error) {
      appToast.error("Erreur refresh", getApiErrorMessage(error))
    }
  }

  return {
    affectForm,
    form,
    refreshRole,
    createModalOpen,
    setCreateModalOpen,
    selectedRole,
    setSelectedRole,
    selectedPermission,
    setSelectedPermission,
    revokeModalOpen,
    setRevokeModalOpen,
    handleAddPermission,
    handleRevokePermission,
    onSubmit,
    modalOpen,
    setModalOpen,
    loadingForm, loadingAddPermission, loadingRevokePermission,
  }
}