"use client";


import { OperationCategoryCard } from "./operationCategorySettingsCrad";
import { VatRateCard } from "./vatRateSettingsCard";
import { PaymentConditionCard } from "./paymentSettingsCard";
import { BillingPageHeader } from "../widgets/billingHeader";
import SettingDetailsModal from "./detailsSettingItem";
import ToggleSettingStatusModal from "./activateConfirmationModal";
import AddSettingModal from "./addSettingItem";
import UseSetting from "../../hooks/useSettings";
import { formatShowLabel } from "../../lib/settingItemHelpers";


export default function BillingSettingsPage() {
    const {detailsModalOpen, setDetailsModalOpen, toggleModalOpen, setToggleModalOpen, toggleLoading, 
        
        selectedItem,  typeAdd,  openAddModal, loadingAddModal,  onCloseAddModal,

        onShowDetails, onActivate, onAction, handleCreate, handleToggleStatus, getTitleAddModal,

        setRefreshCategories, setRefreshPaymentConditions, setRefreshTvaRates

    } = UseSetting()


    return (
        <div className="flex flex-col bg-white gap-8 p-6">

            {/* Header */}
            <BillingPageHeader
                title="Paramètres de facturation"
                description="Configurez les données de référence utilisées dans l'ensemble du module de facturation."
            />

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                <OperationCategoryCard
                    onShow={onShowDetails}
                    onToggleActive={onActivate}
                    onAction={onAction}
                    onFetchReady={(fn) => setRefreshCategories(() => fn)}
                />
                <PaymentConditionCard 
                    onShow={onShowDetails}
                    onToggleActive={onActivate}
                    onAction={onAction}
                    onFetchReady={(fn) => setRefreshPaymentConditions(() => fn)}
                />

                <VatRateCard 
                    onShow={onShowDetails}
                    onToggleActive={onActivate}
                    onAction={onAction}
                    onFetchReady={(fn) => setRefreshTvaRates(() => fn)}
                />

                <SettingDetailsModal
                        open={detailsModalOpen}
                        title="Vente"
                        item={selectedItem}
                        onClose={() => setDetailsModalOpen(false)}
                    />

                {selectedItem && <ToggleSettingStatusModal
                    open={toggleModalOpen}
                    loading={toggleLoading}
                    itemName={formatShowLabel(selectedItem?.label)}
                    isActive={selectedItem?.active ?? false}
                    onClose={() => setToggleModalOpen(false)}
                    onSubmit={handleToggleStatus}
                />}
            </div>


                {typeAdd && <AddSettingModal
                        open={openAddModal}
                        title={getTitleAddModal()}
                        loading={loadingAddModal}
                        onClose={onCloseAddModal}
                        onSubmit={handleCreate} 
                        settingType={typeAdd}       
                />}
        </div>
    );
}