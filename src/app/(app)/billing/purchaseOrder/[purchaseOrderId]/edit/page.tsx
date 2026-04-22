import CreatePurchaseOrder from "@/features/billing/components/purchaseOrder/createPurchaseOrder";
import { PropsPurchaseOrder, PurchaseOrderFormClientProps } from "@/features/billing/hooks/useCreateEditPurchaseOrder";

export default async function Page({params}: PropsPurchaseOrder) {
     const { purchaseOrderId } = await params
    return (
        <div>
            <CreatePurchaseOrder mode="edit" purchaseOrderId={purchaseOrderId} />
        </div>
    );
}