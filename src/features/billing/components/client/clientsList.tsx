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
import { useRouter } from 'next/navigation';
import { PageHeader } from '../widgets/header';
import { FiltersBar } from '@/shared/components/ui/filtreBar';


export default function ClientsList() {

  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string>('');


  const [formData, setFormData] = useState<ClientPartnerItem>({
    iban: '',
    taxRegistrationNumber: '',
    partnerName: '',
    companyName: '',
    billingAddress: {
      street1: '',
      street2: '',
      region: '',
      state: '',
      zipCode: "",
      city: "",
      addressType: "",
    },
    email: '',
    professionnalPhoneNumber: '',
    partnerType: "CLIENT",
    idPartner: '',
  });

  const [clients, setClients] = useState<ClientPartnerItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const cities = useMemo(() => Array.from(new Set(clients.map((c) => c.billingAddress.region))), [clients]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const keyword =
        debouncedSearchQuery.trim().length >= 3
          ? debouncedSearchQuery.trim()
          : undefined;
      const response = await partnersApi.getClients({
        keyword: keyword,
        filter: filterCity !== "all" ? filterCity : undefined,
        page: currentPage - 1,
      });

      setClients(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (error) {
      appToast.error("Erreur de fetch clients: ", getApiErrorMessage(error))
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



  const onUpdateRequest = (row: ClientPartnerItem) => {
    setFormData(row)
    setShowUpdateModal(true)
  }


  return (
    <div className="min-h-screen flex-1 flex flex-col min-h-0 bg-gray-50">
      {/* Header */}
      <PageHeader
        title="Mes Clients"
        description="Gérez votre portefeuille clients"
        actionLabel="Ajouter un client"
        actionIcon={Plus}
        onAction={() => router.push("/billing/clients/new")}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
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
          <ClientsTable
            rows={clients}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalPages={totalPages}
            loading={loading}
            totalElements={totalElements}
            onDeleteRequest={setDeleteConfirmId}
            onUpdateRequest={onUpdateRequest}

          />

          <ClientDeleteModal
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