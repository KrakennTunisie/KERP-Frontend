
import AddPartnerPage from "@/features/billing/components/partner/addPartner";
import { clientProps } from "@/features/billing/hooks/useCreatePartner";


export default async function EditPartner({ params }: clientProps) {
      const { clientId} = await params
  return <AddPartnerPage type={"CLIENT"} mode ="edit" partnerId={clientId} />
}