import { Modal } from "@/shared/components/ui/modal";
import { CalendarDays, CheckCircle2, CircleMinus,  FileText, Hash,  Tag } from "lucide-react";
import { formatDateLongWithTime } from "@/shared/utils/formatDate";
import { SettingPageItem } from "../../models/SettingItem";
import { useEffect, useState } from "react";
import { SettingItem } from "./settingCard";
import { getSettingItemId } from "../../lib/settingItemHelpers";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { SettingTypeSchema } from "../../types/settingType";
import { OperationCategoryAPI, PaymentConditionAPI, TvaRateAPI } from "../../api/partners-api";
import PageLoader from "@/shared/components/ui/pageLoader";
import { NotFound } from "@/shared/components/widgets/notFound";

type SettingDetailsModalProps = {
  open: boolean;
  item?: SettingPageItem | null;
  title: string;
  onClose: () => void;
};

export default function SettingDetailsModal({
  open,
  item,
  title,
  onClose,
}: SettingDetailsModalProps) {

    const[fetchedItem, setFetchedItem]=useState<SettingItem>()
    const[loadingFetch, setLoadingFetch]=useState(false)

    const fetchSettingItem = async ()=>{

        try {
            console.log("fetchiiing")

            setLoadingFetch(true)

            if(item && getSettingItemId(item)){
                let idSettingItem = getSettingItemId(item)
                switch(item.settingType){
                                case SettingTypeSchema.enum.TVA_RATE : 
                                    const response = await TvaRateAPI.getTvaRate(idSettingItem) ; 
                                    setFetchedItem(response)
                                    break;
                                case SettingTypeSchema.enum.OPERATION_CATEGORY : 
                                    const res = await OperationCategoryAPI.getOperationCategory(idSettingItem) ; 
                                    setFetchedItem(res)
                                    break;
                                case SettingTypeSchema.enum.PAYMENT_CONDITION : 
                                    const result = await PaymentConditionAPI.getPaymentCondition(idSettingItem) ; 
                                    setFetchedItem(result)
                                    break;
                                default: appToast.error("Type de configuration Non reconnu")
                }
            }
            

        } catch (error) {
           appToast.error("Erreur fetch de setting", getApiErrorMessage(error))

        } finally{
            setLoadingFetch(false)
        }
    }

    useEffect(()=>{
        if(open)
        fetchSettingItem()
    },[open])


    if( !fetchedItem) return null;

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
    >
    {loadingFetch ? 
        <PageLoader label="chargement de paramètre..."/>
    :
    <div className="space-y-5">

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {fetchedItem.label}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {fetchedItem.description}
          </p>
        </div>

        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">

          <DetailRow
            icon={<Hash className="h-4 w-4" />}
            label="Code"
            value={fetchedItem.code}
          />

          <DetailRow
            icon={<Tag className="h-4 w-4" />}
            label="Libellé"
            value={fetchedItem.label}
          />

          <DetailRow
            icon={<FileText className="h-4 w-4" />}
            label="Description"
            value={fetchedItem.description}
          />

          <DetailRow
            icon={
              fetchedItem.active ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <CircleMinus className="h-4 w-4 text-rose-600" />
              )
            }
            label="Statut"
            value={fetchedItem.active ? "Actif" : "Inactif"}
          />

          <DetailRow
            icon={<CalendarDays className="h-4 w-4" />}
            label="Créé le"
            value={formatDateLongWithTime(fetchedItem.createdAt)}
          />

          <DetailRow
            icon={<CalendarDays className="h-4 w-4" />}
            label="Dernière modification"
            value={formatDateLongWithTime(fetchedItem.updatedAt)}
          />

        </div>

      </div>}
    </Modal>
  );
}

type DetailRowProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <span className="text-sm">{label}</span>
      </div>

      <span className="max-w-[260px] text-right text-sm font-medium text-slate-900">
        {value}
      </span>
    </div>
  );
}