'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Plus
} from 'lucide-react';



import { ClientPartnerItem } from '../../models/partner';
import ClientUpdateModal from "./updateClientModal";
import ClientDeleteModal from "./deleteClientModal";
import { partnersApi } from "../../api/partners-api";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";
import { useDebounce } from '@/shared/hooks/useDebounce';
import ClientsTable from './clientsTable';
import ClientCreateModal from './createClientModal';


export default function ClientsList() {

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string>('');


  const [formData, setFormData] = useState<ClientPartnerItem>({
    iban: '',
    taxRegistrationNumber: '',
    name: '',
    adress: '',
    country: '',
    email: '',
    phoneNumber: '',
    partnerType: "CLIENT",
    idPartner:'',
  });

const [error, setError] = useState<string | null>(null);
const [clients, setClients] = useState<ClientPartnerItem[]>([]);
const [totalPages, setTotalPages] = useState(1);
const [totalElements, setTotalElements] = useState(0);
const [loading, setLoading] = useState(false);
const debouncedSearchQuery = useDebounce(searchQuery, 2000);

const cities = useMemo(() => Array.from(new Set(clients.map((c) => c.country))), [clients]);

useEffect(() => {
  setCurrentPage(1);
}, [clients,debouncedSearchQuery, filterCity,]);

useEffect(() => {
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const keyword =
        debouncedSearchQuery.trim().length >= 3
          ? debouncedSearchQuery.trim()
          : undefined;
      const response = await partnersApi.getClients({
        keyword: keyword,
        country: filterCity !== "all" ? filterCity : undefined,
        page: currentPage - 1,
      });

      setClients(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      setError(getApiErrorMessage(error));
      appToast.error("Erreur de fetch clients: ",getApiErrorMessage(error))
    } finally {
      setLoading(false);
    }
  };

  fetchClients();
}, [debouncedSearchQuery, filterCity, currentPage,clients]);



  const onUpdateRequest = (row : ClientPartnerItem)=>{
        setFormData(row)
        setShowUpdateModal(true)
  }


  return (
    <div className="flex-1 flex flex-col min-h-0 bg-gray-50/30">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-600 w-2 h-2 rounded-full" />
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">
                Gestion Commerciale
              </span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Mes Clients</h1>
            <p className="text-gray-700 font-bold mt-1">Gérez votre portefeuille clients</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-[20px] hover:bg-black transition-all font-black text-sm shadow-xl shadow-gray-200 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Ajouter un client
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Filters Bar */}
          <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                  Recherche
                </label>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Nom, MF ou Email..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 text-sm font-bold transition-all text-gray-900 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">
                  Ville
                </label>
                <select
                  value={filterCity}
                  onChange={(e) => {
                    setFilterCity(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 text-sm font-bold cursor-pointer transition-all appearance-none text-gray-900"
                >
                  <option value="all">Toutes les villes</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
        <ClientsTable 
            rows={clients}
            setCurrentPage= {setCurrentPage}
            currentPage= {currentPage}
            totalPages= {totalPages}
            loading= {loading}
            totalElements= {totalElements}
            onDeleteRequest={setDeleteConfirmId}
            onUpdateRequest = {onUpdateRequest}
            
        />

                <ClientCreateModal
                    open={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onCreated={() => {
                    // refresh list (re-fetch)
                    }}
                />
                <ClientUpdateModal
                  open ={showUpdateModal}
                  onClose={()=> setShowUpdateModal(false)}
                  onCreated={()=>{}}
                  data={formData}
                />

                <ClientDeleteModal
                    open={!!deleteConfirmId}
                    onClose={() => setDeleteConfirmId('')} 
                    confirmDeleteId={deleteConfirmId}                
                />
        </div>
      </main>
    </div>
  );
}