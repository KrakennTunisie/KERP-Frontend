
import AddPartnerPage from "@/features/billing/components/partner/addPartner";
import { partnerProps } from "@/features/billing/hooks/useCreatePartner";


export default async function EditPartner({ params }: partnerProps) {
      const { clientId} = await params
  return <AddPartnerPage type={"CLIENT"} mode ="edit" clientId={clientId} />
}