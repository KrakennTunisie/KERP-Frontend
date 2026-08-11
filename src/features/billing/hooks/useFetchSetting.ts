import { useEffect, useState } from "react"
import { OperationCategoryPageItem } from "../models/operationCategory"
import { PaymentConditionPageItem } from "../models/paymentCondition"
import { TVARatePageItem } from "../models/TVArate"
import { OperationCategoryAPI, PaymentConditionAPI, TvaRateAPI } from "../api/partners-api"
import { appToast } from "@/shared/lib/toast"
import { getApiErrorMessage } from "@/shared/api/handle-api-error"


export function useFetchSettings(){

      
      const [operationCategories, setOperationCategories]=useState<OperationCategoryPageItem[]|[]>([])
      const [paymentConditions, setPaymentConditions]=useState<PaymentConditionPageItem[]|[]>([])
      const [vatRates, setVatRates]=useState<TVARatePageItem[]|[]>([])
    
        const fetchPaymentConditions = async ()=>{
            try {
                const response = await PaymentConditionAPI.getAllActivePaymentConditions()
                setPaymentConditions(response)
            } catch (error) {
                appToast.error("erreur de fetch", getApiErrorMessage(error))
            }
        }
    
        const fetchCategories = async ()=>{
                try {
                    const response = await OperationCategoryAPI.getAllActiveOperationCategories()
                    setOperationCategories(response)
                } catch (error) {
                    appToast.error("erreur de fetch", getApiErrorMessage(error))
                }
            }
    
        const fetchTvaRates = async ()=>{
                    try {
                        const response = await TvaRateAPI.getAllActiveTvaRates()
                        setVatRates(response)
                    } catch (error) {
                        appToast.error("erreur de fetch", getApiErrorMessage(error))
                    }
            }
      
            useEffect(() => {
                const loadSettings = async () => {
                    await Promise.all([
                    fetchCategories(),
                    fetchPaymentConditions(),
                    fetchTvaRates(),
                    ]);
                };

                loadSettings();
            }, []);
    
/*       useEffect(() => {
        fetchCategories();
        fetchPaymentConditions();
        fetchTvaRates();
      }, []);    */

      return{
        vatRates,
        operationCategories,
        paymentConditions,
        fetchPaymentConditions, fetchCategories, fetchTvaRates
      }
}