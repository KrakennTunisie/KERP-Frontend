import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";
import { useEffect, useState } from "react";
import { permissionsAPI } from "../services/api";
import { ClientPermissions, Permission } from "../models/permission";


export function usePermissionsList(){

    const [permissions, setPermissions]= useState<ClientPermissions[]|[]>([])
    const [loading, setLoading]=useState(true)
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedPermission, setSelectedPermission] =
    useState<Permission | null>(null);

    
    const fetchPermissions = async () => {
        try {
            const response = await permissionsAPI.getAllPermissions({
                page: currentPage - 1,
            });

            console.log(response)

            setPermissions(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error) {
            appToast.error("Erreur de fetch utilisateurs: ",getApiErrorMessage(error))
        } finally {
            setLoading(false);
        }
        };

    useEffect(() => {
        fetchPermissions();
    }, []);

    return {
        loading,
        permissions,
        currentPage,
        setCurrentPage,
        totalElements,
        totalPages,
        detailsOpen, setDetailsOpen,
        selectedPermission, setSelectedPermission
    }
}