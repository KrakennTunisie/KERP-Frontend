'use client';

import dynamic from "next/dynamic";

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Plus
} from 'lucide-react';


const SuppliersTable = lazyComponent(
  () => import("./suppliersTable"),
  "Chargement des fournisseurs..."
);

const SupplierCreateModal = dynamic((): any => import("./createSupplierModal"), {
  loading: () => null,
});

import {   SupplierPartnerItem } from '../../models/partner';
import lazyComponent from "@/shared/utils/lazyComponent";
import SupplierUpdateModal from "./updateSupplierModal";
import SupplierDeleteModal from "./deleteSupplierModal";
import { partnersApi } from "../../api/partners-api";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";


export default function SuppliersList() {

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<SupplierPartnerItem>>({
    iban:'',
    taxRegistrationNumber: '',
    name: '',
    adress: '',
    country: '',
    email: '',
    phoneNumber: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [suppliers, setSuppliers] = useState<SupplierPartnerItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

const cities = useMemo(() => Array.from(new Set(suppliers.map((c) => c.country))), []);

useEffect(() => {
  setCurrentPage(1);
}, [searchQuery, filterCity]);

useEffect(() => {
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await partnersApi.getSuppliers({
        keyword: searchQuery.trim() || undefined,
        country: filterCity !== "all" ? filterCity : undefined,
        page: currentPage - 1,
      });

      setSuppliers(response.content);
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
}, [searchQuery, filterCity, currentPage]);




  const onUpdateRequest = (row : SupplierPartnerItem)=>{
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
              <span className="bg-emerald-600 w-2 h-2 rounded-full" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Gestion des Achats</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Mes Fournisseurs</h1>
            <p className="text-gray-700 font-bold mt-1">Gérez votre réseau de fournisseurs</p>
          </div>
          
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-[20px] hover:bg-black transition-all font-black text-sm shadow-xl shadow-gray-200 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Ajouter un fournisseur
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
                    />
                
                <SupplierUpdateModal
                  open ={showUpdateModal}
                  onClose={()=> setShowUpdateModal(false)}
                  onCreated={()=>{}}
                  data={formData}
                />

                <SupplierDeleteModal
                    open={!!deleteConfirmId}
                    onClose={() => setDeleteConfirmId(null)} 
                    confirmDeleteId={deleteConfirmId}                
                />
        </div>
      </main>
    </div>
  );
}