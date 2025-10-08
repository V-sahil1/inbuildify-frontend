"use client";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const InvoicePdf = ({ }) => {

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
              <Text>Invoice No : </Text>
              <Text> MYH006644-I1 </Text>
            </View>
            <View style={[Page1styles.row, styles.headerText, { justifyContent: 'flex-end' }]}>
              <Text>Job No : </Text>
              <Text>MYH006644</Text>
            </View>
            <View style={[Page1styles.row, styles.secondaryText, { justifyContent: 'flex-end' }]}>
              <Text>Date : </Text>
              <Text>01-10-2025</Text>
            </View>
            <View style={[Page1styles.row, styles.secondaryText, { justifyContent: 'flex-end' }]}>
              <Text>Payment Due: </Text>
              <Text>08-10-2025</Text>
            </View>
          </View>
        </View>
        {/* Customer details */}
        <View><Text style={styles.headerText}>BILL TO</Text></View>
        <View style={[styles.secondaryText, { marginLeft: 20, marginVertical: 20 }]}>

          <View><Text style={styles.headerText}>Customer Details</Text></View>

          <View style={Page1styles.row}>
            <Text style={Page1styles.label}>Name</Text>
            <Text>: John Wick </Text>
          </View>
          <View style={Page1styles.row}>
            <Text style={Page1styles.label}>Postal Address</Text>
            <Text>: asgf,sydny,Victoria,30003</Text>
          </View>
          <View style={Page1styles.row}>
            <Text style={Page1styles.label}>Mobile</Text>
            <Text>: 0123456789</Text>
          </View>
          <View style={Page1styles.row}>
            <Text style={Page1styles.label}>Email</Text>
            <Text>: johnwick@gmail.com</Text>
          </View>
        </View>

        {/* table  */}
        <View style={{ marginTop: 15 }}>
          <View style={ItemTable.table}>
            {/* Header with two columns */}
            <View style={ItemTable.headerRow}>
              <Text style={[ItemTable.cell, ItemTable.col40]}>Description</Text>
              <Text style={[ItemTable.cell, ItemTable.col15]}>Amount</Text>
            </View>
            <View style={ItemTable.row}>
              <Text style={[ItemTable.cell, ItemTable.col40]}>Initial Deposit</Text>
              <Text style={[ItemTable.cell, ItemTable.col15]}>8000</Text>
            </View>

          </View>
        </View>

        {/* below table info */}
       <View style={{flexDirection:'row',justifyContent:'flex-end',marginBottom:20}}>
         <View style={{width:130}}>
            <View style={Page1styles.accountrow}>
              <Text style={styles.secondaryText}>SubTotal : </Text>
              <Text style={styles.secondaryText}>$7000.00</Text>
            </View>
            <View style={Page1styles.accountrow}>
              <Text style={styles.secondaryText}>GST : </Text>
              <Text style={styles.secondaryText}>$27.00</Text>
            </View>
            <View style={Page1styles.accountrow}>
              <Text style={styles.headerText}>Total : </Text>
              <Text style={styles.headerText}>$7027.00</Text>
            </View>
          </View>
       </View>
        <View>
          <Text style={styles.headerText}>
            Please credit funds direct to the following account details :
          </Text>
          <Text style={styles.secondaryText}>
            A/C Name : My Home Pty Ltd, A/C No : 034 567,BSB : 12345678
          </Text>
        </View>
      </PageLayout>
    </Document>
  )
};

export default InvoicePdf;

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
    marginBottom: 6,
  },
  accountrow:{
    marginBottom:4,
    flexDirection: "row",
    justifyContent:'space-between',
    borderBottomWidth:1,
    borderColor:'gray'
  },
  label:{
    width:150
  }
});

const ItemTable = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    borderColor: "#000",
    backgroundColor: "#f1f1f1",
  },
  headerRow: {
    backgroundColor: '#1E3A8A',
    color: 'white',
    textAlign: 'center',
    flexDirection: "row",
    fontWeight: 'bold'
  },
  cell: {
    padding: 4,
    fontSize: 9,
    borderRightWidth: 1,
    borderColor: "#000",
  },
  col40: { flex: 4 },
  col15: { flex: 1.5, textAlign: "right" },
});