import lazyComponent from "@/shared/utils/lazyComponent";


const PartnerDetails = lazyComponent(
  () => import("../partner/partnerDetails"),
  "Chargement de détails client..."
);

export default function ClientDetails(){
    const client = {
    id: "c1",
    identifier: "1234567/A/M/000",
    name: "TechCorp Solutions SA",
    address: "Zone Industrielle Kheireddine",
    city: "La Goulette",
    postalCode: "2015",
    country: "TN",
    email: "contact@techcorp.tn",
    phone: "+216 71 111 222",
    createdAt: "2024-03-15",
  }

  const invoices= [
    {
      id: "i1",
      number: "FAC-2025-001",
      date: "2025-01-10",
      dueDate: "2025-02-10",
      amount: 8400,
      status: "paid",
      type: "Vente",
    },
    {
      id: "i2",
      number: "FAC-2025-009",
      date: "2025-01-25",
      dueDate: "2025-02-24",
      amount: 6400,
      status: "pending",
      type: "Vente",
    },
    {
      id: "i3",
      number: "FAC-2025-014",
      date: "2025-02-03",
      dueDate: "2025-03-05",
      amount: 9200,
      status: "overdue",
      type: "Vente",
    },
  ]

        return(
            <PartnerDetails
                partner={client}
                partnerType="CLIENT"
                invoices={invoices}
            />
        )

}