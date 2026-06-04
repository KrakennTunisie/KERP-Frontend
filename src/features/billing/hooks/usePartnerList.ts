import { useEffect, useMemo, useState } from "react";
import { ClientPartnerItem, Partner, PartnerAllDetails, SupplierPartnerItem } from "../models/partner";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { partnersApi } from "../api/partners-api";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { appToast } from "@/shared/lib/toast";
import { set } from "react-hook-form";
import { useRouter } from "next/navigation";
import { partnerTypeSchema } from "../types/partnerType";
export type partnerListProps = {
    partnerType: string
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

    const updatePartnerStatus = async (partner: PartnerAllDetails, status: boolean) => {
        try {
            setLoading(true);
            if (partner.partnerType == partnerTypeSchema.enum.CLIENT) {

                await partnersApi.updateStatus(partner.idPartner, status);

                if (status) {
                    appToast.success("Le client est activé !");

                } else {
                    appToast.success("Le client est désactivé !");

                }
            } else {
                await partnersApi.updateSupplierStatus(partner.idPartner, status);

                if (status) {
                    appToast.success("Le fournisseur est activé !");

                } else {
                    appToast.success("Le fournisseur est désactivé !");

                }

            }
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
    return {
        fetchPartner, debouncedSearchQuery, filterCity, currentPage, updatePartnerStatus, cities, searchQuery, setCurrentPage, setDeleteConfirmId, setSearchQuery
        , setTotalElements, setTotalPages, setFilterCity, deleteConfirmId, totalElements, totalPages, loading, clients, suppliers
    }
};
