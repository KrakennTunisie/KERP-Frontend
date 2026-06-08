'use client';


import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Plus
} from 'lucide-react';


import SuppliersTable from "./suppliersTable"
import SupplierCreateModal from "./createSupplierModal";
import {   SupplierPartnerItem } from '../../models/partner';
import SupplierUpdateModal from "./updateSupplierModal";
import SupplierDeleteModal from "./deleteSupplierModal";
import { partnersApi } from "../../api/partners-api";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useRouter } from 'next/navigation';
import { PageHeader } from '../widgets/header';
import { FiltersBar } from '@/shared/components/ui/filtreBar';


export default function SuppliersList() {

  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string>('');

  const [formData, setFormData] = useState<SupplierPartnerItem>({
    iban:'',
    taxRegistrationNumber: '',
    name: '',
    address: '',
    country: '',
    email: '',
    phoneNumber: '',
    partnerType: "SUPPLIER",
    idPartner:'',

  });

  const [suppliers, setSuppliers] = useState<SupplierPartnerItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 2000);

const cities = useMemo(() => Array.from(new Set(suppliers.map((c) => c.country))), [suppliers]);

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




  const onUpdateRequest = (row : SupplierPartnerItem)=>{
          setFormData(row)
          setShowUpdateModal(true)
    }

  return (
    <div className=" min-h-screen flex-1 flex flex-col min-h-0 bg-gray-50">
      {/* Header */}
      <PageHeader
        title="Mes Fournisseurs"
        description="Gérez vos fournisseurs et leurs documents"
        actionLabel="Ajouter un fournisseur"
        actionIcon={Plus}
        onAction={() => router.push("/billing/suppliers/new")}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto space-y-8">
          {/* Filters Bar */}
          <FiltersBar
            searchValue={searchQuery}
            onSearchChange={(value) => {
              setSearchQuery(value);
              setCurrentPage(1);
            }}
            cityValue={filterCity}
            onCityChange={(value) => {
              setFilterCity(value);
              setCurrentPage(1);
            }}
            cityOptions={cities.map((city) => ({
              label: city,
              value: city,
            }))}
            onReset={() => {
              setSearchQuery("");
              setFilterCity("all");
              setCurrentPage(1);
            }}
          />

          {/* Table */}
        <SuppliersTable 
            rows={suppliers}
            setCurrentPage= {setCurrentPage}
            currentPage= {currentPage}
            totalPages= {totalPages}
            loading= {loading}
            totalElements= {totalElements} 
            onDeleteRequest={setDeleteConfirmId}
            onUpdateRequest = {onUpdateRequest}
        />

                <SupplierCreateModal
                    open={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onCreated={fetchClients}
                    />
                
                <SupplierUpdateModal
                  open ={showUpdateModal}
                  onClose={()=> setShowUpdateModal(false)}
                  onCreated={fetchClients}
                  data={formData}
                />

                <SupplierDeleteModal
                    open={!!deleteConfirmId}
                    onClose={() => setDeleteConfirmId('')} 
                    onCreated={fetchClients}
                    confirmDeleteId={deleteConfirmId}                
                />
        </div>
      </main>
    </div>
  );
}