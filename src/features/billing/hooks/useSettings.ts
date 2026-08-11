import { appToast } from "@/shared/lib/toast";
import { OperationCategoryAPI, PaymentConditionAPI, TvaRateAPI } from "../api/partners-api";
import { SettingType, SettingTypeSchema } from "../types/settingType";
import { CreateSetting, SettingPageItem } from "../models/SettingItem";
import { getSettingItemId } from "../lib/settingItemHelpers";
import { useEffect, useState } from "react";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";


export default function UseSetting() {

    const [detailsModalOpen, setDetailsModalOpen] = useState(false)

    const [toggleModalOpen, setToggleModalOpen] = useState(false);
    const [toggleLoading, setToggleLoading] = useState(false);

    const [selectedItem, setSelectedItem]=useState<SettingPageItem| null>(null);

    const [typeAdd, setTypeAdd]=useState<SettingType| null>(null);

    const [openAddModal, setOpenAddModal] = useState(false);
    const [loadingAddModal, setLoadingAddModal] = useState(false);

    const [refreshCategories, setRefreshCategories] = useState<(() => Promise<void>) | null>(null);

    const [refreshPaymentConditions, setRefreshPaymentConditions] = useState<(() => Promise<void>) | null>(null);

    const [refreshTvaRates, setRefreshTvaRates] = useState<(() => Promise<void>) | null>(null);


    useEffect(() => {
        console.log("refreshCategories =", refreshCategories);
    }, [refreshCategories]);

    const onCloseAddModal = ()=>{
        setOpenAddModal(false);
        setTypeAdd(null)
    }
  

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

        const idSettingItem = getSettingItemId(selectedItem)

        try {
            // Mock API
            switch(selectedItem.settingType){
                case SettingTypeSchema.enum.TVA_RATE :
                    selectedItem.active ?
                        await TvaRateAPI.deactivateTvaRate(idSettingItem)
                        : await TvaRateAPI.activateTvaRate(idSettingItem) ; 
                        await refreshTvaRates?.(); 
                        break;
                case SettingTypeSchema.enum.OPERATION_CATEGORY : 
                    selectedItem.active ?
                        await OperationCategoryAPI.deactivateOperationCategory(idSettingItem)
                        : await OperationCategoryAPI.activateOperationCategory(idSettingItem) ; 
                        await refreshCategories?.(); 
                        break;
                case SettingTypeSchema.enum.PAYMENT_CONDITION : 
                    selectedItem.active ?
                        await PaymentConditionAPI.deactivatePaymentCondition(idSettingItem)
                        : await PaymentConditionAPI.activatePaymentCondition(idSettingItem) ; 
                        await refreshPaymentConditions?.();
                        break;

                default: appToast.error("Type de configuration Non reconnu"); return;
            }

            appToast.success('Mise à jour de statut avec succès')
            setToggleModalOpen(false);
        } finally {
            setToggleLoading(false);
        }
        
    };

    const formatLabel = (data: CreateSetting): string => {
        switch (data.settingType) {
            case SettingTypeSchema.enum.PAYMENT_CONDITION:
                return `NET_${data.label}`;
            case SettingTypeSchema.enum.TVA_RATE:
                return `${data.label}%`;

            default:
            return data.label;
        }
    };
        
    const buildFormData = (data: CreateSetting): FormData=>{
        const formData = new FormData()
        formData.append("label", formatLabel(data))
        formData.append("description", data.description)

        return formData;
    }

    const handleCreate = async (data: CreateSetting) => {
         console.log(data);
        setLoadingAddModal(true);
        const formData = buildFormData(data)
                   

        try {
            switch(typeAdd){
                case SettingTypeSchema.enum.TVA_RATE : 
                        await TvaRateAPI.createTvaRate(formData) ; 
                        await refreshTvaRates?.();  
                        break;
                case SettingTypeSchema.enum.OPERATION_CATEGORY : 
                        await OperationCategoryAPI.createOperationCategory(formData); 
                        await refreshCategories?.(); 
                        break;
                case SettingTypeSchema.enum.PAYMENT_CONDITION : 
                        await PaymentConditionAPI.createPaymentCondition(formData) ; 
                        await refreshPaymentConditions?.(); 
                        break;
                default: appToast.error("Type de configuration Non reconnu")
            }

            appToast.success('Créé avec succèes')

            onCloseAddModal()
            
        }catch(error){

        appToast.error('Erreur création', getApiErrorMessage(error))
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


    return{
        getTitleAddModal, handleCreate, handleToggleStatus, onAction, onActivate, onShowDetails, onCloseAddModal,
            detailsModalOpen, setDetailsModalOpen,
            toggleModalOpen, setToggleModalOpen,
            toggleLoading, setToggleLoading,

            selectedItem, setSelectedItem,

            typeAdd, setTypeAdd,

            openAddModal, setOpenAddModal,
            loadingAddModal, setLoadingAddModal,

            setRefreshCategories,
            setRefreshPaymentConditions,
            setRefreshTvaRates
    }

}