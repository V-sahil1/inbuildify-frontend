'use client';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const colorData = [
  {
    category: 'BRICKS',
    items: [
      {
        color: 'Cream',
        status: 'Standard',
        itemName: 'ACCESS RANGE',
        imageURL: 'https://img.icons8.com/ios-filled/50/e63946/phone.png',
        items: 'Standard',
        cost: null,
      },
      {
        color: 'Tan',
        status: 'Standard',
        itemName: 'ACCESS RANGE',
        imageURL: 'https://img.icons8.com/ios-filled/50/e63946/phone.png',
        items: 'Standard',
        cost: null,
      },
      {
        color: 'ChestNut',
        status: 'Standard',
        itemName: 'Category 1',
        imageURL: 'https://img.icons8.com/ios-filled/50/e63946/phone.png',
        items: 'Code: BCC001, Supplie: Austral Bricks',
        cost: null,
      },
    ],
  },
  {
    category: 'ROOF TILES',
    items: [
      {
        color: 'Ebony',
        status: 'Standard',
        itemName: 'BORAL SLIM LINE CONCRETE TILES',
        imageURL: 'https://img.icons8.com/ios-filled/50/e63946/phone.png',
        items: 'Standard',
        cost: null,
      },
      {
        color: 'Gunmetal',
        status: 'Standard',
        itemName: 'BORAL SLIM LINE CONCRETE TILES',
        imageURL: 'https://img.icons8.com/ios-filled/50/e63946/phone.png',
        items: 'Standard',
        cost: null,
      },
      {
        color: 'Charcoal Grey',
        status: 'Standard',
        itemName: 'Classic Range',
        imageURL: 'https://img.icons8.com/ios-filled/50/e63946/phone.png', // Placeholder
        items: 'Standard',
        cost: null,
      },
    ],
  },
  {
    category: 'DOORS',
    items: [
      {
        color: 'External 1', // Description/Color field for door
        status: 'Upgrade',
        itemName: 'Entry Door',
        imageURL: 'https://img.icons8.com/ios-filled/50/e63946/phone.png', // Placeholder
        items: 'Upgrade',
        cost: '800.00', // Upgrade cost
      },
    ],
  },
  {
    category: 'FLOORING',
    items: [
      {
        color: 'Matang Cappuccino',
        status: 'Standard',
        itemName: 'Tiles',
        imageURL: 'https://img.icons8.com/ios-filled/50/e63946/phone.png', // Placeholder
        items: 'Code: FTM001, Supplie: Building Suppliers',
        cost: null,
      },
    ],
  },
  {
    category: 'KITCHEN', // This section appears to be for upgrades
    items: [
      {
        color: 'Chrome Matte',
        status: 'Upgrade',
        itemName: 'Kitchen Cabinetry Handles',
        imageURL: 'https://img.icons8.com/ios-filled/50/e63946/phone.png', // Placeholder
        items: 'Cost: $50.00 x 5 Units',
        cost: '250.00',
      },
    ],
  },
];

