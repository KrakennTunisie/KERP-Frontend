import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { PdfDocumentData, PdfParty } from "./types";
import { calculateLineHT, calculatePdfTotals, formatMoney, formatNumber, formatPdfDate, formatPdfDateTime, getAccentColor, getBuyerLabel, getDocumentNumberPrefix, getDocumentSoftColor, getDocumentTitle, getMainTotalLabel, getPaymentLabel } from "./utils";
import { OperationCategoryLabels } from "@/features/billing/types/operationCategory";
import { getDiscountLabel } from "@/features/billing/lib/invoiceItemHelpers";
import { CurrencyType } from "@/features/billing/types/currency";

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: "#07142E",
    backgroundColor: "#F8FAFC",
  },

  sheet: {
    position: "relative",
    minHeight: "100%",
    padding: 24,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    border: "1 solid #E5EAF3",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 22,
    borderBottom: "1 solid #E7ECF5",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "58%",
  },

  logoBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#07142E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  logoImage: {
    width: 44,
    height: 44,
    objectFit: "contain",
  },

  logoFallback: {
    fontSize: 21,
    color: "#FFFFFF",
    fontWeight: 700,
  },

  brandName: {
    fontSize: 18,
    fontWeight: 700,
    color: "#07142E",
    lineHeight: 1.1,
  },

  brandSubtitle: {
    marginTop: 6,
    fontSize: 8.5,
    fontWeight: 700,
    letterSpacing: 2.2,
    color: "#8A98B6",
    textTransform: "uppercase",
  },

  titleZone: {
    width: "38%",
    alignItems: "flex-end",
  },

  watermark: {
    position: "absolute",
    top: 19,
    right: 4,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 9,
    border: "2 solid #E8DFFD",
    opacity: 0.5,
    transform: "rotate(-14deg)",
  },

  watermarkText: {
    fontSize: 29,
    fontWeight: 700,
    letterSpacing: 1.5,
    color: "#D7CCF7",
  },

  documentTitle: {
    fontSize: 27,
    fontWeight: 700,
    color: "#07142E",
    lineHeight: 1,
  },

  numberBadge: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    border: "1 solid #A9CBFF",
  },

  numberText: {
    fontSize: 10.5,
    fontWeight: 700,
  },

  partiesSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },

  partyBlock: {
    width: "48%",
  },

  sectionLabel: {
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 1.1,
    color: "#8795B4",
    textTransform: "uppercase",
    marginBottom: 10,
  },

  partyName: {
    fontSize: 10.5,
    fontWeight: 700,
    color: "#07142E",
    lineHeight: 1.45,
  },

  partyText: {
    fontSize: 9.5,
    color: "#07142E",
    lineHeight: 1.42,
  },

  partyMuted: {
    fontSize: 9.5,
    color: "#8795B4",
    lineHeight: 1.42,
    fontStyle: "italic",
  },

  taxId: {
    marginTop: 6,
    fontSize: 10.5,
    fontWeight: 700,
    color: "#07142E",
  },

  contactRow: {
    flexDirection: "row",
    marginTop: 12,
  },

  contactText: {
    fontSize: 8.5,
    color: "#8A98B6",
    marginRight: 18,
  },

  infoBar: {
    flexDirection: "row",
    marginTop: 24,
    border: "1 solid #E7ECF5",
    borderRadius: 13,
    overflow: "hidden",
  },

  infoCell: {
    width: "25%",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRight: "1 solid #E7ECF5",
  },

  infoCellLast: {
    width: "25%",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  infoLabel: {
    fontSize: 7.8,
    color: "#8795B4",
    fontWeight: 700,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    marginBottom: 6,
  },

  infoValue: {
    fontSize: 10.5,
    color: "#07142E",
    fontWeight: 700,
  },

  table: {
    marginTop: 26,
  },

  tableHeader: {
    flexDirection: "row",
    paddingBottom: 10,
    borderBottom: "1.2 solid #07142E",
  },

  thDescription: {
    width: "62%",
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 0.9,
    color: "#41516F",
    textTransform: "uppercase",
  },

  thQty: {
    width: "12%",
    textAlign: "right",
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 0.9,
    color: "#41516F",
    textTransform: "uppercase",
  },

  thPrice: {
    width: "13%",
    textAlign: "right",
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 0.9,
    color: "#41516F",
    textTransform: "uppercase",
  },

  thTotal: {
    width: "13%",
    textAlign: "right",
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 0.9,
    color: "#41516F",
    textTransform: "uppercase",
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottom: "1 solid #EEF2F7",
  },

  tdDescription: {
    width: "62%",
    paddingRight: 10,
  },

  itemTitle: {
    fontSize: 10.2,
    color: "#07142E",
    fontWeight: 700,
    marginBottom: 6,
  },

  itemMeta: {
    fontSize: 8.8,
    color: "#8795B4",
    lineHeight: 1.5,
  },

  tdQty: {
    width: "12%",
    textAlign: "right",
    fontSize: 10.5,
    color: "#1E3358",
  },

  tdPrice: {
    width: "13%",
    textAlign: "right",
    fontSize: 10.5,
    color: "#1E3358",
  },

  tdTotal: {
    width: "13%",
    textAlign: "right",
    fontSize: 10.5,
    color: "#07142E",
    fontWeight: 700,
  },

  bottomArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
  },

  signatureZone: {
    width: "62%",
  },

  signatureCard: {
    width: "100%",
    height: 112,
    borderRadius: 13,
    border: "1 solid #E7ECF5",
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },

  signatureLabel: {
    position: "absolute",
    top: 18,
    fontSize: 8,
    fontWeight: 700,
    letterSpacing: 1.2,
    color: "#8795B4",
    textTransform: "uppercase",
  },

  signatureStamp: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 9,
    border: "1.5 solid #BBD7FF",
    transform: "rotate(-4deg)",
  },

  signatureText: {
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: 1,
  },

  certifiedText: {
    marginTop: 10,
    fontSize: 8.8,
    color: "#8795B4",
    lineHeight: 1.5,
  },

  totalsZone: {
    width: "34%",
    paddingTop: 86,
  },

  totalLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  totalLabel: {
    fontSize: 10,
    color: "#52617D",
  },

  totalValue: {
    fontSize: 10,
    color: "#07142E",
    fontWeight: 700,
  },

  totalSeparator: {
    height: 1,
    backgroundColor: "#07142E",
    marginVertical: 6,
  },

  grandTotalLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 10,
  },

  grandTotalLabel: {
    fontSize: 11,
    color: "#07142E",
    fontWeight: 700,
  },

  grandTotalValue: {
    fontSize: 22,
    color: "#1E3358",
    fontWeight: 700,
  },

  grandTotalCurrency: {
    fontSize: 12,
    color: "#1E3358",
    fontWeight: 700,
  },

  notesBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    border: "1 solid #E7ECF5",
  },

  notesText: {
    fontSize: 8.8,
    color: "#64748B",
    lineHeight: 1.45,
  },

  footer: {
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#A0ABC1",
    fontSize: 7.5,
  },

 paymentDetailsBox: {
  marginTop: 18,
  borderRadius: 10,
  border: "1 solid #E7ECF5",
  overflow: "hidden",
},

