"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const InvoiceReceiptPdf = ({ }) => {

  const Footer = () => (
    <View style={styles.footerWrapper} fixed>
      <View style={{ alignItems: 'center' }}>
        <Text
          style={styles.footerTopText}
          render={({ pageNumber,totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        />
      </View>
    </View>
  );

  const Header = () => (
    <View style={styles.headerContainer} fixed>
      <Image
        src="/company-light.png"
        style={styles.logo}
      />
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerText}>My Home</Text>
        <Text style={styles.headerText}>9 Broadmeadows Cres</Text>
        <Text style={styles.headerText}>Bohle Plains, 4817</Text>
        <Text style={styles.headerText}>ABN : 82 156 644 478</Text>
      </View>
    </View>
  );

  const PageLayout = ({ children }: { children: React.ReactNode }) => (
    <Page size="A4" style={styles.page}>
      <Header />
      {/* <Watermark /> */}
      <View style={styles.body}>{children}</View>
      <Footer />
    </Page>
  );
  return (
    <Document>
      <PageLayout>
        {/* Right Section */}
        <View style={{ flexDirection: 'row', justifyContent: "flex-end" }}>
          <View style={{ marginVertical: 20 }}>
            <View style={[Page1styles.row, styles.headerText, { justifyContent: 'flex-end' }]}>
              <Text>Receipt No : </Text>
              <Text> MYH006644-R1 </Text>
            </View>
            <View style={[Page1styles.row, styles.headerText, { justifyContent: 'flex-end' }]}>
              <Text>Job No : </Text>
              <Text>MYH006644</Text>
            </View>
          </View>
        </View>
        {/* Customer details */}
        <View style={{ marginLeft: 20 }}>
          <View style={[styles.secondaryText, { marginVertical: 30 }]}>
            <View><Text style={styles.headerText}>Customer Details</Text></View>
            <View style={Page1styles.customerRow}>
              <Text style={Page1styles.customerLabel}>Name</Text>
              <Text>: John Wick </Text>
            </View>
            <View style={Page1styles.customerRow}>
              <Text style={Page1styles.customerLabel}>Postal Address</Text>
              <Text>: asgf,sydny,Victoria,30003</Text>
            </View>
            <View style={Page1styles.customerRow}>
              <Text style={Page1styles.customerLabel}>Mobile</Text>
              <Text>: 0123456789</Text>
            </View>
            <View style={Page1styles.customerRow}>
              <Text style={Page1styles.customerLabel}>Email</Text>
              <Text>: johnwick@gmail.com</Text>
            </View>
          </View>
          <View>
            <Text style={styles.secondaryText}>This is acknowledge your payment receipt for the Receipt No MYH006644-R1</Text>
          </View>
          {/* below table info */}
          <View style={{ marginLeft: 20, marginVertical: 30 }}>
            <View>
              <View style={Page1styles.row}>
                <Text style={Page1styles.label}>Payment Date</Text>
                <Text style={Page1styles.value}>: 01-10-2025</Text>
              </View>
              <View style={Page1styles.row}>
                <Text style={Page1styles.label}>Invoice No</Text>
                <Text style={Page1styles.value}>: MYH00664-I1</Text>
              </View>
              <View style={Page1styles.row}>
                <Text style={Page1styles.label}>Payment Amount</Text>
                <Text style={Page1styles.value}>: $8000.00</Text>
              </View>
              <View style={Page1styles.row}>
                <Text style={Page1styles.label}>Payment Mode</Text>
                <Text style={Page1styles.value}>: Cheque</Text>
              </View>
              <View style={Page1styles.row}>
                <Text style={Page1styles.label}>Transaction No</Text>
                <Text style={Page1styles.value}>: 9876446</Text>
              </View>
              <View style={Page1styles.row}>
                <Text style={Page1styles.label}>Payment Details</Text>
                <Text style={Page1styles.value}>: Initial Deposit</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "column",
              alignItems: 'flex-start',
            }}
          >
            <Text style={styles.secondaryText}>
              Terms and Conditions goes here.........
            </Text>
          </View>
        </View>
      </PageLayout>
    </Document>
  )
};

export default InvoiceReceiptPdf;

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: "#fff",
    flexDirection: "column",
    fontFamily: "Helvetica",
  },
  body: { paddingTop: 10, flex: 1 },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 6,
  },
  logo: { width: 120, height: 50, objectFit: "contain" },
  headerTextContainer: { flexDirection: "column", alignItems: "flex-end" },
  headerText: { fontSize: 10, textAlign: "left", fontWeight: "bold", marginBottom: 10 },
  secondaryText: { fontSize: 10, textAlign: "left", marginBottom: 10 },
  footerWrapper: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
  },
  footerTopText: {
    fontSize: 9,
    color: "#000",
    textAlign: 'center'
  },
});

const Page1styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginBottom: 20,
  },
  customerRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  customerLabel:{
    width:150
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    width: 100
  },
  value: {
    fontSize: 10,
    flex: 1,
    width: 50,
  },
});
