import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/components/ui/collapsible';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Badge } from '@/shared/components/ui/badge';
import React from 'react';
import { partnerTypeSchema } from '../../types/partnerType';


type PartnerCollapsibleSectionProps<T> = {
  title: string;
  addLabel: string;
  partnerType?: string;
  transactionType?: string;
  count: number;
  open: boolean;
  onToggle: () => void;
  items: T[];
  getKey: (item: T) => string;
  onAdd?: () => void;
  renderItem: (item: T) => React.ReactNode;
};

export default function PartnerCollapsibleSection<T>({
  title,
  addLabel,
  partnerType,
  transactionType,
  count,
  open,
  onToggle,
  items,
  getKey,
  onAdd,
  renderItem,
}: PartnerCollapsibleSectionProps<T>) {
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
                  (transactionType == "Facture" || transactionType == "Avoir") && (
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
                  {count}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 px-4 pb-4">
            <div className="max-h-[240px] overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {items.length > 0 ? (
                items.map((item) => (
                  <React.Fragment key={getKey(item)}>
                    {renderItem(item)}
                  </React.Fragment>
                ))
              ) : (
                <div className="p-4 text-center text-xs font-semibold text-slate-400">
                  Aucun élément trouvé
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}