paymentDetailsHeader: {
  paddingVertical: 7,
  paddingHorizontal: 10,
  borderBottom: "1 solid #07142E",
},

paymentDetailsHeaderText: {
  fontSize: 7,
  fontWeight: 700,
  letterSpacing: 0.8,
  color: "#41516F",
  textTransform: "uppercase",
},

paymentDetailsRow: {
  flexDirection: "row",
  paddingVertical: 10,
  paddingHorizontal: 10,
  borderBottom: "1 solid #EEF2F7",
},

paymentDetailsCell: {
  width: "50%",
},

paymentDetailsLabel: {
  fontSize: 7,
  color: "#8795B4",
  fontWeight: 700,
  letterSpacing: 0.9,
  textTransform: "uppercase",
  marginBottom: 4,
},

paymentDetailsValue: {
  fontSize: 9,
  color: "#07142E",
  fontWeight: 700,
},

paymentDetailsMuted: {
  fontSize: 7.8,
  color: "#64748B",
  lineHeight: 1.35,
},

paymentAmountBox: {
  marginTop: 12,
  marginHorizontal: 10,
  marginBottom: 10,
  padding: 12,
  borderRadius: 10,
  backgroundColor: "#F8FAFC",
  border: "1 solid #E7ECF5",
},

paymentAmountLabel: {
  fontSize: 7,
  color: "#8795B4",
  fontWeight: 700,
  letterSpacing: 0.9,
  textTransform: "uppercase",
  marginBottom: 5,
},

