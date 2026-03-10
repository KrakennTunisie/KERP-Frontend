'use client';

import dynamic from "next/dynamic";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Plus
} from 'lucide-react';

import lazyComponent from "@/shared/utils/lazyComponent";


const ClientsTable = lazyComponent(
  () => import("./clientsTable"),
  "Chargement des clients..."
);




const ClientCreateModal = lazyComponent(
  () => import("./createClientModal"),
  "Chargement du formulaire client..."
);



import { ClientPartnerItem } from '../../models/partner';
import ClientUpdateModal from "./updateClientModal";
import ClientDeleteModal from "./deleteClientModal";


const mockClients: ClientPartnerItem[]=[
  {
    idPartner: '1',
    taxRegistrationNumber: '1234567/A/M/000',
    name: 'TechCorp Solutions SA',
    adress: 'Zone Industrielle Kheireddine',
    country: 'Le Kram',
    email: 'contact@techcorp.tn',
    phoneNumber: '+216 71 000 001',
    partnerType : 'CLIENT',
    iban:'123456789'
  },
  {
    idPartner: '2',
    taxRegistrationNumber: '9876543/B/N/001',
    name: 'Digital HR Services Ltd',
    adress: 'Avenue Habib Bourguiba',
    country: 'Tunis',
    email: 'contact@digitalhr.com',
    phoneNumber: '+216 71 222 333',
    partnerType : 'CLIENT',
    iban:'123789456'

  },
  {
    idPartner: '3',
    taxRegistrationNumber: '0001112/C/P/000',
    name: 'Tunis Telecom',
    adress: "Place de l'Indépendance",
    country: 'Tunis',
    email: 'billing@tunistelecom.tn',
    phoneNumber: '+216 71 888 999',
    partnerType : 'CLIENT',
    iban:'135798462'

  },
  {
    idPartner: '4',
    taxRegistrationNumber: '5554443/D/M/002',
    name: 'Innovation Labs SA',
    adress: 'Rue de la Liberté',
    country: 'Sfax',
    email: 'info@innovationlabs.tn',
    phoneNumber: '+216 74 111 222',
    partnerType : 'CLIENT',
    iban:'987654321'

  },
];

export default function ClientsList() {

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const itemsPerPage = 10;

  const [formData, setFormData] = useState<Partial<ClientPartnerItem>>({
    iban: '',
    name: '',
    adress: '',
    country: '',
    email: '',
    phoneNumber: '',
  });

  const cities = useMemo(() => Array.from(new Set(mockClients.map((c) => c.country))), []);

  const filteredClients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return mockClients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(q) ||
        client.taxRegistrationNumber.toLowerCase().includes(q) ||
        (client.email?.toLowerCase().includes(q) ?? false);

      const matchesCity = filterCity === 'all' || client.country === filterCity;

      return matchesSearch && matchesCity;
    });
  }, [searchQuery, filterCity]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / itemsPerPage));

  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredClients.slice(start, start + itemsPerPage);
  }, [filteredClients, currentPage]);



  const onUpdateRequest = (row : ClientPartnerItem)=>{
    console.log("rows: ",row)
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
            rows={paginatedClients} 
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
                    onClose={() => setDeleteConfirmId(null)} 
                    confirmDeleteId={deleteConfirmId}                
                />
        </div>
      </main>
    </div>
  );
}