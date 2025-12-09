import { Text, View, StyleSheet, Page, Image } from '@react-pdf/renderer';
import { Signature } from './Color';

export const ColorVariation = () => {
    const Footer = () => (
      <View style={styles.footerWrapper} fixed>
        <Text style={styles.footerDate}>30 Sep 2025</Text>
        <Text
          style={styles.footerPageNum}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        />
      </View>
    );
  
    const Header = () => (
      <View style={styles.headerContainer} fixed>
        <Image src="/company-light.png" style={styles.logo} />
      </View>
    );
  
    const PageLayout = ({ children }: { children: React.ReactNode }) => (
      <Page size="A4" style={styles.page}>
        <Header />
        <View style={styles.body}>{children}</View>
        <Footer />
      </Page>
    );
  const colorVariationData = [
    { item: 'Tiles-Premium - new item', drawingChangeRequired: 'No', price: 200.0 },
  ];
  return (
    <PageLayout>
      {/* Right Section */}
      <View style={{ flexDirection: 'column', textAlign: 'right', fontSize: 10 }}>
        <Text> My Home </Text>
        <Text> 45 Tallis Circuit </Text>
        <Text> Truganina,Victoria,3029 </Text>
        <Text> ABN : 82 156 644 478 </Text>
      </View>
      <View style={styles.TitleText}>
        <Text>Color Variation</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <View style={{ marginVertical: 20 }}>
          <View style={[Page1styles.row, styles.secondaryText, { justifyContent: 'flex-end' }]}>
            <Text>Variation Ref : </Text>
            <Text> MYH006644-I1 </Text>
          </View>
          <View style={[Page1styles.row, styles.secondaryText, { justifyContent: 'flex-end' }]}>
            <Text>Job No : </Text>
            <Text>MYH006644</Text>
          </View>
          <View style={[Page1styles.row, styles.secondaryText, { justifyContent: 'flex-end' }]}>
            <Text>Date : </Text>
            <Text>01-10-2025</Text>
          </View>
        </View>
      </View>
       <View>
          <View>
            <Text style={styles.headerText}>Customer Details</Text>
          </View>

          <View style={Page1styles.row}>
            <Text style={[Page1styles.label,styles.secondaryText]}>Name</Text>
            <Text style={styles.secondaryText}>: John Wick </Text>
          </View>
          <View style={Page1styles.row}>
            <Text style={[Page1styles.label,styles.secondaryText]}>Postal Address</Text>
            <Text style={styles.secondaryText}>: asgf,sydny,Victoria,30003</Text>
          </View>
          <View style={Page1styles.row}>
            <Text style={[Page1styles.label,styles.secondaryText]}>Mobile</Text>
            <Text style={styles.secondaryText}>: 0123456789</Text>
          </View>
          <View style={Page1styles.row}>
            <Text style={[Page1styles.label,styles.secondaryText]}>Email</Text>
            <Text style={styles.secondaryText}>: johnwick@gmail.com</Text>
          </View>
          <View style={Page1styles.row}>
        <Text style={[Page1styles.label,styles.secondaryText]}>Job Address</Text>
        <Text style={styles.secondaryText}>: asgf,sydny,Victoria,30003</Text>
      </View>
        </View>
      

      {/* table  */}
      <View style={{ marginTop: 15 }}>
        <View style={ItemTable.table}>
          {/* Header with two columns */}
          <View style={ItemTable.headerRow}>
            <Text style={[ItemTable.cell, ItemTable.col15]}>S. No</Text>
            <Text style={[ItemTable.cell, ItemTable.col40]}>Items</Text>
            <Text style={[ItemTable.cell, ItemTable.col15]}>Drawing Change Required</Text>
            <Text style={[ItemTable.cell, ItemTable.col15]}>Price ($)</Text>
          </View>
          {colorVariationData.map((item, index) => (
            <View style={ItemTable.row} key={index}>
              <Text style={[ItemTable.cell, ItemTable.col15]}>{index}</Text>
              <Text style={[ItemTable.cell, ItemTable.col40]}>{item.item}</Text>
              <Text style={[ItemTable.cell, ItemTable.col15]}>{item.drawingChangeRequired}</Text>
              <Text style={[ItemTable.cell, ItemTable.col15]}>{item.price}</Text>
            </View>
          ))}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              backgroundColor: 'yellow',
              fontSize: 12,
            }}
          >
            <Text style={[ItemTable.cell, ItemTable.col50]}>TOTAL COST INCLUDING GST ($)</Text>
            <Text style={[ItemTable.cell, ItemTable.col15]}>200.00</Text>
          </View>
        </View>
        <Signature items={{ label: "Owner's signature", name: 'John Wick', date: 'Date ' }} />
        <Signature items={{ label: 'Builder signature', name: 'My Home', date: 'Date ' }} />
        <View>
          <Text style={styles.headerText}>Bank Details</Text>
          <Text style={styles.secondaryText}>
            A/C Name : My Home Pty Ltd A/C No : 034 567 BSB : 12345678
          </Text>
        </View>
      </View>
    </PageLayout>
  );
};
const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: '#fff',
    flexDirection: 'column',
    fontFamily: 'Helvetica',
  },
  body: { paddingTop: 10, flex: 1 },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 6,
  },
  TitleText: {
    fontSize: 15,
    alignItems: 'center',
    fontWeight: 'bold',
    marginBottom: 25,
  },
  logo: {
    width: 120,
    height: 50,
    objectFit: 'contain',
  },
  headerText: {
    fontSize: 10,
    textAlign: 'left',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  secondaryText: {
    fontSize: 10,
    textAlign: 'left',
    marginBottom: 10,
    marginRight: 35,
    flexDirection: 'row',
  },
  footerWrapper: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerDate: {
    fontSize: 9,
    color: '#000',
    width: '45%',
    textAlign: 'left',
  },
  footerPageNum: {
    fontSize: 9,
    color: '#000',
    width: '50%',
    textAlign: 'left',
  },
});

const Page1styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  accountrow: {
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  label: {

    width: 150,
  },
});

const ItemTable = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    borderColor: '#000',
    backgroundColor: '#f1f1f1',
  },
  headerRow: {
    backgroundColor: '#1E3A8A',
    color: 'white',
    textAlign: 'center',
    flexDirection: 'row',
    fontWeight: 'bold',
  },
  cell: {
    padding: 4,
    fontSize: 9,
    borderRightWidth: 1,
    borderColor: '#000',
  },
  col50: { flex: 7.3 },
  col40: { flex: 4 },
  col15: { flex: 1.5, textAlign: 'right' },
});
