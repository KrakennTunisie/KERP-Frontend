'use client';

import {
  Plus
} from 'lucide-react';


import SuppliersTable from "./suppliersTable";

import { FiltersBar } from '@/shared/components/ui/filtreBar';
import { useRouter } from 'next/navigation';
import usePartnerList, { partnerListProps } from '../../hooks/usePartnerList';
import { partnerTypeSchema } from '../../types/partnerType';
import { PageHeader } from '../widgets/header';
import SupplierDeleteModal from "./deleteSupplierModal";
import { PartnerDocumentType } from '../../types/documentType';


export default function SuppliersList({ partnerType }: partnerListProps) {
  const router = useRouter();
  const { fetchPartner, filterCity, currentPage, cities, searchQuery, setCurrentPage, setDeleteConfirmId, setSearchQuery, openEmail, addDocument, sendDocumentOpen, setSendDocumentOpen, openAddDocument, setOpenAddDocument, addDocumentLoading, addDocumentType, setOpenEmail, onAddDocument, updatePartnerStatus
    , loading, suppliers, setFilterCity, deleteConfirmId, totalElements, totalPages } = usePartnerList({ partnerType });
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
              label: city ?? "",
              value: city ?? "",
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
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalPages={totalPages}
            loading={loading}
            totalElements={totalElements}
            onDeleteRequest={setDeleteConfirmId}
            setOpenEmail={setOpenEmail}
            updateStatus={updatePartnerStatus}
            onAddDocument={(type: PartnerDocumentType) => onAddDocument(type)}
            openAddDocument={openAddDocument}
            addDocumentLoading={addDocumentLoading}
            addDocumentType={addDocumentType}
            setOpenAddDocument={setOpenAddDocument}
            addDocument={addDocument}
            openEmail={openEmail}
          />


          <SupplierDeleteModal
            open={!!deleteConfirmId}
            onClose={() => setDeleteConfirmId('')}
            onCreated={() => {
              fetchPartner(partnerTypeSchema.enum.SUPPLIER);
            }}
            confirmDeleteId={deleteConfirmId}
          />
        </div>
      </main>
    </div>
  );
}