export const ColorPdf = ({}) => {
  const Footer = () => (
    <View style={styles.footerWrapper} fixed>
      {/* Top White Row */}
      <View style={styles.footerTop}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 6,
          }}
        >
          <Text style={styles.footerTopText}>
            {new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}
          </Text>
          <Text style={styles.footerTopText}>Job address: 123,australia farm</Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 6,
          }}
        >
          <Text style={styles.footerTopText}>Initial................ / ................</Text>
          <Text
            style={styles.footerTopText}
            render={({ pageNumber }) => `Page ${pageNumber} of ${pageNumber}`}
          />
        </View>
      </View>
    </View>
  );

  const Header = () => (
    <View style={styles.headerContainer} fixed>
      <Image
        src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"
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

  const Signature = () => (
    <View fixed>
      {/* Top White Row */}
      <View style={styles.signatureTop}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 6,
          }}
        >
          <Text style={styles.footerTopText}>Owner's signature</Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Text style={styles.footerTopText}>___________________________</Text>
          <Text style={styles.footerTopText}>name of lead</Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Text style={styles.footerTopText}>___________________________</Text>
          <Text style={styles.footerTopText}>Date</Text>
        </View>
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
        {/* Job Details Section */}
        {/* Job Details Section */}
        <View
          style={[Page1styles.section, { flexDirection: 'row', justifyContent: 'space-between' }]}
        >
          {/* Left Column */}
          <View style={{ flex: 1 }}>
            <View style={Page1styles.row}>
              <Text style={Page1styles.label}>Job Address : </Text>
              <Text style={Page1styles.value}>Lot 300 Tallis Cct, Tarneit, VIC, 5345</Text>
            </View>
            <View style={Page1styles.row}>
              <Text style={Page1styles.label}>House Type : </Text>
              <Text style={Page1styles.value}>My Home 1</Text>
            </View>
            <View style={Page1styles.row}>
              <Text style={Page1styles.label}>Facade : </Text>
              <Text style={Page1styles.value}>LKL 81</Text>
            </View>
            <View style={Page1styles.row}>
              <Text style={Page1styles.label}>Selected Templates : </Text>
              <Text style={Page1styles.value}>Colour Board Deluxe</Text>
            </View>
          </View>

          {/* Right Column */}
          <View style={{ flex: 1 }}>
            <View style={Page1styles.row}>
              <Text style={Page1styles.label}>Customer Name : </Text>
              <Text style={Page1styles.value}>Murthy</Text>
            </View>
            <View style={Page1styles.row}>
              <Text style={Page1styles.label}>Ref No : </Text>
              <Text style={Page1styles.value}>MYH00486</Text>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 15 }}>
          <View style={ItemTable.table}>
            {/* Header with two columns */}
            <View style={[ItemTable.row, ItemTable.headerRow]}>
              <Text style={[ItemTable.cell, ItemTable.col40]}>Color</Text>
              <Text style={[ItemTable.cell, ItemTable.col15]}>Image</Text>
              <Text style={[ItemTable.cell, ItemTable.col15]}>Item Name</Text>
              <Text style={[ItemTable.cell, ItemTable.col15]}>Items</Text>
              <Text style={[ItemTable.cell, ItemTable.col15]}>Cost($)</Text>
            </View>

            {/* Rows with two columns */}
            {colorData.map((categoryGroup, index) => (
              // Outer map: Iterate over each category (BRICKS, ROOF TILES, etc.)
              <>
                {/* Category Title Row (Spanning all columns) */}
                <View style={[ItemTable.row, ItemTable.categoryHeaderRow]}>
                  <Text
                    style={[
                      ItemTable.cell,
                      ItemTable.col100,
                      {
                        fontWeight: 'bold',
                        paddingVertical: 5,
                        backgroundColor: '#f0f0f0',
                      },
                    ]}
                  >
                    {categoryGroup.category}
                  </Text>
                </View>

                {/* Inner map: Iterate over the items within the current category */}
                {categoryGroup.items.map((item, i) => (
                  <View key={`${index}-${i}`} style={ItemTable.row}>
                    {/* Column 1: Color / Description (col40) */}
                    <Text style={[ItemTable.cell, ItemTable.col40]}>
                      <Text style={{ fontSize: 8, color: '#999' }}>
                        {item.status || 'Standard'}
                      </Text>
                      {'\n'}
                      {item.color}
                    </Text>

                    <Image
                      src={item.imageURL}
                      style={[ItemTable.cell, ItemTable.col15, { width: 20, height: 30 }]}
                    />

                    {/* Column 3: Item Name (col15) */}
                    <Text style={[ItemTable.cell, ItemTable.col15]}>{item.itemName}</Text>

                    {/* Column 4: Items / Code / Quantity (col15) */}
                    <Text style={[ItemTable.cell, ItemTable.col15]}>{item.items}</Text>

                    {/* Column 5: Cost($) (col15) */}
                    <Text style={[ItemTable.cell, ItemTable.col15]}>
                      {item.cost ? `$${item.cost}` : '-'}
                    </Text>
                  </View>
                ))}
              </>
            ))}
            {/* Total row with two columns and a span */}
            <View style={[ItemTable.row, ItemTable.totalRow]}>
              <Text
                style={[
                  ItemTable.cell,
                  ItemTable.col100,
                  { borderRightWidth: 0, textAlign: 'right' },
                ]}
              >
                Total Amount : $ 3000
              </Text>
            </View>
          </View>
        </View>
        <Signature />
      </PageLayout>
    </Document>
  );
};

export default ColorPdf;

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
    position: 'absolute',
    top: 20,
    left: 0,
    right: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 6,
  },
  logo: { width: 120, height: 50, objectFit: 'contain' },
  headerTextContainer: { flexDirection: 'column', alignItems: 'flex-end' },
  headerText: { fontSize: 10, textAlign: 'right' },
  footerWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  signatureTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  footerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 4,
  },
  footerTopText: {
    fontSize: 9,
    color: '#000',
  },
  footerBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E3A8A', // blue
    borderTop: '3pt solid #E63946', // red border
    paddingVertical: 6,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  footerIconImg: {
    width: 12,
    height: 12,
    marginRight: 6,
  },
  footerText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: 'bold',
  },
});

const Page1styles = StyleSheet.create({
  section: {
    marginTop: 60,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 11,
    flex: 1,
    width: 50,
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
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  headerRow: {
    backgroundColor: '#f1f1f1',
  },
  totalRow: {
    backgroundColor: '#e6f0ff',
  },
  cell: {
    padding: 4,
    fontSize: 9,
    borderRightWidth: 1,
    borderColor: '#000',
  },
  centerText: {
    textAlign: 'center',
  },
  categoryHeaderRow: {
    backgroundColor: '#f1f1f1',
  },
  col40: { flex: 4 },
  col15: { flex: 1.5, textAlign: 'right' },
  col100: { flex: 1 },
});
