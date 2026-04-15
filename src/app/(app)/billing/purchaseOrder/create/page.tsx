import CreatePurchaseOrder from "@/features/billing/components/purchaseOrder/createPurchaseOrder";

export default function Loading() {
    return (
        <div>
            <CreatePurchaseOrder mode="create"/>
        </div>
    );
}