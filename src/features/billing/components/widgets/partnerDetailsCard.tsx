import AddressBox from "@/shared/components/ui/adresseBox";
import DocumentItem from "@/shared/components/ui/documentItem";
import IconButton from "@/shared/components/ui/iconButton";
import InfoField from "@/shared/components/ui/infoField";
import InfoGrid from "@/shared/components/ui/infoGrid";
import SectionCard from "@/shared/components/ui/sectionCard";
import { Separator } from "@/shared/components/ui/separator";

import { UserPen } from "lucide-react";
import { ClientPartnerDetails } from "../../models/partner";
import { partnerTypeSchema } from "../../types/partnerType";
import { PaymentConditionLabels } from "../../types/paymentCondition";
import Link from "next/link";

type PartnerDetailsCardProps = {
  partner: ClientPartnerDetails;
  onOpenDocument: (document: any) => void;
  onAction: ()=>void
};

export default function PartnerDetailsCard({
  partner,
  onOpenDocument,
  onAction,
}: PartnerDetailsCardProps) {
  return (
    <SectionCard
      title={partner.partnerType == partnerTypeSchema.enum.CLIENT ? "Détails du client" : "Détails du fournisseur"  }
      description="Informations complètes"
      action={  
            <IconButton
              icon={UserPen}
              title="Modifier"
              variant="blue"
              onClick={()=>onAction()}
            />
      }
      contentClassName="space-y-4 max-h-[350px] overflow-y-auto pr-2"
    >
      <InfoGrid>
        <InfoField label="Matricule Fiscal" value={partner.taxRegistrationNumber} />
        <InfoField label="IBAN" value={partner.iban} breakWords />
      </InfoGrid>

      <InfoGrid>
        <InfoField label="Devise" value={partner.currency} />
        <InfoField
          label="Conditions de paiement"
          value={PaymentConditionLabels[partner.paymentCondition] || "-"}
        />
      </InfoGrid>

      <InfoGrid>
        <InfoField label="Téléphone professionnel" value={partner.professionnalPhoneNumber} />
        <InfoField label="Téléphone personnel" value={partner.personnelPhoneNumber} />
      </InfoGrid>
      <InfoGrid>
        <InfoField label="Pourcentage du Tax" value={partner.taxRate + "%"} />

      </InfoGrid>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AddressBox
          title="Adresse de facturation"
          street1={partner.billingAddress.street1}
          street2={partner.billingAddress.street2}
          zip={partner.billingAddress.zipCode}
          city={partner.billingAddress.city}
          state={partner.billingAddress.state}
          country={partner.billingAddress.region}
          type={partner.billingAddress.addressType}
        />
        <AddressBox
          title="Adresse de livraison"
          street1={partner.shippingAddress.street1}
          street2={partner.shippingAddress.street2}
          zip={partner.shippingAddress.zipCode}
          city={partner.shippingAddress.city}
          state={partner.shippingAddress.state}
          country={partner.shippingAddress.region}
          type={partner.shippingAddress.addressType}
        />
      </div>

      <Separator />

      <div>
        <DocumentItem
          label="RNE"
          documents={partner.rne}
          onOpen={onOpenDocument}
        />

        <DocumentItem
          label="Contrat"
          documents={partner.contract}
          onOpen={onOpenDocument}

        />

        { partner.patente && <DocumentItem
          label="Patente"
          documents={[partner.patente]}
          onOpen={onOpenDocument}
          
        />}
      </div>
    </SectionCard>
  );
}