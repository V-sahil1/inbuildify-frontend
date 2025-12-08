'use client';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { HomeInclusion } from './HomeInclusion';
import { TermsAndCondition } from './TermsAndCondition';
import { ContractTerms } from './ContractTerms';

const QuotationsPdf = ({}) => {
  const data = {
    basePrice: [
      { name: 'Base price for single storey 1 sq', uom: 'Sq', units: '1', price: '15,000.00' },
      { name: 'new item included', uom: 'abc', units: '1', price: 'cash' },
      { name: 'new additional item', uom: 'Sq', units: '1', price: '400.00' },
    ],
    development: [
      {
        name: 'Site Cleaning – no debris and grass before site start',
        uom: '',
        units: '1',
        price: 'By Customer',
      },
      {
        name: 'Additional costs will be incurred if survey pegs are misplaced or Garage to be built on Boundary',
        uom: '',
        units: '1',
        price: 'Note',
      },
    ],
    garage: [
      {
        name: 'Provide 2 sets of remote controls inclusive of drive motor and electrics to the STD panel lift door',
        uom: '',
        units: '1',
        price: 'Package',
      },
    ],
    laundry: [
      {
        name: 'Provide stainless steel trough with cupboard underneath up to one meter in length',
        uom: '',
        units: '1',
        price: 'Package',
      },
    ],
    doors: [
      {
        name: 'Provide allowance for 1020mm x 2040mm entry door',
        uom: '',
        units: '1',
        price: 'Package',
      },
      {
        name: '2040 high internal doors',
        uom: '',
        units: '1',
        price: 'Package',
      },
      {
        name: 'Main Entry Door 1020mm/2340mm high hinged door with clear glass insert',
        uom: '',
        units: '1',
        price: 'Included',
      },
    ],
    internal: [
      {
        name: 'Flyscreen to all open-able windows',
        uom: '',
        units: '1',
        price: 'Package',
      },
    ],
    appliances: [
      {
        name: `900mm Gas Cooktop - Technika-H950STXFPRO
900mm Electric Canopy Rangehood - Technika-CHEM52C9S-5
900mm Electric Oven - Technika-T948SS-6`,
        uom: '',
        units: '1',
        price: 'Included',
      },
    ],
    facade: [
      {
        name: 'My choice facade 3 Luxury - Double Storey',
        uom: '',
        units: '',
        price: 'Standard',
      },
    ],
    floorPlan: [
      {
        name: 'Floor Plan',
        uom: '',
        units: '',
        price: 'Included',
      },
    ],
  };
  const inclusionData = [
    {
      label: 'SiteCosts And Connections',
      points: [
        'Site cost & connection based on land size up to 450m2, and up to 300mm fall overbuilding',
        'Excludes electricity, water tap and telephone costumer account opening fees.',
        'kkkk',
      ],
    },
    {
      label: ' External Features',
      points: [
        'Facades as per design',
        'Rendering at the front pillars',
        'Timber look garage door',
        'Exposed driveway',
        'Exposed walkway to front',
      ],
    },
    {
      label: 'Internal Feature',
      points: [
        '3m High ceiling',
        '3 coat paint Dulux',
        '2 coat paint ceiling',
        'Metal look door stoppers',
      ],
    },
    {
      label: 'Doors',
      points: [
        '2040 mm x 920 mm Entry door',
        'Laundry external sliding Aluminum door 2100x1450',
        'Stacker Aluminum door to Alfresco 2100x2700',
      ],
    },
    {
      label: 'Door furniture',
      points: [
        'Gainsborough terrace to remaining external doors',
        'Lemar lever door handles to internal doors throughout',
        'Tri lock lever to front door',
      ],
    },
    {
      label: 'Robes and Linen',
      points: [
        'Sliding mirrored doors robes to entire house as per plan',
        'Partition and sliding door in WIR as per plan',
        'Master bedroom WIR (1 hanging, 4 boxes and set of drawers)',
        'Robe sizes 820x2040',
      ],
    },
    {
      label: 'Laundry',
      points: [
        'broom cupboard',
        '45-litre laundry sink and tap',
        'bottom cabinet',
        'Laundry sink with 20mm stone (builders range)',
      ],
    },
    {
      label: 'Bathroom and Ensuite',
      points: [
        'Custom made laminated cabinets',
        'Double vanity in ensuite',
        'Semi framed shower glass',
        'Large vanity mirror or 2 singles with polished raised edge',
      ],
    },
    {
      label: ' Kitchen',
      points: [
        'Standard door handles from category 1 range-soft close',
        '20mm stone bench top (builders range)',
        'Microwave space',
        '2 bank of drawer (top drawer with cutlery insert)',
      ],
    },

    {
      label: ' Paint work',
      points: [
        'Gloss enamel to the Entrance door',
        'Low sheen acrylic to external timberwork and external doors',
        'Flat acrylic to ceilings',
        'Washable acrylic to internal walls',
      ],
    },

    {
      label: 'Electrical',
      points: [
        'Earth leakage electrical safety switch to lights and power point',
        'RCD safety switch with circuit breaker to the meter box',
        'HPM white plates to switch',
        'L.E.D Screen Intercom',
      ],
    },

    {
      label: 'Garage',
      points: [
        'Plaster board ceiling to garage',
        'Garage height max 2210x4800',
        '75mm plaster cove cornice to garage',
        'Remote control roller door with timber look (double garage)',
      ],
    },

    {
      label: 'Floor Covering',
      points: [
        'Timber laminated flooring 12 mm throughout the house or carpet $80 Per Linear m.',
        'Porcelain Tiles 600x600 up to $25 per sqm in wet areas only',
      ],
    },
  ];

  const ImportantNotes = [
    'Our Suppliers use quality materials in the manufacturing process of your splash-back in accordance to Australian Standards',
    'GlassSplashbacks may be subjected to colour variation conditional in different light condition; this is due to the iron content in the glass.',
    'Breakage cannot be a process of warranty, as it can be due to impact or spontaneous breakage. Spontaneous breakage is a very rare occurrence which is caused by the formation of nickel sulphide (Minutes impurities in glass) which occurs in the manufacturing process of all toughened glass. No toughened glass can be guaranteed against spontaneous breakage.',
    'Recommended the product not be installed next to a high flame cooking area as this may cause the paint to discolour.',
    'Gas burners less than 140mm from the centre of the burner to the glass and utensils “Resting” against splashback will void the warranty.',
    'Prolonged cooking at extreme temperature can still cause paint burning discoloration.',
    'Silicon is applied to all edges for sealing, expansion, and contraction. The use of strong chemical cleaning agent may cause discolouring of these seals.',
  ];
  const Viewtabledata = ({ item }) => {
    return (
      <View style={ItemTable.row}>
        <Text style={[ItemTable.cell, ItemTable.col40]}>{item.name}</Text>
        <Text style={[ItemTable.cell, ItemTable.col15]}>{item.uom}</Text>
        <Text style={[ItemTable.cell, ItemTable.col15]}>{item.units}</Text>
        <Text style={[ItemTable.cell, ItemTable.col15]}>{item.price}</Text>
      </View>
    );
  };

  const Footer = () => (
    <View style={styles.footerWrapper} fixed>
      <View style={{ alignItems: 'center' }}>
        <Text
          style={styles.footerTopText}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
        />
      </View>
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
  return (
    <Document>
      <PageLayout>
        <View style={{paddingHorizontal:20}}>
<View style={styles.TitleText}>
          <Text>Sales Tender</Text>
        </View>
        <View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: '50%' }}>
              <View style={Page1styles.row}>
                <Text style={Page1styles.label}>Client Name:</Text>
                <Text style={Page1styles.value}>John Wick</Text>
              </View>
              <View style={Page1styles.row}>
                <Text style={Page1styles.label}>Postal Address:</Text>
                <Text style={Page1styles.value}>asdfg,sydney,vic,3000</Text>
              </View>
              <View style={Page1styles.row}>
                <Text style={Page1styles.label}>Mobile:</Text>
                <Text style={Page1styles.value}>112323242</Text>
              </View>
              <View style={Page1styles.row}>
                <Text style={Page1styles.label}>Email:</Text>
                <Text style={Page1styles.value}>John@gmail.com</Text>
              </View>
              <View style={Page1styles.row}>
                <Text style={Page1styles.label}>Expiry Date:</Text>
                <Text style={Page1styles.value}>29/11/2025</Text>
              </View>
            </View>
            <View style={{ width: '50%' }}>
              <View style={Page1styles.row}>
                <Text style={Page1styles.label}>Ref:</Text>
                <Text style={Page1styles.value}>123213</Text>
              </View>
              <View style={Page1styles.row}>
                <Text style={Page1styles.label}>Job No:</Text>
                <Text style={Page1styles.value}>12421423</Text>
              </View>
              <View style={Page1styles.row}>
                <Text style={Page1styles.label}>Date:</Text>
                <Text style={Page1styles.value}>29/11/2025</Text>
              </View>
            </View>
          </View>

          <View style={Page1styles.row}>
            <Text style={[Page1styles.label, { fontWeight: 'bold' }]}>Site Address:</Text>
            <Text style={Page1styles.value}>John Wick</Text>
          </View>
          <View style={styles.subHeader}>
            <Text>Premium Pack worth $1000</Text>
            <Text>$10000</Text>
          </View>
          <View style={{ marginLeft: 5 }}>
            <View style={[styles.secondaryText, { flexDirection: 'row', gap: 3 }]}>
              <Text>1.</Text>
              <Text>
                Provide 2 sets of remote controls inclusive of drive motor and electrics to the STD
                panel lift door
              </Text>
            </View>
            <View style={[styles.secondaryText, { flexDirection: 'row', gap: 3 }]}>
              <Text>2.</Text>
              <Text>
                Provide stainless steel trough with cupboard underneath up to one meter in length
              </Text>
            </View>
            <View style={[styles.secondaryText, { flexDirection: 'row', gap: 3 }]}>
              <Text>3.</Text>
              <Text>Provide allowance for 1020mm x 2040mm entry door</Text>
            </View>
            <View style={[styles.secondaryText, { flexDirection: 'row', gap: 3 }]}>
              <Text>4.</Text>
              <Text>2040 high internal doors</Text>
            </View>
            <View style={[styles.secondaryText, { flexDirection: 'row', gap: 3 }]}>
              <Text>5.</Text>
              <Text>Flyscreen to all open-able windows</Text>
            </View>
          </View>
          <View style={ItemTable.table}>
            <View style={ItemTable.headerRow}>
              <Text style={[ItemTable.cell, ItemTable.col40]}>Items</Text>
              <Text style={[ItemTable.cell, ItemTable.col15]}>UOM</Text>
              <Text style={[ItemTable.cell, ItemTable.col15]}>Units</Text>
              <Text style={[ItemTable.cell, ItemTable.col15]}>price($)</Text>
            </View>
            <Text style={styles.subHeader}>Base Price</Text>
            {data.basePrice.map((item, index) => (
              <Viewtabledata key={index} item={item} />
            ))}
            <Text style={styles.subHeader}>Developments</Text>
            {data.development.map((item, index) => (
              <Viewtabledata key={index} item={item} />
            ))}
            <Text style={styles.subHeader}>Garage</Text>
            {data.garage.map((item, index) => (
              <Viewtabledata key={index} item={item} />
            ))}
            <Text style={styles.subHeader}>Laundry</Text>
            {data.laundry.map((item, index) => (
              <Viewtabledata key={index} item={item} />
            ))}
            <Text style={styles.subHeader}>Doors</Text>
            {data.doors.map((item, index) => (
              <Viewtabledata key={index} item={item} />
            ))}
            <Text style={styles.subHeader}>Internal</Text>
            {data.internal.map((item, index) => (
              <Viewtabledata key={index} item={item} />
            ))}
            <Text style={styles.subHeader}>Appliances</Text>
            {data.appliances.map((item, index) => (
              <Viewtabledata key={index} item={item} />
            ))}
            <Text style={styles.subHeader}>Facade</Text>
            {data.facade.map((item, index) => (
              <Viewtabledata key={index} item={item} />
            ))}
            <Text style={styles.subHeader}>Floorplan</Text>
            {data.floorPlan.map((item, index) => (
              <Viewtabledata key={index} item={item} />
            ))}
            <Text style={{ backgroundColor: '#FDFF06', fontSize: 10, textAlign: 'right' }}>
              Total Cost : $25400
            </Text>
          </View>
        </View>
        </View>
        
      </PageLayout>
      <PageLayout>
        <View>
          <Text style={styles.headerText}>Facade Details</Text>
          {data.facade.map((item, index) => (
            <Image
              key={`facade-${index}`}
              src="/company-light.png"
              style={{ width: 400, height: 200 }}
            />
          ))}
        </View>
      </PageLayout>
      <PageLayout>
        <View>
          <Text style={styles.headerText}>Floorplan Details</Text>
          {data.floorPlan.map((item, index) => (
            <Image
              key={`floorplan-${index}`}
              src="/company-light.png"
              style={{ width: 400, height: 200 }}
            />
          ))}
        </View>
      </PageLayout>
      <PageLayout>
        <HomeInclusion data={inclusionData} ImportantNotes={ImportantNotes} />
      </PageLayout>
      <PageLayout>
        <TermsAndCondition />
        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={[
              { flexDirection: 'row', justifyContent: 'space-between', fontSize: 10 },
              styles.secondaryText,
            ]}
          >
            <Text>Total Cost</Text>
            <Text>Note: All prices aree GST inclusive</Text>
            <Text>$25000-$30000</Text>
          </View>
          <View
            style={[
              { flexDirection: 'row', justifyContent: 'space-between' },
              styles.secondaryText,
            ]}
          >
            <Text>Your Representative Owners Signature Kishan</Text>
            <Text>Phone 2121154546</Text>
          </View>
          <View
            style={[
              { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
              styles.secondaryText,
            ]}
          >
            <Text>____________________________________</Text>
            <Text>____________________________________</Text>
          </View>
          <View
            style={[
              { flexDirection: 'row', justifyContent: 'space-between' },
              styles.secondaryText,
            ]}
          >
            <Text>John Wick</Text>
            <Text>Date</Text>
          </View>
          <View style={[{ flexDirection: 'row', gap: 5 }, styles.secondaryText]}>
            <Text>Builder Address : </Text>
            <Text>My Home</Text>
          </View>
          <View style={[{ flexDirection: 'row', gap: 5 }, styles.secondaryText]}>
            <Text>Bank Details : </Text>
            <Text>BSB 033-234, A/C No: 123434234, A/C Name: My Home</Text>
          </View>
        </View>
      </PageLayout>
      <PageLayout>
        <View style={styles.TitleText}>
          <Text>Contract Terms</Text>
        </View>
        <View style={[styles.secondaryText, { fontWeight: 'bold',paddingHorizontal:20 }]}>
          <Text style={{ marginBottom: 20 }}>Job Address: </Text>
          <Text style={{ marginBottom: 20 }}>Lot: </Text>
          <Text style={{ marginBottom: 20 }}>Street Number: </Text>
          <Text style={{ marginBottom: 20 }}>Estate Name: </Text>
          <Text style={{ marginBottom: 20 }}>Sales Consultant: </Text>
        </View>
        <ContractTerms />
      </PageLayout>
    </Document>
  );
};

