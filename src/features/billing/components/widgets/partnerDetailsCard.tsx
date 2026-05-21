import AddressBox from "@/shared/components/ui/adresseBox";
import DocumentItem from "@/shared/components/ui/documentItem";
import IconButton from "@/shared/components/ui/iconButton";
import InfoField from "@/shared/components/ui/infoField";
import InfoGrid from "@/shared/components/ui/infoGrid";
import SectionCard from "@/shared/components/ui/sectionCard";
import { Separator } from "@/shared/components/ui/separator";
import { UserPen } from "lucide-react";

type PartnerDetailsCardProps = {
  partner: any;
  mockPartner: any;
  onEdit: () => void;
  onOpenDocument: (document: any) => void;
};

export default function PartnerDetailsCard({
  partner,
  mockPartner,
  onEdit,
  onOpenDocument,
}: PartnerDetailsCardProps) {
  return (
    <SectionCard
      title="Détails du client"
      description="Informations complètes"
      action={
        <IconButton
          icon={UserPen}
          title="Modifier"
          onClick={onEdit}
          variant="default"
        />
      }
      contentClassName="space-y-4 max-h-[350px] overflow-y-auto pr-2"
    >
      <InfoGrid>
        <InfoField label="Matricule Fiscal" value={mockPartner.taxId} />
        <InfoField label="IBAN" value={partner.iban} breakWords />
      </InfoGrid>

      <InfoGrid>
        <InfoField label="Devise" value={mockPartner.currency} />
        <InfoField
          label="Conditions de paiement"
          value={mockPartner.paymentTerms || "Net 30 jours"}
        />
      </InfoGrid>

      <InfoGrid>
        <InfoField label="Téléphone mobile" value={partner.phoneNumber} />
        <InfoField label="Client depuis" value="-" />
      </InfoGrid>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AddressBox
          title="Adresse de facturation"
          street1={mockPartner.billingStreet1}
          street2={mockPartner.billingStreet2}
          zip={mockPartner.billingZip}
          city={mockPartner.billingCity}
          state={mockPartner.billingState}
          country={mockPartner.billingCountry}
        />

        <AddressBox
          title="Adresse de livraison"
          street1={mockPartner.shippingStreet1}
          street2={mockPartner.shippingStreet2}
          zip={mockPartner.shippingZip}
          city={mockPartner.shippingCity}
          state={mockPartner.shippingState}
          country={mockPartner.shippingCountry}
        />
      </div>

      <Separator />

      <div>
        <DocumentItem
          label="RNE"
          document={partner.rne ?? null}
          onOpen={onOpenDocument}
        />

        <DocumentItem
          label="Contrat"
          document={partner.contract ?? null}
          onOpen={onOpenDocument}
        />

        <DocumentItem
          label="Patente"
          document={partner.patente ?? null}
          onOpen={onOpenDocument}
        />
      </div>
    </SectionCard>
  );
}