paymentAmountValue: {
  fontSize: 21,
  color: "#1E3358",
  fontWeight: 700,
},

paymentAmountCurrency: {
  fontSize: 10,
  color: "#1E3358",
  fontWeight: 700,
},

paymentNoticeBox: {
  marginTop: 10,
  padding: 9,
  borderRadius: 9,
  backgroundColor: "#F8FAFC",
  border: "1 solid #E7ECF5",
},

paymentNoticeText: {
  fontSize: 7.5,
  color: "#64748B",
  lineHeight: 1.35,
},

paymentTotalsZone: {
  width: "36%",
  paddingTop: 10,
},

paymentTotalCard: {
  padding: 10,
  borderRadius: 10,
  backgroundColor: "#F8FAFC",
  border: "1 solid #E7ECF5",
},

thDiscount: {
  width: "12%",
  textAlign: "right",
},

thNet: {
  width: "12%",
  textAlign: "right",
},

tdDiscount: {
  width: "12%",
  textAlign: "right",
},

tdNet: {
  width: "12%",
  textAlign: "right",
},
});

type ProfessionalDocumentPdfProps = {
  data: PdfDocumentData;
};

function PartyAddress({ party, emptyLabel }: { party?: PdfParty | null; emptyLabel: string }) {
  if (!party) {
    return <Text style={styles.partyMuted}>{emptyLabel}</Text>;
  }

  const address = party.address;
  const displayName = party.companyName || party.name;

  return (
    <View>
      <Text style={styles.partyName}>{displayName}</Text>
      {party.companyName && party.name !== party.companyName && (
        <Text style={styles.partyText}>{party.name}</Text>
      )}
      {address?.street1 && <Text style={styles.partyText}>{address.street1}</Text>}
      {address?.street2 && <Text style={styles.partyText}>{address.street2}</Text>}
      <Text style={styles.partyText}>
        {[address?.zip, address?.city].filter(Boolean).join(" ")}
        {[address?.zip, address?.city].filter(Boolean).length > 0 && address?.country ? ", " : ""}
        {address?.country || ""}
      </Text>
      {party.taxId && <Text style={styles.taxId}>MF: {party.taxId}</Text>}
    </View>
  );
}

function Header({ data, accent }: { data: PdfDocumentData; accent: string }) {
  const title = getDocumentTitle(data.type);

  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.logoBox}>
          {data.companyLogoUrl ? (
            <Image src={data.companyLogoUrl} style={styles.logoImage} />
          ) : (
            <Text style={styles.logoFallback}>▦</Text>
          )}
        </View>

        <View>
          <Text style={styles.brandName}>{data.seller.companyName || data.seller.name}</Text>
          <Text style={styles.brandSubtitle}>
            {data.seller.subtitle || "SERVICES ET CONSEIL EN INFORMATIQUE"}
          </Text>
        </View>
      </View>

      <View style={styles.titleZone}>
        <View style={styles.watermark}>
          <Text style={styles.watermarkText}>{title}</Text>
        </View>
        <Text style={styles.documentTitle}>{title}</Text>
        <View style={{ ...styles.numberBadge, backgroundColor: getDocumentSoftColor(data.type) }}>
          <Text style={{ ...styles.numberText, color: accent }}>
            {getDocumentNumberPrefix()} {data.number}
          </Text>
        </View>
      </View>
    </View>
  );
}

