import { useEffect, useState } from "react";
import { rolesAPI, usersAPI } from "../services/api";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { useRouter } from "next/navigation";
import { UserResponse } from "../models/user";
import { RoleDTO } from "../models/role";


export function useUsersList(){
    const [users, setUsers]= useState<UserResponse[]|[]>([])
    const [loading, setLoading]=useState(false)
    const [search, setSearch] = useState("");
    const [filtre, setFiltre] = useState("ALL");
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [role, setRole] = useState("ALL");
    const debouncedSearchQuery = useDebounce(search, 2000);

    const [updateOpen, setUpdateOpen]= useState(false)
    const [deleteOpen, setDeleteOpen]= useState(false)
    const [selectedUser, setSelectedUser]=useState<UserResponse| null>(null)


    const onCloseUpdateModal = ()=>{
        setSelectedUser(null)
        setUpdateOpen(false)
    }

    const onCloseDeleteModal = ()=>{
        setSelectedUser(null)
        setDeleteOpen(false)
    }

    const onOpenUpdateModal = (user: UserResponse)=>{
        setSelectedUser(user)
        setUpdateOpen(true)
    }

    const onOpenDeleteModal = (user: UserResponse)=>{
        setSelectedUser(user)
        setDeleteOpen(true)
    }



    const router = useRouter()


      const [roles, setRoles] = useState<RoleDTO[]|[]>([])

      
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
    

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const keyword =
            debouncedSearchQuery.trim().length >= 3
                ? debouncedSearchQuery.trim()
                : undefined;

            const response = await usersAPI.getAllUsers({
                keyword: keyword,
                statusFilter: filtre=="ALL" ? "" : filtre?.toString() ,
                roleFilter: role=="ALL" ? "" : role?.toString(),
                page: currentPage - 1,
            });

            console.log(response)

            setUsers(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (error) {
            appToast.error("Erreur de fetch utilisateurs: ",getApiErrorMessage(error))
        } finally {
            setLoading(false);
        }
        };


    useEffect(() => {
        setCurrentPage(1);
    }, [filtre, role, debouncedSearchQuery]);

    useEffect(() => {
        fetchUsers();
    }, [debouncedSearchQuery, currentPage, filtre, role]);


    
    return {
     router,
     search,
     setSearch,
     filtre,
     setFiltre,
     users,
     currentPage,
     setCurrentPage,
     totalElements,
     totalPages,
     loading,

     onCloseDeleteModal,
     onCloseUpdateModal,

     onOpenDeleteModal,
     onOpenUpdateModal,

     updateOpen,
     deleteOpen,
     selectedUser,

     fetchUsers,

     roles,

     role, setRole

    }
}