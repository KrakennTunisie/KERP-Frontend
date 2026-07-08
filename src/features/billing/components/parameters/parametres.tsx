"use client";


import { OperationCategoryCard } from "./operationCategorySettingsCrad";
import { VatRateCard } from "./vatRateSettingsCard";
import { PaymentConditionCard } from "./paymentSettingsCard";
import { BillingPageHeader } from "../widgets/billingHeader";
import DeleteSettingModal from "./deleteSettingItem";
import { useState } from "react";
import { SettingItem } from "./settingCard";
import { appToast } from "@/shared/lib/toast";
import SettingDetailsModal from "./detailsSettingItem";
import ToggleSettingStatusModal from "./activateConfirmationModal";
import AddSettingModal, { SettingFormData } from "./addSettingItem";


export default function BillingSettingsPage() {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const [detailsModalOpen, setDetailsModalOpen] = useState(false)

    const [toggleModalOpen, setToggleModalOpen] = useState(false);
    const [toggleLoading, setToggleLoading] = useState(false);

    const [selectedItem, setSelectedItem] = useState<SettingItem | null>(null);

    const [typeAdd, setTypeAdd] = useState<String | null>(null);


    const [openAddModal, setOpenAddModal] = useState(false);
    const [loadingAddModal, setLoadingAddModal] = useState(false);

    const handleDelete = async () => {
        if (selectedItem == null) return;
        setDeleteLoading(true)

        try {
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    resolve();
                }, 2000); // 2 secondes
            });
            switch (selectedItem.type) {
                case "TVA": console.log('delete tva'); break;
                case "OperationCategory": console.log('delete OperationCategory'); break;
                case "PaymentCondition": console.log('delete PaymentCondition'); break;
                default: console.log("Not recognized")
            }

            appToast.success('Deleted successfully')

            setDeleteModalOpen(false)

        } catch (error) {
            appToast.error("Erreurr suppression", "errreur")
        }
        finally {
            setDeleteLoading(false)
        }

    }

    const onDelete = (item: SettingItem) => {
        setDeleteModalOpen(true);
        setSelectedItem(item)
    }

    const onShowDetails = (item: SettingItem) => {
        setDetailsModalOpen(true);
        setSelectedItem(item)
    }

    const onActivate = (item: SettingItem) => {
        setSelectedItem(item);
        setToggleModalOpen(true)
    }

    const onAction = (type: string) => {
        setTypeAdd(type)
        setOpenAddModal(true)
    }

    const handleToggleStatus = async () => {
        if (!selectedItem) return;

        setToggleLoading(true);

        try {
            // Mock API
            await new Promise((resolve) => setTimeout(resolve, 2000));


            setToggleModalOpen(false);
        } finally {
            setToggleLoading(false);
        }
    };


    const handleCreate = async (data: SettingFormData) => {
        setLoadingAddModal(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));

            console.log(data);

            setOpenAddModal(false);
        } finally {
            setLoadingAddModal(false);
        }
    };
    const getTitleAddModal = (): string => {
        if (!typeAdd) return "Ajouter configuration";
        switch (typeAdd) {
            case "TVA": return "Ajouter un taux TVA";
            case "OperationCategory": return "Ajouter une catégorie d'opération";
            case "PaymentCondition": return "Ajouter une condition de paiement";
            default: return "Ajouter configuration"
        }
    }

    return (
        <div className="flex flex-col bg-white gap-8 p-6">

            {/* Header */}
            <BillingPageHeader
                title="Paramètres de facturation"
                description="Configurez les données de référence utilisées dans l'ensemble du module de facturation."
            />


            {/* Management Cards */}
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                <OperationCategoryCard
                    onDelete={onDelete}
                    onShow={onShowDetails}
                    onToggleActive={onActivate}
                    onAction={onAction}
                />
                <PaymentConditionCard
                    onDelete={onDelete}
                    onShow={onShowDetails}
                    onToggleActive={onActivate}
                    onAction={onAction}
                />

                <VatRateCard
                    onDelete={onDelete}
                    onShow={onShowDetails}
                    onToggleActive={onActivate}
                    onAction={onAction}
                />

            </div>

            <DeleteSettingModal
                open={deleteModalOpen}
                itemType="la catégorie d'opération"
                itemName={selectedItem?.label}
                onClose={() => setDeleteModalOpen(false)}
                onSubmit={handleDelete}
                deleteLoading={deleteLoading}
            />

            <SettingDetailsModal
                open={detailsModalOpen}
                title="Vente"
                item={selectedItem}
                onClose={() => setDetailsModalOpen(false)}
            />

            <ToggleSettingStatusModal
                open={toggleModalOpen}
                loading={toggleLoading}
                itemName={selectedItem?.label}
                isActive={selectedItem?.isActive ?? false}
                onClose={() => setToggleModalOpen(false)}
                onSubmit={handleToggleStatus}
            />

            <AddSettingModal
                open={openAddModal}
                title={getTitleAddModal()}
                loading={loadingAddModal}
                onClose={() => setOpenAddModal(false)}
                onSubmit={handleCreate}
            />
        </div>
    );
}