function Parties({ data }: { data: PdfDocumentData }) {
  return (
    <View style={styles.partiesSection}>
      <View style={styles.partyBlock}>
        <Text style={styles.sectionLabel}>Détails émetteur</Text>
        <PartyAddress party={data.seller} emptyLabel="Aucun émetteur sélectionné" />

        <View style={styles.contactRow}>
          {data.seller.email && <Text style={styles.contactText}>✉ {data.seller.email}</Text>}
          {data.seller.phone && <Text style={styles.contactText}>☎ {data.seller.phone}</Text>}
        </View>
      </View>

      <View style={styles.partyBlock}>
        <Text style={styles.sectionLabel}>{getBuyerLabel(data.type)}</Text>
        <PartyAddress
          party={data.buyer}
          emptyLabel={data.type === "PURCHASE_ORDER" ? "Aucun fournisseur sélectionné" : "Aucun client sélectionné"}
        />
      </View>
    </View>
  );
}

function InfoBar({ data }: { data: PdfDocumentData }) {
  return (
    <View style={styles.infoBar}>
      <View style={styles.infoCell}>
        <Text style={styles.infoLabel}>{"Date d'émission"}</Text>
        <Text style={styles.infoValue}>{formatPdfDate(data.issueDate)}</Text>
      </View>

      <View style={styles.infoCell}>
        <Text style={styles.infoLabel}>{data.type === "PURCHASE_ORDER" ? "Livraison" : "Échéance"}</Text>
        <Text style={styles.infoValue}>
          {formatPdfDate(data.type === "PURCHASE_ORDER" ? data.deliveryDate : data.dueDate)}
        </Text>
      </View>

      <View style={styles.infoCell}>
        <Text style={styles.infoLabel}>Paiement</Text>
        <Text style={styles.infoValue}>{getPaymentLabel(data.payment?.paymentTerms)}</Text>
      </View>

      <View style={styles.infoCellLast}>
        <Text style={styles.infoLabel}>Mode</Text>
        <Text style={styles.infoValue}>{getPaymentLabel(data.payment?.paymentMethod)}</Text>
      </View>
    </View>
  );
}

function ItemsTable({ data }: { data: PdfDocumentData }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={styles.thDescription}>Description des prestations</Text>
        <Text style={styles.thQty}>Qté</Text>
        <Text style={styles.thPrice}>P.U HT</Text>
        <Text style={styles.thTotal}>Total HT</Text>
        <Text style={styles.thDiscount}>Remise</Text>
        <Text style={styles.thNet}>Net HT</Text>
      </View>

      {data.items.length === 0 ? (
        <View style={styles.tableRow}>
          <View style={styles.tdDescription}>
            <Text style={styles.itemTitle}>—</Text>
            <Text style={styles.itemMeta}>TVA appliquée : 0%</Text>
            <Text style={styles.itemMeta}>Catégorie : Prestation de Service</Text>
          </View>
          <Text style={styles.tdQty}>0</Text>
          <Text style={styles.tdPrice}>0.00</Text>
          <Text style={styles.tdTotal}>0</Text>
        </View>
      ) : (
        data.items.map((item, index) => (
          <View key={`${item.description}-${index}`} style={styles.tableRow} wrap={false}>
            <View style={styles.tdDescription}>
              <Text style={styles.itemTitle}>{item.description || "—"}</Text>
              <Text style={styles.itemMeta}>TVA appliquée : {item.vatRate || 0}%</Text>
              <Text style={styles.itemMeta}>Catégorie : {OperationCategoryLabels[item.operationCategory] || "Prestation de Service"}</Text>

            </View>
            <Text style={styles.tdQty}>{item.quantity}</Text>
            <Text style={styles.tdPrice}>{formatNumber(item.unityPriceEXclTax)}</Text>
            <Text style={styles.tdTotal}>{formatNumber(item.itemTotalExclTax)}</Text>

              <Text style={styles.tdDiscount}>
                {getDiscountLabel(item, data.currency as CurrencyType)}
              </Text>

              <Text style={styles.tdNet}>
                {formatNumber(item.netHT)}
              </Text>
          </View>
        ))
      )}
    </View>
  );
}

