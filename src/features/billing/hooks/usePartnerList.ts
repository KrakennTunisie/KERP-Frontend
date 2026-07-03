import { useEffect, useMemo, useState } from "react";
import { ClientPartnerItem, Partner, PartnerAllDetails, PartnerItem, SupplierPartnerItem } from "../models/partner";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { partnersApi } from "../api/partners-api";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";
import { set } from "react-hook-form";
import { useRouter } from "next/navigation";
import { partnerTypeSchema } from "../types/partnerType";
import { PartnerDocumentType } from "../types/documentType";
export type partnerListProps = {
    partnerType: string,
    
}

export default function usePartnerList({ partnerType }: partnerListProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCity, setFilterCity] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string>('');

    const [clients, setClients] = useState<ClientPartnerItem[]>([]);
    const [suppliers, setSuppliers] = useState<SupplierPartnerItem[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [addDocumentType, setAddDocumentType] = useState<PartnerDocumentType>("CONTRACT");
    const [openAddDocument, setOpenAddDocument] = useState(false);
    const [openEmail,setOpenEmail]=useState(false);
    const [addDocumentLoading, setAddDocumentLoading] = useState(false);
    const [sendDocumentOpen, setSendDocumentOpen] = useState(false)
    const debouncedSearchQuery = useDebounce(searchQuery, 400);
    const router = useRouter();

    const partners = clients.length > 0 ? clients : suppliers;

    const cities = useMemo(
        () =>
            Array.from(
                new Set(
                    partners
                        .map((p) => p.billingAddress?.region)
                        .filter(Boolean)
                )
            ),
        [partners]
    );

    const fetchPartner = async (partnerType: string) => {
        try {
            setLoading(true);
            const keyword =
                debouncedSearchQuery.trim().length >= 3
                    ? debouncedSearchQuery.trim()
                    : undefined;
            if (partnerType == partnerTypeSchema.enum.CLIENT) {
                const response = await partnersApi.getClients({
                    keyword: keyword,
                    filter: filterCity !== "all" ? filterCity : undefined,
                    page: currentPage - 1,
                });
                setClients(response.content);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
                console.log(clients)
            } else {
                const response = await partnersApi.getSuppliers({
                    keyword: keyword,
                    filter: filterCity !== "all" ? filterCity : undefined,
                    page: currentPage - 1,
                });
                setSuppliers(response.content);
                setTotalPages(response.totalPages);
                setTotalElements(response.totalElements);
                 
            }
           
        } catch (error) {
            appToast.error("Erreur de fetch partenaires: ", getApiErrorMessage(error))
        } finally {
            setLoading(false);
        }
    };

    const updatePartnerStatus = async (partnerId: string, partnerType : string, status: boolean) => {
        try {
            setLoading(true);
            if (partnerType == partnerTypeSchema.enum.CLIENT) {

                await partnersApi.updateStatus(partnerId, status);

                if (status) {
                    appToast.success("Le client est activé !");

                } else {
                    appToast.success("Le client est désactivé !");

                }
            } else {
                await partnersApi.updateSupplierStatus(partnerId, status);

                if (status) {
                    appToast.success("Le fournisseur est activé !");

                } else {
                    appToast.success("Le fournisseur est désactivé !");

                }

            }

        fetchPartner(partnerType);
            
        } catch (error) {
            appToast.error(
                "Erreur dans la modification du statut : " + getApiErrorMessage(error)
            );
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchQuery, filterCity]);

    useEffect(() => {

        fetchPartner(partnerType);
    }, [debouncedSearchQuery, filterCity, currentPage]);

    
    const onAddDocument= ( type: PartnerDocumentType)=>{
            setAddDocumentType(type)
            setOpenAddDocument(true)
    }

    const addDocument = async (file: File, documentType: PartnerDocumentType, partner : ClientPartnerItem | SupplierPartnerItem) => {
    try {
      setAddDocumentLoading(true)

      const formData = new FormData();
      formData.append("document", file)

      partner.partnerType === "CLIENT" ?

        await partnersApi.uploadClientDocument(partner.idPartner, documentType, formData)

        : await partnersApi.uploadSupplierDocument(partner.idPartner, documentType, formData)

      appToast.success("Document ajouté avec succès", `Un nouvelle document ${documentType} est ajouté avec succèès.`)
     // onRefresh();

    } catch (error) {
      appToast.error("Erreur", getApiErrorMessage(error))

    } finally {
      setAddDocumentLoading(false)
    }
  }
    
    
    return {
        fetchPartner, debouncedSearchQuery, filterCity, currentPage, updatePartnerStatus, cities, searchQuery, setCurrentPage, setDeleteConfirmId, setSearchQuery, addDocumentType,openAddDocument,addDocument,setOpenAddDocument,
         setTotalElements, setTotalPages, setFilterCity, deleteConfirmId, totalElements, totalPages, loading, clients, suppliers, onAddDocument,setOpenEmail,openEmail,addDocumentLoading,setAddDocumentLoading,sendDocumentOpen,setSendDocumentOpen
    }
};
