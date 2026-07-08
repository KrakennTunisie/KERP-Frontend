"use client";


import { OperationCategoryCard } from "./operationCategorySettingsCrad";
import { VatRateCard } from "./vatRateSettingsCard";
import { PaymentConditionCard } from "./paymentSettingsCard";
import { BillingPageHeader } from "../widgets/billingHeader";
import { useState } from "react";
import { appToast } from "@/shared/lib/toast";
import SettingDetailsModal from "./detailsSettingItem";
import ToggleSettingStatusModal from "./activateConfirmationModal";
import AddSettingModal from "./addSettingItem";
import { CreateSetting, SettingPageItem } from "../../models/SettingItem";
import { SettingType, SettingTypeSchema } from "../../types/settingType";
import { OperationCategoryAPI, PaymentConditionAPI, TvaRateAPI } from "../../api/partners-api";
import { getSettingItemId } from "../../lib/settingItemHelpers";


export default function BillingSettingsPage() {
    

    const [detailsModalOpen, setDetailsModalOpen]=useState(false)

    const [toggleModalOpen, setToggleModalOpen] = useState(false);
    const [toggleLoading, setToggleLoading] = useState(false);

    const [selectedItem, setSelectedItem]=useState<SettingPageItem| null>(null);

    const [typeAdd, setTypeAdd]=useState<SettingType| null>(null);

    
    const [openAddModal, setOpenAddModal] = useState(false);
    const [loadingAddModal, setLoadingAddModal] = useState(false);
  

    const onShowDetails = (item: SettingPageItem)=>{
        setDetailsModalOpen(true);
        setSelectedItem(item)
    }

    const onActivate = (item: SettingPageItem)=>{
        setSelectedItem(item);
        setToggleModalOpen(true)
    }

    const onAction = (type: SettingType)=>{
        setTypeAdd(type)
        setOpenAddModal(true)
    }

    const handleToggleStatus = async () => {
        if (!selectedItem) return;

        setToggleLoading(true);

        let idSettingItem = getSettingItemId(selectedItem)

        try {
            // Mock API
            switch(selectedItem.settingType){
                case SettingTypeSchema.enum.TVA_RATE :
                    selectedItem.active ?
                        await TvaRateAPI.deactivateTvaRate(idSettingItem)
                        : await TvaRateAPI.activateTvaRate(idSettingItem) ; 
                        break;
                case SettingTypeSchema.enum.OPERATION_CATEGORY : 
                    selectedItem.active ?
                        await OperationCategoryAPI.deactivateOperationCategory(idSettingItem)
                        : await OperationCategoryAPI.activateOperationCategory(idSettingItem) ; 
                        break;
                case SettingTypeSchema.enum.PAYMENT_CONDITION : 
                    selectedItem.active ?
                        await PaymentConditionAPI.deactivatePaymentCondition(idSettingItem)
                        : await PaymentConditionAPI.activatePaymentCondition(idSettingItem) ; 
                        break;

                default: appToast.error("Type de configuration Non reconnu"); return;
            }

            appToast.success('Mise à jour de statut avec succès')
            setToggleModalOpen(false);
        } finally {
            setToggleLoading(false);
        }
        
    };

        
    const buildFormData = (data: CreateSetting): FormData=>{
        const formData = new FormData()
        formData.append("label", data.label)
        formData.append("description", data.description)

        return formData;
    }

    const handleCreate = async (data: CreateSetting) => {
        setLoadingAddModal(true);
        const formData = buildFormData(data)
        try {
            switch(typeAdd){
                case SettingTypeSchema.enum.TVA_RATE : await TvaRateAPI.createTvaRate(formData) ; break;
                case SettingTypeSchema.enum.OPERATION_CATEGORY : await OperationCategoryAPI.createOperationCategory(formData); break;
                case SettingTypeSchema.enum.PAYMENT_CONDITION : await PaymentConditionAPI.createPaymentCondition(formData) ; break;
                default: appToast.error("Type de configuration Non reconnu")
            }

            console.log(data);

            setOpenAddModal(false);
        } finally {
            setLoadingAddModal(false);
        }
    };


    const getTitleAddModal = ():string=>{
        if(!typeAdd) return "Ajouter configuration";
        switch(typeAdd){
            case SettingTypeSchema.enum.TVA_RATE : return "Ajouter un taux TVA";
            case SettingTypeSchema.enum.OPERATION_CATEGORY: return "Ajouter une catégorie d'opération";
            case SettingTypeSchema.enum.PAYMENT_CONDITION : return "Ajouter une condition de paiement";
            default: return "Ajouter configuration"
        }
    }

    return (
        <div className="flex flex-col gap-8 p-6">

        {/* Header */}
        <BillingPageHeader
                title="Paramètres de facturation"
                description="Configurez les données de référence utilisées dans l'ensemble du module de facturation."
            />
        

        {/* Management Cards */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            <OperationCategoryCard
                onShow={onShowDetails}
                onToggleActive={onActivate}
                onAction={onAction}
            />
            <PaymentConditionCard 
                onShow={onShowDetails}
                onToggleActive={onActivate}
                onAction={onAction}
            />

            <VatRateCard 
                onShow={onShowDetails}
                onToggleActive={onActivate}
                onAction={onAction}
            />

        </div>

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
            isActive={selectedItem?.active ?? false}
            onClose={() => setToggleModalOpen(false)}
            onSubmit={handleToggleStatus}
        />

        {typeAdd && <AddSettingModal
                open={openAddModal}
                title={getTitleAddModal()}
                loading={loadingAddModal}
                onClose={() => setOpenAddModal(false)}
                onSubmit={handleCreate} 
                settingType={typeAdd}       
        />}
        </div>
    );
}