function Totals({ data }: { data: PdfDocumentData }) {
  const totals = calculatePdfTotals(data.items);

  const netHT = totals.subtotalHT - totals.discountTotal;
  const totalTTC = netHT + totals.taxTotal;

  return (
    <View style={styles.totalsZone}>
      <View style={styles.totalLine}>
        <Text style={styles.totalLabel}>Total HT</Text>
        <Text style={styles.totalValue}>
          {formatMoney(totals.subtotalHT, data.currency)}
        </Text>
      </View>

      <View style={styles.totalLine}>
        <Text style={styles.totalLabel}>Remise totale</Text>
        <Text style={styles.totalValue}>
          -{formatMoney(totals.discountTotal, data.currency)}
        </Text>
      </View>

      <View style={styles.totalLine}>
        <Text style={styles.totalLabel}>Net HT</Text>
        <Text style={styles.totalValue}>
          {formatMoney(netHT, data.currency)}
        </Text>
      </View>

      <View style={styles.totalLine}>
        <Text style={styles.totalLabel}>Total TVA</Text>
        <Text style={styles.totalValue}>
          {formatMoney(totals.taxTotal, data.currency)}
        </Text>
      </View>

      <View style={styles.totalSeparator} />

      <View style={styles.grandTotalLine}>
        <Text style={styles.grandTotalLabel}>
          {getMainTotalLabel(data.type)}
        </Text>

        <Text style={styles.grandTotalValue}>
          {formatNumber(totalTTC)}{" "}
          <Text style={styles.grandTotalCurrency}>
            {data.currency}
          </Text>
        </Text>
      </View>
    </View>
  );
}

function SignatureAndNotes({ data, accent }: { data: PdfDocumentData; accent: string }) {
  return (
    <View style={styles.signatureZone}>
      <View style={styles.signatureCard}>
        <Text style={styles.signatureLabel}>Signature & cachet</Text>
        <View style={styles.signatureStamp}>
          <Text style={{ ...styles.signatureText, color: accent }}>SIGNÉ ÉLECTRONIQUEMENT</Text>
        </View>
      </View>

      <Text style={styles.certifiedText}>
        Document certifié conforme aux normes TTN de la République Tunisienne. {"\n"}
        Généré le {formatPdfDateTime(data.generatedAt)}
      </Text>

      {(data.notes || data.terms || data.originalInvoiceNumber || data.purchaseOrderNumber) && (
        <View style={styles.notesBox}>
          {data.originalInvoiceNumber && (
            <Text style={styles.notesText}>Facture originale : {data.originalInvoiceNumber}</Text>
          )}
          {data.purchaseOrderNumber && (
            <Text style={styles.notesText}>Bon de commande lié : {data.purchaseOrderNumber}</Text>
          )}
          {data.notes && <Text style={styles.notesText}>{data.notes}</Text>}
          {data.terms && <Text style={styles.notesText}>{data.terms}</Text>}
        </View>
      )}
    </View>
  );
}

function PaymentInfoBar({ data }: { data: PdfDocumentData }) {
  return (
    <View style={styles.infoBar}>
      <View style={styles.infoCell}>
        <Text style={styles.infoLabel}>Date paiement</Text>
        <Text style={styles.infoValue}>
          {formatPdfDate(data.payment?.paymentDate || data.issueDate)}
        </Text>
      </View>

      <View style={styles.infoCell}>
        <Text style={styles.infoLabel}>Facture liée</Text>
        <Text style={styles.infoValue}>
          {data.payment?.invoiceNumber || data.originalInvoiceNumber || "—"}
        </Text>
      </View>

      <View style={styles.infoCell}>
        <Text style={styles.infoLabel}>Mode</Text>
        <Text style={styles.infoValue}>
          {getPaymentLabel(data.payment?.paymentMethod)}
        </Text>
      </View>

      <View style={styles.infoCellLast}>
        <Text style={styles.infoLabel}>Statut</Text>
        <Text style={styles.infoValue}>{data.status || "Payé"}</Text>
      </View>
    </View>
  );
}

