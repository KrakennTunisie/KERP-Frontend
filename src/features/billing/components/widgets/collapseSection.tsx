import { getApiErrorMessage } from '@/shared/api/handle-api-error';
import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible';
import { appToast } from '@/shared/lib/toast';
import { ChevronDown, ChevronLeft, ChevronRight, Loader2, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { InvoicesAPI, InvoicesCreditNoteAPI, partnersApi, paymentsAPI } from '../../api/partners-api';
import { partnerTypeSchema } from '../../types/partnerType';


type PartnerCollapsibleSectionProps<T> = {
  title: string;
  addLabel: string;
  partnerId: string;
  partnerType: string;
  transactionType?: string;
  count: number;
  open: boolean;
  onToggle: () => void;
  getKey: (item: T) => string;
  onAdd?: () => void;
  renderItem: (item: T) => React.ReactNode;
};

export default function PartnerCollapsibleSection<T>({
  title,
  addLabel,
  partnerId,
  partnerType,
  transactionType,
  count,
  open,
  onToggle,
  getKey,
  onAdd,
  renderItem,
}: PartnerCollapsibleSectionProps<T>) {
  const [fetchedItems, setFetchedItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
  const fetchItems = async () => {
    try {
      setLoading(true);

      switch (transactionType) {
        case "Facture": {

          setLoading(true)
            const response = partnerType==partnerTypeSchema.enum.CLIENT ?
             await InvoicesAPI.getClientsInvoicesByIdPartner(partnerId, {
              page: currentPage - 1,
            })
            :
            await InvoicesAPI.getSupplierInvoicesByIdPartner(partnerId, {
              page: currentPage - 1,
            })
            setFetchedItems(response.content as T[]);
  
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
          break;
        }

        case "Avoir": {
          
            const response = await InvoicesCreditNoteAPI.getInvoiceCreditNoteByIdClient(partnerId,partnerType, {
                    page: currentPage - 1,
                  });

            setFetchedItems(response.content as T[]);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
              break;
        }

        case "Bon de commande": {
          
            const response = await partnersApi.getPurchaseOrderByPartnerId(partnerId, partnerType,{
                    page: currentPage - 1,
                  });
            setFetchedItems(response.content as T[]);
            
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
          break;
        }

        case "Paiement": {
          
            const response = await paymentsAPI.getPaymentsByPartner(partnerId, {
              page: currentPage - 1,
            });
            setFetchedItems(response.content as T[]);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
          break;
        }

        default:
          setFetchedItems([]);
      }

    }catch(error){
      appToast.error("Erreur fetch des factures client: ", getApiErrorMessage(error));
      
    }
    
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchItems();
    }
  }, [open, transactionType, partnerId, currentPage]);
    const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  return (
    <Collapsible open={open} onOpenChange={onToggle}>
      <Card className="border-slate-200 shadow-sm">
        <CollapsibleTrigger className="w-full text-left" asChild>
          <CardHeader className="cursor-pointer hover:bg-slate-50/60 transition-colors rounded-t-xl py-4">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2 text-sm font-black text-slate-800">
                {open ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
                {title}
              </CardTitle>

              <div className="flex items-center gap-2">
                {partnerType == partnerTypeSchema.enum.CLIENT &&
                  (transactionType == "Facture" ) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAdd?.();
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-100 hover:border-blue-200 transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {addLabel}
                    </button>
                  )}
                <Badge variant="secondary" className="font-bold">
                {totalElements}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 px-4 pb-4">
            <div className="max-h-[240px] overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {
              loading ? (
                  <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    <p className="text-sm font-semibold">
                      Chargement des données...
                    </p>
                  </div>
            ) 
                :
                fetchedItems && fetchedItems.length > 0 ? (
                  fetchedItems.map((item) => (
                    <React.Fragment key={getKey(item)}>
                      {renderItem(item)}
                    </React.Fragment>
                  ))
                ) 
                : (
                <div className="p-4 text-center text-xs font-semibold text-slate-400">
                  Aucun élément trouvé
                </div>
              )}
              {totalPages > 0  && totalElements > 0 && (
                <div className="flex flex-col gap-2 border-t border-slate-100 bg-white px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!canGoNext || loading}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, index) => {
                        const page = index + 1;

                        return (
                          <button
                            key={page}
                            type="button"
                            onClick={() => setCurrentPage(page)}
                            disabled={loading}
                            className={`h-7 min-w-7 rounded-md px-2 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                              currentPage === page
                                ? "bg-blue-600 text-white"
                                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!canGoPrevious ||loading}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                </div>

                {totalElements > 0 && (
                  <p className="text-[11px] font-medium text-slate-500">
                    {totalElements} {transactionType}
                    {totalElements > 1 ? "s" : ""}
                  </p>
                )}
              </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}