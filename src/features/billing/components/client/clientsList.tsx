'use client';

import {
  Plus
} from 'lucide-react';


import ClientsTable from './clientsTable';
import ClientDeleteModal from "./deleteClientModal";

import { FiltersBar } from '@/shared/components/ui/filtreBar';
import { useRouter } from 'next/navigation';
import { partnerListProps } from '../../hooks/usePartnerList';
import { partnerTypeSchema } from '../../types/partnerType';
import { PageHeader } from '../widgets/header';

import usePartnerList from '../../hooks/usePartnerList';


export default function ClientsList({partnerType}: partnerListProps) {

  const router = useRouter();
  const { fetchPartner, filterCity, currentPage, cities, searchQuery, setCurrentPage, setDeleteConfirmId, setSearchQuery
    , loading, clients, setFilterCity, deleteConfirmId, totalElements, totalPages } = usePartnerList({partnerType});
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
          <ClientsTable
            rows={clients}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalPages={totalPages}
            loading={loading}
            totalElements={totalElements}
            onDeleteRequest={setDeleteConfirmId}

          />

          <ClientDeleteModal
            open={!!deleteConfirmId}
            onClose={() => setDeleteConfirmId('')}
            onCreated={() => {
              fetchPartner(partnerTypeSchema.enum.CLIENT);
            }}
            confirmDeleteId={deleteConfirmId}
          />
        </div>
      </main>
    </div>
  );
}