function PaymentDetails({ data }: { data: PdfDocumentData }) {
  const paidAmount = data.payment?.paidAmount ?? 0;
  const invoiceNumber =
    data.payment?.invoiceNumber || data.originalInvoiceNumber || "—";

  return (
    <View style={styles.paymentDetailsBox}>
      <View style={styles.paymentDetailsHeader}>
        <Text style={styles.paymentDetailsHeaderText}>
          Détails du paiement
        </Text>
      </View>

      <View style={styles.paymentDetailsRow}>
        <View style={styles.paymentDetailsCell}>
          <Text style={styles.paymentDetailsLabel}>Référence paiement</Text>
          <Text style={styles.paymentDetailsValue}>{data.number}</Text>
        </View>

        <View style={styles.paymentDetailsCell}>
          <Text style={styles.paymentDetailsLabel}>Date paiement</Text>
          <Text style={styles.paymentDetailsValue}>
            {formatPdfDate(data.payment?.paymentDate || data.issueDate)}
          </Text>
        </View>
      </View>

      <View style={styles.paymentDetailsRow}>
        <View style={styles.paymentDetailsCell}>
          <Text style={styles.paymentDetailsLabel}>Facture associée</Text>
          <Text style={styles.paymentDetailsValue}>{invoiceNumber}</Text>
        </View>

        <View style={styles.paymentDetailsCell}>
          <Text style={styles.paymentDetailsLabel}>Méthode de paiement</Text>
          <Text style={styles.paymentDetailsValue}>
            {getPaymentLabel(data.payment?.paymentMethod)}
          </Text>
        </View>
      </View>

      <View style={styles.paymentAmountBox}>
        <Text style={styles.paymentAmountLabel}>Montant reçu</Text>

        <Text style={styles.paymentAmountValue}>
          {formatNumber(paidAmount)}{" "}
          <Text style={styles.paymentAmountCurrency}>{data.currency}</Text>
        </Text>

        <Text style={styles.paymentDetailsMuted}>
          Ce reçu confirme l’enregistrement du paiement relatif à la facture{" "}
          {invoiceNumber}.
        </Text>
      </View>
    </View>
  );
}


function PaymentNotice({ data }: { data: PdfDocumentData }) {
  const invoiceNumber =
    data.payment?.invoiceNumber || data.originalInvoiceNumber || "—";

  return (
    <View style={styles.paymentNoticeBox}>
      <Text style={styles.paymentNoticeText}>
        Ce document est un reçu de paiement. Il atteste que le montant indiqué a
        été enregistré pour la facture {invoiceNumber}. Il ne remplace pas la
        facture originale.
      </Text>
      {data.notes && (
        <Text style={[styles.paymentNoticeText, { marginTop: 6 }]}>
          {data.notes}
        </Text>
      )}
    </View>
  );
}
export function ProfessionalDocumentPdf({ data }: ProfessionalDocumentPdfProps) {
  const accent = getAccentColor(data.type, data.accentColor);

  if (data.type === "PAYMENT") {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.sheet}>
            <Header data={data} accent={accent} />

            <Parties data={data} />

            <PaymentInfoBar data={data} />

            <PaymentDetails data={data} />

            <PaymentNotice data={data} />


            <View style={styles.footer} fixed>
              <Text>{data.seller.companyName || data.seller.name}</Text>
              <Text
                render={({ pageNumber, totalPages }) =>
                  `Page ${pageNumber} / ${totalPages}`
                }
              />
            </View>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sheet}>
          <Header data={data} accent={accent} />

          <Parties data={data} />

          <InfoBar data={data} />

          <ItemsTable data={data} />

          <View style={styles.bottomArea}>
            <SignatureAndNotes data={data} accent={accent} />
            <Totals data={data} />
          </View>

          <View style={styles.footer} fixed>
            <Text>{data.seller.companyName || data.seller.name}</Text>
            <Text
              render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} / ${totalPages}`
              }
            />
          </View>
        </View>
      </Page>
    </Document>
  );
}
