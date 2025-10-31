'use client';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

type field = {
  label: string;
  isCheckBox: boolean;
  Value: string;
  options?: string[];
};

type data = {
  LocationOfBuildingSite: field[];
  BuildZone: field[];
  SiteFill: field[];
  SiteFall: field[];
  DesignGuidelinesandOtherRequirements: field[];
  RoofType: field[];
  constructiontype: field[];
  setbackForSingleStoreyAndGroundFloor: field[];
  setbackForDoubleStoreyFirstFloor: field[];
};

const AdditionalFieldPdf = ({}) => {
  const data: data = {
    LocationOfBuildingSite: [
      {
        label: 'Sales Consultant',
        isCheckBox: false,
        Value: ' Murthy Muthuswamy',
      },
      {
        label: 'Client Name',
        isCheckBox: false,
        Value: '',
      },
      {
        label: 'Current Address',
        isCheckBox: false,
        Value: '',
      },
      {
        label: 'Deposit Amount',
        isCheckBox: false,
        Value: '',
      },
      {
        label: 'Lot No',
        isCheckBox: false,
        Value: '',
      },
      {
        label: 'Street Name',
        isCheckBox: false,
        Value: 'Street Name',
      },
      {
        label: 'Land Developer',
        isCheckBox: false,
        Value: 'Stockland Developers',
      },
      {
        label: 'EState',
        isCheckBox: false,
        Value: '',
      },
      {
        label: 'Council',
        isCheckBox: false,
        Value: 'Wyndham City Council',
      },
      {
        label: 'Title Date',
        isCheckBox: false,
        Value: '',
      },
      {
        label: 'Land Settlement Date',
        isCheckBox: false,
        Value: '',
      },
      {
        label: 'Bush Fire',
        isCheckBox: true,
        Value: '',
        options: ['Yes', 'No'],
      },
      {
        label: 'Title Volume',
        isCheckBox: false,
        Value: '10567',
      },
      {
        label: 'Folio',
        isCheckBox: false,
        Value: '204',
      },
      {
        label: 'Plan of Subdivision',
        isCheckBox: false,
        Value: 'PS912345X',
      },
      {
        label: 'Lot Size',
        isCheckBox: false,
        Value: '',
      },
      {
        label: 'Lot Type',
        isCheckBox: true,
        Value: '',
        options: ['Standard', 'Irregular'],
      },
      {
        label: 'Site Fall',
        isCheckBox: true,
        Value: '1-2m',
        options: ['Under 1 m', '1-2 m', '2-3 m', 'Above 3 m'],
      },
      {
        label: 'Existing Trees',
        isCheckBox: true,
        Value: 'No',
        options: ['Yes', 'No'],
      },
      {
        label: 'Driveway Location (when facing lot)',
        isCheckBox: true,
        Value: 'Front Left',
        options: ['Front Left', 'Front Right', 'Rear/Side'],
      },
      {
        label: 'Easements',
        isCheckBox: true,
        Value: 'Yes',
        options: ['Yes', 'No'],
      },
      {
        label: 'Build Area up to Easement',
        isCheckBox: true,
        Value: '',
        options: ['Yes', 'No'],
      },
      {
        label: 'Any Sewer Tie (Out of easements) ',
        isCheckBox: true,
        Value: '',
        options: ['Yes', 'No'],
      },
      {
        label: 'Mention Location',
        isCheckBox: false,
        Value: 'sydney',
      },
    ],
    BuildZone: [
      {
        label: 'Zone',
        isCheckBox: false,
        Value: 'North - West',
      },
    ],
    SiteFill: [
      {
        label: 'Finished Surface (m)',
        isCheckBox: false,
        Value: '300.00',
      },
      {
        label: 'Existing Surface (m)',
        isCheckBox: false,
        Value: '10.00',
      },
      {
        label: 'Fill (m)',
        isCheckBox: false,
        Value: '290.00',
      },
      {
        label: 'Max Fill Location (when facing lot)',
        isCheckBox: false,
        Value: 'Rear Left',
      },
    ],
    SiteFall: [
      {
        label: 'Max Finished Surface (m)',
        isCheckBox: false,
        Value: '12.50',
      },
      {
        label: 'Min Finished Surface (m)',
        isCheckBox: false,
        Value: '11.30',
      },
      {
        label: 'Fall (m)',
        isCheckBox: false,
        Value: '1.20',
      },
      {
        label: 'Fall Type',
        isCheckBox: false,
        Value: 'Diagonal front to rear',
      },
      {
        label: 'Storey',
        isCheckBox: false,
        Value: 'Double Storey',
      },
    ],
    DesignGuidelinesandOtherRequirements: [
      {
        label: 'GF Ceiling height',
        isCheckBox: false,
        Value: '2590 mm',
      },
      {
        label: 'FF Ceiling height',
        isCheckBox: false,
        Value: '2400 mm',
      },
      {
        label: 'Eaves Size',
        isCheckBox: true,
        Value: '450 mm',
        options: ['450 mm', '600 mm'],
      },
      {
        label: 'Eaves Return',
        isCheckBox: true,
        Value: 'All Around',
        options: ['2 m', '3 m', '4 m', 'All Around', 'Side Only(Facing Street Corner Lots)', 'N/A'],
      },
      {
        label: 'Eaves location',
        isCheckBox: false,
        Value: 'Front and Sides',
      },
      {
        label: 'Lot Type',
        isCheckBox: true,
        Value: 'Over 300 m2',
        options: ['Under 300 m2(Small Lot Housing Code)', 'Over 300 m2'],
      },
      {
        label: 'Site Coverage Allowed',
        isCheckBox: true,
        Value: '70%',
        options: ['Less Than 60%', '60%', '70%', '80%', '90%'],
      },
    ],
    RoofType: [
      {
        label: 'Roof Covering',
        isCheckBox: true,
        Value: 'Colorbond Roof',
        options: [
          'Concrete Tiles',
          'Standard',
          'Slimline',
          'Flat',
          'Colorbond Roof',
          'With Blanket',
          'With Sarking',
        ],
      },
      {
        label: 'Roof pitch',
        isCheckBox: true,
        Value: '22.5°',
        options: ['15°', '18°', '20°', '22.5°', '25°'],
      },
      {
        label: 'Flat roof pitch',
        isCheckBox: true,
        Value: '5°',
        options: ['5°'],
      },
      {
        label: 'Parapet wall',
        isCheckBox: true,
        Value: 'Front Only',
        options: ['Front Only', 'All around', 'N/A'],
      },
    ],
    constructiontype: [
      {
        label: 'Double Storey GF',
        isCheckBox: true,
        Value: 'Brick',
        options: ['Brick', 'Hebel'],
      },
      {
        label: 'Double Storey FF',
        isCheckBox: true,
        Value: 'Hebel',
        options: ['Brick', 'Poly', 'Hebel'],
      },
      {
        label: 'Wall over the Garage',
        isCheckBox: true,
        Value: '',
        options: ['Brick', 'Poly', 'Hebel'],
      },
      {
        label: 'Wall over the lower roof or flashings',
        isCheckBox: true,
        Value: 'Weatherboard',
        options: ['Poly', 'Xon cladding', 'Weatherboard'],
      },
      {
        label: 'All electric',
        isCheckBox: true,
        Value: 'Yes',
        options: ['Yes', 'No'],
      },
      {
        label: 'Type of cooling',
        isCheckBox: false,
        Value: 'Evaporative Cooling',
      },
      {
        label: 'Garage Door Type',
        isCheckBox: false,
        Value: 'Evaporative Cooling',
      },
      {
        label: 'Connection',
        isCheckBox: true,
        Value: 'NBN',
        options: ['NBN', 'Opticom'],
      },
      {
        label: 'Recycled Water',
        isCheckBox: true,
        Value: 'Yes',
        options: ['Yes', 'No'],
      },
      {
        label: 'Extra Requirement',
        isCheckBox: true,
        Value: 'Rainwater Tank',
        options: ['Rainwater Tank', 'Solar Hot water System', 'Heat Pump'],
      },
      {
        label: '3 Phase',
        isCheckBox: true,
        Value: '',
        options: ['Yes', 'No'],
      },
      {
        label: 'Driveway',
        isCheckBox: true,
        Value: 'By Builder',
        options: ['By Client', 'By Builder'],
      },
      {
        label: 'Corner Lot',
        isCheckBox: true,
        Value: '',
        options: ['Yes', 'No'],
      },
    ],
    setbackForSingleStoreyAndGroundFloor: [
      {
        label: 'Front Wall',
        isCheckBox: false,
        Value: '4.5 m',
      },
      {
        label: 'Between Garage & building line',
        isCheckBox: false,
        Value: '1 m',
      },
      {
        label: 'Garage Side',
        isCheckBox: false,
        Value: '1.2 m',
      },
      {
        label: 'Other Side',
        isCheckBox: false,
        Value: '1 m',
      },
      {
        label: 'Rear',
        isCheckBox: false,
        Value: '3 m',
      },
      {
        label: 'Allowed Porch Encroachment',
        isCheckBox: false,
        Value: '1.5 m',
      },
      {
        label: 'Boundary to Boundary Build',
        isCheckBox: true,
        Value: 'No',
        options: ['Yes', 'No'],
      },
    ],
    setbackForDoubleStoreyFirstFloor: [
      {
        label: 'Boundary to Boundary Construction',
        isCheckBox: true,
        Value: 'No',
        options: ['Yes', 'No'],
      },
      {
        label: 'Front Wall',
        isCheckBox: false,
        Value: '5 m',
      },
      {
        label: 'Garage Side',
        isCheckBox: false,
        Value: '1.2 m',
      },
      {
        label: 'Other Side',
        isCheckBox: false,
        Value: '1.5 m',
      },
      {
        label: 'Rear',
        isCheckBox: false,
        Value: '4 m',
      },
      {
        label: 'Balcony Encroachment',
        isCheckBox: false,
        Value: '1 m',
      },
      {
        label: 'Boundary to Boundary Build',
        isCheckBox: true,
        Value: 'No',
        options: ['Yes', 'No'],
      },
    ],
  };

  const ViewData: React.FC<field> = ({ label, isCheckBox, Value, options }) => (
    <View style={styles.item}>
      <Text style={{ width: 200 }}>{label}</Text>
      <Text>: </Text>
      {isCheckBox ? (
        <View style={{ width: 300, flexDirection: 'row', gap: 2, flexWrap: 'wrap' }}>
          :{' '}
          {options?.map(op =>
            Value === op ? (
              <View style={{ flexDirection: 'row' }}>
                {' '}
                <View style={checkBoxStyle.container}>
                  <Image src="/check.png"></Image>
                </View>{' '}
                <Text>{op}</Text>{' '}
              </View>
            ) : (
              <View style={{ flexDirection: 'row' }}>
                {' '}
                <View style={checkBoxStyle.container}></View> <Text>{op}</Text>{' '}
              </View>
            )
          )}
        </View>
      ) : (
        <Text style={{ width: 300 }}>{Value}</Text>
      )}
    </View>
  );

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
        <View style={styles.titleText}>
          <Text>Additions to New Job Form</Text>
        </View>
        <View style={styles.headerText}>
          <Text>Location Of Building Site</Text>
        </View>
        {data.LocationOfBuildingSite.map(item => (
          <ViewData
            label={item.label}
            isCheckBox={item.isCheckBox}
            Value={item.Value}
            options={item.options}
          />
        ))}
        <View style={styles.headerText}>
          <Text>Build Zone</Text>
        </View>
        {data.BuildZone.map(item => (
          <ViewData
            label={item.label}
            isCheckBox={item.isCheckBox}
            Value={item.Value}
            options={item.options}
          />
        ))}
        <View style={styles.item}>
          <Text style={styles.secondaryText}>
            Site Fill (Enter the values of maximum filled area)
          </Text>
        </View>
        {data.SiteFill.map(item => (
          <ViewData
            label={item.label}
            isCheckBox={item.isCheckBox}
            Value={item.Value}
            options={item.options}
          />
        ))}
        <View style={styles.item}>
          <Text style={styles.secondaryText}>Site Fall (As per Engineering)</Text>
        </View>
        {data.SiteFall.map(item => (
          <ViewData
            label={item.label}
            isCheckBox={item.isCheckBox}
            Value={item.Value}
            options={item.options}
          />
        ))}
        <View style={styles.headerText}>
          <Text>Design Guidelines and Other Requirements</Text>
        </View>
        {data.DesignGuidelinesandOtherRequirements.map(item => (
          <ViewData
            label={item.label}
            isCheckBox={item.isCheckBox}
            Value={item.Value}
            options={item.options}
          />
        ))}
        <View style={styles.item}>
          <Text style={styles.secondaryText}>Roof Type</Text>
        </View>
        {data.RoofType.map(item => (
          <ViewData
            label={item.label}
            isCheckBox={item.isCheckBox}
            Value={item.Value}
            options={item.options}
          />
        ))}
        <View style={styles.item}>
          <Text style={styles.secondaryText}>CONSTRUCTION TYPE</Text>
        </View>
        {data.constructiontype.map(item => (
          <ViewData
            label={item.label}
            isCheckBox={item.isCheckBox}
            Value={item.Value}
            options={item.options}
          />
        ))}
        <View style={styles.item}>
          <Text style={styles.secondaryText}>SETBACK FOR SINGLE STOREY AND GROUND FLOOR</Text>
        </View>
        {data.setbackForSingleStoreyAndGroundFloor.map(item => (
          <ViewData
            label={item.label}
            isCheckBox={item.isCheckBox}
            Value={item.Value}
            options={item.options}
          />
        ))}
        <View style={styles.item}>
          <Text style={styles.secondaryText}>SETBACK FOR DOUBLE STOREY FIRST FLOOR</Text>
        </View>
        {data.setbackForDoubleStoreyFirstFloor.map(item => (
          <ViewData
            label={item.label}
            isCheckBox={item.isCheckBox}
            Value={item.Value}
            options={item.options}
          />
        ))}
        <View style={styles.item}>
          <Text style={styles.secondaryText}>Additional Facade requests / Requirements</Text>
        </View>
        <View>
          <View style={{ fontSize: 10, marginBottom: 10, flexDirection: 'row' }}>
            <View>
              {' '}
              <Text style={{ width: 200 }}>Facade Material Required</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View>
                <Text>: </Text>
              </View>
              <View style={{ width: 300 }}>
                <View style={ItemTable.table}>
                  {/* Header with two columns */}
                  <View style={[ItemTable.row, ItemTable.headerRow]}>
                    <Text
                      style={[
                        ItemTable.cell,
                        ItemTable.col15,
                        { backgroundColor: '#1E3A8A', color: 'white' },
                      ]}
                    >
                      SNO
                    </Text>
                    <Text
                      style={[
                        ItemTable.cell,
                        ItemTable.col40,
                        { backgroundColor: '#1E3A8A', color: 'white' },
                      ]}
                    >
                      Material
                    </Text>
                    <Text
                      style={[
                        ItemTable.cell,
                        ItemTable.col15,
                        { backgroundColor: '#1E3A8A', color: 'white' },
                      ]}
                    >
                      Percentage
                    </Text>
                  </View>
                  <View style={[ItemTable.row, ItemTable.headerRow]}>
                    <Text style={[ItemTable.cell, ItemTable.col15]}>1</Text>
                    <Text style={[ItemTable.cell, ItemTable.col40]}>Brick</Text>
                    <Text style={[ItemTable.cell, ItemTable.col15]}>60</Text>
                  </View>
                  <View style={[ItemTable.row, ItemTable.headerRow]}>
                    <Text style={[ItemTable.cell, ItemTable.col15]}>2</Text>
                    <Text style={[ItemTable.cell, ItemTable.col40]}>Render</Text>
                    <Text style={[ItemTable.cell, ItemTable.col15]}>25</Text>
                  </View>
                  <View style={[ItemTable.row, ItemTable.headerRow]}>
                    <Text style={[ItemTable.cell, ItemTable.col15]}>3</Text>
                    <Text style={[ItemTable.cell, ItemTable.col40]}>Stone Cladding</Text>
                    <Text style={[ItemTable.cell, ItemTable.col15]}>15</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.item}>
            <Text style={{ width: 200 }}>
              Parapet walls with box gutter behind and pitched roof
            </Text>
            <Text>: </Text>
            <View style={{ flexDirection: 'row', gap: 2 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={checkBoxStyle.container}></View>
                <Text>Yes</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={checkBoxStyle.container}>
                  <Image src="/check.png"></Image>
                </View>
                <Text>No</Text>
              </View>
            </View>
          </View>
          <View style={styles.item}>
            <Text style={{ width: 200 }}>Parapet wall with box gutter and tray deck roof</Text>
            <Text>: </Text>
            <View style={{ flexDirection: 'row', gap: 2 }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={checkBoxStyle.container}></View>
                <Text>Yes</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={checkBoxStyle.container}>
                  <Image src="/check.png"></Image>
                </View>
                <Text>No</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <View style={styles.item}>
            <View style={checkBoxStyle.container}>
              <Image src="/check.png"></Image>
            </View>
            <Text>CONCEPT/INSPIRATION (MARKED UP IN RED PEN ONLY AND SCAN IN COLOUR PLEASE)</Text>
          </View>
          <View style={styles.item}>
            <View style={checkBoxStyle.container}>
              <Image src="/check.png"></Image>
            </View>
            <Text>PLAN OF SUBDIVISION AND ENGINEERING</Text>
          </View>
          <View style={styles.item}>
            <View style={checkBoxStyle.container}></View>
            <Text>MEMORANDUM OF COMMON PROVISIONS (MCP)</Text>
          </View>
          <View style={styles.item}>
            <View style={checkBoxStyle.container}>
              <Image src="/check.png"></Image>
            </View>
            <Text>
              DEVELOPER GUIDELINES (IF NOT FOUND ONLY YOU MAY NEED TO CONTACT DEVELOPERS DIRECTLY)
            </Text>
          </View>
          <View style={styles.item}>
            <View style={checkBoxStyle.container}>
              <Image src="/check.png"></Image>
            </View>
            <Text>
              CONTACT FOR SALE (PLEASE NOTE MOST OF THE ABOVE ITEMS CAN BE FOUND IN THE CONTRACT OF
              SALE)
            </Text>
          </View>
          <View style={styles.item}>
            <View style={checkBoxStyle.container}></View>
            <Text>VARATIONAL LIST</Text>
          </View>
        </View>
        <View style={styles.headerText}>
          <Text>Location Of Building Site</Text>
        </View>
        <View style={styles.item}>
          <Text>
            Lot has mild slope, retaining wall required at rear boundary. Ensure compliance with
            Wyndham Council guidelines.
          </Text>
        </View>
      </PageLayout>
    </Document>
  );
};
export default AdditionalFieldPdf;

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
  logo: { width: 120, height: 50, objectFit: 'contain' },
  titleText: {
    alignItems: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
    fontSize: 15,
  },
  headerText: {
    backgroundColor: '#929292',
    fontSize: 10,
    color: 'white',
    padding: 6,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  secondaryText: { fontWeight: 'bold' },
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
  item: {
    fontSize: 10,
    flexDirection: 'row',
    marginBottom: 10,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
});

const checkBoxStyle = StyleSheet.create({
  container: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
});
