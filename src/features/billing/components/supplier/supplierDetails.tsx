import PartnerDetails from "../partner/partnerDetails";

export default function SupplierDetails(){
        const supplier = {
    id: "s1",
    identifier: "7778889/E/N/001",
    name: "Office Supply Pro SA",
    address: "Avenue de la République",
    city: "Tunis",
    postalCode: "1002",
    country: "TN",
    email: "ventes@officesupply.tn",
    phone: "+216 71 333 444",
    createdAt: "2024-01-10",
    iban:"123456789",
    rne: {
        idDocument : "1",
        fileName: "RNE_Client.pdf",
        storageURL: "Tableau.pdf",
        mimeType: "application/pdf",
        hash:""
    },
    contract: {
        idDocument : "2",
        fileName: "Contrat_Client.docx",
        storageURL: "Elfatoora API.docx",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        hash:""
    },
    patente: {
        idDocument : "3",
        fileName: "Patente_Client.jpg",
        storageURL: "image.jpg",
        mimeType: "image/jpeg",
        hash:""
    },
  }

  const invoices= [
    {
      id: "i4",
      number: "FAC-2025-004",
      date: "2025-01-20",
      dueDate: "2025-02-19",
      amount: 3500,
      status: "paid",
      type: "Achat",
    },
    {
      id: "i5",
      number: "FAC-2025-018",
      date: "2025-02-05",
      dueDate: "2025-03-07",
      amount: 4200,
      status: "pending",
      type: "Achat",
    },
    {
      id: "i6",
      number: "FAC-2025-025",
      date: "2025-02-12",
      dueDate: "2025-03-14",
      amount: 5800,
      status: "pending",
      type: "Achat",
    },
  ];

        return(
            <PartnerDetails
                partner={supplier}
                partnerType="SUPPLIER"
                invoices={invoices}
            />
        )

}