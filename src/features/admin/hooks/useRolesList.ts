import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";
import { useEffect, useState } from "react";
import {  rolesAPI } from "../services/api";
import {  Permission } from "../models/permission";
import { Role } from "../models/role";


export function useRolesList(){

    const [roles, setRoles]= useState<Role[]|[]>([])
    const [loading, setLoading]=useState(false)
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);

    
    const fetchRoles = async () => {
        try {
            setLoading(true);

            const response = await rolesAPI.getAllRoles({
                page: currentPage - 1,
            });

            console.log(response)

            setRoles(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error) {
            appToast.error("Erreur de fetch utilisateurs: ",getApiErrorMessage(error))
        } finally {
            setLoading(false);
        }
        };

    useEffect(() => {
        fetchRoles();
    }, [currentPage]);

    return {
        loading,
        roles,
        currentPage,
        setCurrentPage,
        totalElements,
        totalPages,
        detailsOpen, setDetailsOpen,
        selectedPermission, setSelectedPermission,
        fetchRoles
    }
}