export default QuotationsPdf;
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#E63946',
    color: 'white',
    fontSize: 10,
    padding: 5,
  },
  cell: {
    padding: 4,
    fontSize: 9,
    borderRightWidth: 1,
    borderColor: '#000',
  },

  col40: { flex: 4 },
  col15: { flex: 1.5, textAlign: 'right' },
  col100: { flex: 1 },
});
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
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1E3A8A',
    color: 'white',
    padding: 3,
    fontSize: 10,
    textAlign: 'left',
    // marginBottom: 10,
  },
  logo: { width: 120, height: 50, objectFit: 'contain' },
  headerTextContainer: { flexDirection: 'column', alignItems: 'flex-end' },
  headerText: { fontSize: 10, textAlign: 'left', fontWeight: 'bold', marginBottom: 10 },
  secondaryText: { fontSize: 10, textAlign: 'left', marginBottom: 10 },
  footerWrapper: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  footerTopText: {
    fontSize: 9,
    color: '#000',
    textAlign: 'center',
  },
  TitleText: {
    fontSize: 15,
    alignItems: 'center',
    fontWeight: 'bold',
    marginBottom: 25,
  },
});

const Page1styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  customerRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  customerLabel: {
    width: 150,
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    width: 100,
  },
  value: {
    fontSize: 10,
    flex: 1,
    width: 100,
  },
});
