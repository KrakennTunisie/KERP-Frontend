import { useEffect, useMemo, useState } from "react";
import { SupplierPartnerItem } from "../models/partner";

import { useDebounce } from "@/shared/hooks/useDebounce";
import { partnersApi } from "../api/partners-api";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";
import { useRouter } from "next/navigation";

export default function useSuppliersLists() {
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string>('');



  const [suppliers, setSuppliers] = useState<SupplierPartnerItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 2000);

const cities = useMemo(() => Array.from(new Set(suppliers.map((c) => c.billingAddress!.region))), [suppliers]);

const fetchClients = async () => {
    try {
      setLoading(true);
      const keyword =
        debouncedSearchQuery.trim().length >= 3
          ? debouncedSearchQuery.trim()
          : undefined;

      const response = await partnersApi.getSuppliers({
        keyword: keyword,
        filter: filterCity !== "all" ? filterCity : undefined,
        page: currentPage - 1,
      });

      setSuppliers(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      appToast.error("Erreur de fetch clients: ",getApiErrorMessage(error))
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  setCurrentPage(1);
}, [debouncedSearchQuery, filterCity]);

useEffect(() => {
  
  fetchClients();
}, [debouncedSearchQuery, filterCity, currentPage]);
    
    
    return { fetchClients, debouncedSearchQuery, filterCity, currentPage, cities, searchQuery, setCurrentPage, setDeleteConfirmId, setSearchQuery
        , setTotalElements, setTotalPages, setFilterCity, deleteConfirmId, totalElements, totalPages, loading, suppliers};
}