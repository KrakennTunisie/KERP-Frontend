import { useEffect, useState } from "react";
import { User } from "../mocks/mock-users";
import { usersAPI } from "../services/api";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { useRouter } from "next/navigation";


export function useUsersList(){
    const [users, setUsers]= useState<User[]|[]>([])
    const [loading, setLoading]=useState(false)
    const [search, setSearch] = useState("");
    const [filtre, setFiltre] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const debouncedSearchQuery = useDebounce(search, 2000);

    const router = useRouter()

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const keyword =
            debouncedSearchQuery.trim().length >= 3
                ? debouncedSearchQuery.trim()
                : undefined;

            const response = await usersAPI.getAllUsers({
                keyword: keyword,
                filter: filtre?.toString(),
                page: currentPage - 1,
            });

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
    }, [filtre, debouncedSearchQuery]);

    useEffect(() => {
        fetchUsers();
    }, [debouncedSearchQuery, currentPage, filtre]);


    
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

    }
}